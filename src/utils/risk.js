// Weather Alert and Risk Assessment.
// Levels: 0 = Low, 1 = Moderate, 2 = High, 3 = Severe.
// NOTE: thresholds below are general guidance, NOT official warnings.
import { formatTemp, formatTime, kmh } from './format';

/** Reduces a current-weather or forecast record to the fields the rules need. */
export const toSnapshot = (s) => ({
  temp: s.temp,
  feels: s.feels,
  wind: Math.max(s.wind || 0, s.gust || 0),
  visibility: s.visibility ?? 10,
  id: s.cond.id,
  rain: s.rain || 0,
  snow: s.snow || 0,
  pop: s.pop ?? 0,
});

/** First rule whose threshold is met (rules are ordered most severe first). */
const tier = (value, rules) => {
  for (const [threshold, level, title] of rules) if (value >= threshold) return [level, title];
  return null;
};

const SEVERE_STORM_IDS = [202, 212, 221, 232];
const RAIN_LEVEL_BY_CODE = { 501: 1, 511: 1, 521: 1, 502: 2, 522: 2, 531: 2, 503: 3, 504: 3 };
const SNOW_LEVEL_BY_CODE = {
  600: 0, 620: 0, 601: 1, 611: 1, 612: 1, 613: 1, 615: 1, 616: 1, 621: 1, 602: 2, 622: 2,
};

/** Evaluates one weather snapshot and returns a list of hazards. */
export function evaluateSnapshot(s, unit = 'C') {
  const out = [];
  const add = (type, level, title, detail) => out.push({ type, level, title, detail });
  let hit;

  hit = tier(s.feels, [[45, 3, 'Extreme heat'], [41, 2, 'Dangerous heat'], [35, 1, 'Hot conditions']]);
  if (hit) add('heat', hit[0], hit[1], `Feels like ${formatTemp(s.feels, unit)}`);

  hit = tier(-s.temp, [[10, 3, 'Extreme cold'], [0, 2, 'Freezing temperatures'], [-5, 1, 'Cold conditions']]);
  if (hit) add('cold', hit[0], hit[1], `Temperature ${formatTemp(s.temp, unit)}`);

  hit = tier(s.wind, [[24.5, 3, 'Storm-force winds'], [17.2, 2, 'Gale-force winds'], [10.8, 1, 'Strong winds']]);
  if (hit) add('wind', hit[0], hit[1], `Gusts up to ${kmh(s.wind)} km/h`);

  if (s.id >= 200 && s.id < 300) {
    const severe = SEVERE_STORM_IDS.includes(s.id);
    add('storm', severe ? 3 : 2, severe ? 'Severe thunderstorm' : 'Thunderstorm', 'Lightning and heavy downpours possible');
  }
  if (s.id === 781) add('storm', 3, 'Tornado', 'Tornado conditions reported');
  if (s.id === 771) add('storm', 2, 'Squalls', 'Sudden strong wind bursts');

  const rainByRate = s.rain >= 50 ? 3 : s.rain >= 20 ? 2 : s.rain >= 4 ? 1 : 0;
  const rainLevel = Math.max(RAIN_LEVEL_BY_CODE[s.id] ?? 0, rainByRate);
  const isRainCode = s.id >= 300 && s.id < 600;
  if ((isRainCode && s.id !== 511) || s.rain > 0 || s.pop >= 50) {
    const title =
      rainLevel >= 3 ? 'Extreme rainfall'
      : rainLevel === 2 ? 'Heavy rain'
      : rainLevel === 1 ? 'Moderate rain'
      : s.pop >= 50 && s.rain === 0 && !isRainCode ? 'Rain likely'
      : 'Light rain';
    add('rain', Math.max(rainLevel, s.pop >= 80 ? 1 : 0), title,
      rainLevel >= 2 ? 'Risk of flooding and waterlogging' : `Chance of rain ${s.pop}%`);
  }
  if (s.id === 511) add('rain', 1, 'Freezing rain', 'Roads and surfaces may be icy');

  const snowLevel = SNOW_LEVEL_BY_CODE[s.id];
  if (snowLevel !== undefined) {
    add('snow', snowLevel, snowLevel === 2 ? 'Heavy snow' : snowLevel === 1 ? 'Snow / sleet' : 'Light snow', 'Slippery surfaces expected');
  }

  const visLevel = Math.max(s.visibility < 0.2 ? 3 : s.visibility < 1 ? 2 : s.visibility < 4 ? 1 : -1, s.id === 741 ? 1 : -1);
  if (visLevel >= 0) {
    add('visibility', visLevel,
      visLevel >= 3 ? 'Near-zero visibility' : visLevel === 2 ? 'Very poor visibility' : 'Reduced visibility',
      `Visibility about ${s.visibility.toFixed(1)} km`);
  }

  if (s.id === 762) add('air', 3, 'Volcanic ash', 'Hazardous airborne particles');
  if (s.id === 751 || s.id === 761) add('air', 1, 'Dust / sand in air', 'Breathing may be affected');
  return out;
}

/**
 * Looks at now + the next 24 hours + air quality and keeps the worst
 * instance of each hazard type. Returns { level, items } sorted worst first.
 */
export function assessRisk({ cur, slots, tz, air, unit = 'C' }) {
  const worst = new Map();
  const merge = (hazards, when) =>
    hazards.forEach((h) => {
      const existing = worst.get(h.type);
      if (!existing || h.level > existing.level) worst.set(h.type, { ...h, when });
    });

  merge(evaluateSnapshot(toSnapshot(cur), unit), 'Now');
  slots
    .filter((s) => s.dt - cur.dt <= 24 * 3600)
    .forEach((s) => merge(evaluateSnapshot(toSnapshot(s), unit), `Around ${formatTime(s.dt, tz)}`));

  if (air && air.aqi >= 3) {
    merge([{
      type: 'air',
      level: air.aqi - 2,
      title: `${['Moderate', 'Poor', 'Very poor'][air.aqi - 3]} air quality`,
      detail: `PM2.5 ${air.pm25 != null ? Math.round(air.pm25) : '–'} µg/m³`,
    }], 'Now');
  }

  let items = [...worst.values()].sort((a, b) => b.level - a.level);
  if (items.length === 0) {
    items = [{ type: 'clear', level: 0, title: 'No significant hazards', detail: 'Conditions look calm for the next 24 hours', when: 'Now' }];
  }
  return { level: items[0].level, items };
}
