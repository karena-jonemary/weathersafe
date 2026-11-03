// Basic offline assistant, used when no Gemini key is set or the AI call fails.
import { formatTemp, formatTime, kmh, weekday } from './format';
import { tipsFor } from './guidance';

const LEVELS = ['Low', 'Moderate', 'High', 'Severe'];

export function localAnswer(question, { cur, slots, daily, risk, tz, unit }) {
  const q = question.toLowerCase();
  const T = (v) => formatTemp(v, unit);

  if (/umbrella|rain|wet/.test(q)) {
    const slot = slots.slice(0, 8).find((s) => s.pop >= 50 || s.rain > 0);
    return slot
      ? `Rain is likely around ${formatTime(slot.dt, tz)} (${slot.pop}% chance). Carrying an umbrella is a good idea.`
      : 'No significant rain is expected in the next 24 hours.';
  }
  if (/safe|danger|alert|warning|risk|emergency/.test(q)) {
    return [
      `Current risk level: ${LEVELS[risk.level]}.`,
      ...risk.items.slice(0, 3).map((i) => `• ${i.title} – ${i.detail}`),
      ...tipsFor(risk.items[0]).map((t) => `• ${t}`),
    ].join('\n');
  }
  if (/tomorrow|forecast|week|days/.test(q)) {
    return daily
      .slice(0, 3)
      .map((d) => `${weekday(d.dt, tz)}: ${T(d.min)}–${T(d.max)}, ${d.cond.desc}, rain ${d.pop}%`)
      .join('\n');
  }
  if (/wind/.test(q)) return `Wind is ${kmh(cur.wind)} km/h${cur.gust ? ` with gusts to ${kmh(cur.gust)} km/h` : ''}.`;
  if (/hot|temperature|temp|cold|warm|feel/.test(q)) return `It is ${T(cur.temp)} and feels like ${T(cur.feels)} in ${cur.city}.`;
  if (/humid/.test(q)) return `Humidity is ${cur.humidity}%.`;

  return `Right now in ${cur.city}: ${T(cur.temp)}, ${cur.cond.desc}, wind ${kmh(cur.wind)} km/h. Risk level: ${LEVELS[risk.level]}. (Add a Gemini key in Settings for full natural-language answers.)`;
}
