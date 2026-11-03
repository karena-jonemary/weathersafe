// Data Processing and Validation: checks and formats raw API data before
// any other module uses it. Invalid values become null; unusable payloads throw.
import { dayKey } from './format';

export class DataError extends Error {}

/** Returns v when it is a finite number within [lo, hi], otherwise null. */
export const inRange = (v, lo, hi) =>
  typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi ? v : null;

const visibilityKm = (meters) => (meters != null ? Math.min(meters / 1000, 10) : 10);

export function processCurrent(raw) {
  if (!raw || !raw.main || !Array.isArray(raw.weather) || !raw.weather[0]) {
    throw new DataError('Incomplete weather data received.');
  }
  const w = raw.weather[0];
  const wind = raw.wind || {};
  const temp = inRange(raw.main.temp, -90, 60);
  if (temp === null) throw new DataError('Received an invalid temperature value.');

  return {
    city: raw.name || 'Unknown location',
    country: raw.sys?.country || '',
    lat: raw.coord?.lat,
    lon: raw.coord?.lon,
    tz: Number.isFinite(raw.timezone) ? raw.timezone : 0,
    dt: raw.dt,
    temp,
    feels: inRange(raw.main.feels_like, -90, 70) ?? temp,
    min: inRange(raw.main.temp_min, -90, 60),
    max: inRange(raw.main.temp_max, -90, 60),
    humidity: inRange(raw.main.humidity, 0, 100),
    pressure: inRange(raw.main.pressure, 800, 1100),
    wind: inRange(wind.speed, 0, 120) ?? 0,
    gust: inRange(wind.gust, 0, 150),
    deg: inRange(wind.deg, 0, 360),
    visibility: visibilityKm(raw.visibility),
    clouds: inRange(raw.clouds?.all, 0, 100) ?? 0,
    cond: { id: w.id, main: w.main, desc: w.description || w.main, icon: w.icon || '' },
    sunrise: raw.sys?.sunrise,
    sunset: raw.sys?.sunset,
    rain: raw.rain?.['1h'] || 0,
    snow: raw.snow?.['1h'] || 0,
  };
}

export function processForecast(raw) {
  if (!raw || !Array.isArray(raw.list) || raw.list.length === 0) {
    throw new DataError('Forecast data is unavailable.');
  }
  const tz = Number.isFinite(raw.city?.timezone) ? raw.city.timezone : 0;

  const slots = raw.list
    .filter((i) => i && i.main && i.weather?.[0] && inRange(i.main.temp, -90, 60) !== null)
    .map((i) => ({
      dt: i.dt,
      temp: i.main.temp,
      feels: inRange(i.main.feels_like, -90, 70) ?? i.main.temp,
      humidity: i.main.humidity,
      wind: inRange(i.wind?.speed, 0, 120) ?? 0,
      gust: inRange(i.wind?.gust, 0, 150),
      pop: Math.round((inRange(i.pop, 0, 1) ?? 0) * 100), // chance of rain, %
      visibility: visibilityKm(i.visibility),
      cond: {
        id: i.weather[0].id,
        main: i.weather[0].main,
        desc: i.weather[0].description,
        icon: i.weather[0].icon || '',
      },
      rain: (i.rain?.['3h'] || 0) / 3, // mm per hour
      snow: (i.snow?.['3h'] || 0) / 3,
    }));

  if (slots.length === 0) throw new DataError('Forecast data is invalid.');
  return { slots, tz };
}

/** Groups 3-hourly slots into one summary per local calendar day. */
export function groupDaily(slots, tz) {
  const byDay = {};
  slots.forEach((s) => (byDay[dayKey(s.dt, tz)] ||= []).push(s));

  return Object.entries(byDay).map(([key, arr]) => {
    const groups = {};
    arr.forEach((s) => {
      const g = s.cond.id === 800 ? 8 : Math.floor(s.cond.id / 100);
      (groups[g] ||= []).push(s);
    });
    const dominant = Object.values(groups).sort((a, b) => b.length - a.length)[0][0];
    return {
      key,
      dt: arr[0].dt,
      min: Math.min(...arr.map((s) => s.temp)),
      max: Math.max(...arr.map((s) => s.temp)),
      pop: Math.max(...arr.map((s) => s.pop)),
      wind: Math.max(...arr.map((s) => s.wind)),
      cond: dominant.cond,
    };
  });
}

export function processAir(raw) {
  const a = raw?.list?.[0];
  if (!a || !a.main || !(a.main.aqi >= 1 && a.main.aqi <= 5)) return null;
  return { aqi: a.main.aqi, pm25: a.components?.pm2_5, pm10: a.components?.pm10 };
}
