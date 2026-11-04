export const LEVELS = ['Low', 'Moderate', 'High', 'Severe'];
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const kmh = (metersPerSecond) => Math.round(metersPerSecond * 3.6);

export function formatTemp(celsius, unit = 'C') {
  if (celsius == null || Number.isNaN(celsius)) return '–';
  return unit === 'F' ? `${Math.round((celsius * 9) / 5 + 32)}°F` : `${Math.round(celsius)}°C`;
}

/** Unix seconds + timezone offset -> Date whose UTC getters give the city's local time. */
export const shifted = (dt, tz) => new Date((dt + tz) * 1000);

export function formatTime(dt, tz) {
  if (dt == null) return '–';
  const d = shifted(dt, tz);
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function formatHour(dt, tz) {
  const h = shifted(dt, tz).getUTCHours();
  return `${h % 12 || 12} ${h >= 12 ? 'PM' : 'AM'}`;
}

export const dayKey = (dt, tz) => shifted(dt, tz).toISOString().slice(0, 10);
export const weekday = (dt, tz) => WEEKDAYS[shifted(dt, tz).getUTCDay()];

export function weatherEmoji(id, night = false) {
  if (id >= 200 && id < 300) return '⛈️';
  if (id < 400) return '🌦️';
  if (id < 600) return '🌧️';
  if (id < 700) return '❄️';
  if (id === 781) return '🌪️';
  if (id < 800) return '🌫️';
  if (id === 800) return night ? '🌙' : '☀️';
  if (id <= 802) return night ? '☁️' : '🌤️';
  return '☁️';
}

export function compass(deg) {
  if (deg == null) return '';
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];
}

export function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
