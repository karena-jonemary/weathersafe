// Simulated OpenWeatherMap-style payloads so the app can be tried without an API key.
import { shifted } from './format';

const SCENARIOS = {
  clear: { id: 800, main: 'Clear', desc: 'clear sky', temp: 31, feels: 34, wind: 3.2 },
  rain: { id: 502, main: 'Rain', desc: 'heavy intensity rain', temp: 25, feels: 26, wind: 9, rain: 9, vis: 4000 },
  storm: { id: 212, main: 'Thunderstorm', desc: 'heavy thunderstorm', temp: 26, feels: 28, wind: 21, gust: 31, rain: 32, vis: 1500 },
  heat: { id: 800, main: 'Clear', desc: 'clear sky', temp: 44, feels: 49, wind: 2.5 },
  cold: { id: 601, main: 'Snow', desc: 'snow', temp: -3, feels: -9, wind: 6, snow: 2, vis: 2500 },
};

export function buildDemoData(name) {
  const P = SCENARIOS[name] || SCENARIOS.clear;
  const tz = 19800; // IST
  const now = Math.floor(Date.now() / 1000);
  const steady = P.id === 800 || P.id === 601;

  const cur = {
    coord: { lat: 12.97, lon: 77.59 },
    weather: [{ id: P.id, main: P.main, description: P.desc, icon: P.id === 800 ? '01d' : '10d' }],
    main: { temp: P.temp, feels_like: P.feels, temp_min: P.temp - 3, temp_max: P.temp + 3, pressure: 1006, humidity: 70 },
    visibility: P.vis || 10000,
    wind: { speed: P.wind, deg: 220, gust: P.gust },
    rain: P.rain ? { '1h': P.rain } : undefined,
    snow: P.snow ? { '1h': P.snow } : undefined,
    clouds: { all: P.id === 800 ? 5 : 90 },
    dt: now,
    sys: { country: 'DEMO', sunrise: now - 6 * 3600, sunset: now + 6 * 3600 },
    timezone: tz,
    name: 'Sample City',
  };

  const list = Array.from({ length: 40 }, (_, i) => {
    const dt = now + (i + 1) * 3 * 3600;
    const hour = shifted(dt, tz).getUTCHours();
    const night = hour < 6 || hour >= 18;
    const id = steady ? P.id : i < 10 ? P.id : i < 20 ? 500 : 802;
    const wet = !steady && i < 20 && id >= 200 && id < 600;
    const dailyCycle = 5 * Math.sin(((hour - 9) / 24) * 2 * Math.PI);
    const cooler = i > 20 && !steady ? 2 : 0;
    const description = id === 800 ? 'clear sky' : id === 802 ? 'scattered clouds' : id === 500 ? 'light rain' : P.desc;

    return {
      dt,
      main: { temp: P.temp + dailyCycle - cooler, feels_like: P.feels + dailyCycle, humidity: 70 },
      weather: [{ id, main: id === 800 ? 'Clear' : 'Weather', description, icon: `${id === 800 ? '01' : '10'}${night ? 'n' : 'd'}` }],
      wind: { speed: i < 10 ? P.wind : 4, gust: i < 10 ? P.gust : undefined },
      visibility: i < 10 && P.vis ? P.vis : 10000,
      pop: wet ? 0.9 : steady && P.snow ? 0.8 : 0.1,
      rain: wet && i < 10 && P.rain ? { '3h': P.rain * 3 } : wet ? { '3h': 0.8 } : undefined,
    };
  });

  const hot = name === 'heat';
  return {
    cur,
    fc: { list, city: { timezone: tz } },
    air: { list: [{ main: { aqi: hot ? 4 : 2 }, components: { pm2_5: hot ? 85 : 18, pm10: 40 } }] },
  };
}
