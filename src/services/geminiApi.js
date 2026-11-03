// AI Weather Chatbot: Google Gemini, grounded on the weather data loaded in the app.
import { GEMINI_BASE_URL } from '../config';
import { formatHour, formatTime, kmh, weekday } from '../utils/format';

/** Compact, metric summary of everything the model may use to answer. */
export function buildWeatherContext({ cur, slots, daily, risk, air, tz }) {
  return {
    location: `${cur.city}, ${cur.country}`,
    units: 'Metric (°C, km/h, mm)',
    localTimeNow: formatTime(cur.dt, tz),
    now: {
      tempC: cur.temp,
      feelsLikeC: cur.feels,
      condition: cur.cond.desc,
      humidityPct: cur.humidity,
      windKmh: kmh(cur.wind),
      gustKmh: cur.gust ? kmh(cur.gust) : null,
      visibilityKm: cur.visibility,
      pressureHpa: cur.pressure,
      rain1hMm: cur.rain,
      sunrise: formatTime(cur.sunrise, tz),
      sunset: formatTime(cur.sunset, tz),
    },
    airQualityIndex1to5: air?.aqi ?? null,
    riskLevel: ['Low', 'Moderate', 'High', 'Severe'][risk.level],
    alerts: risk.items.map((i) => `${i.title} (${['Low', 'Moderate', 'High', 'Severe'][i.level]}, ${i.when}) – ${i.detail}`),
    next24h: slots.slice(0, 8).map(
      (s) => `${weekday(s.dt, tz)} ${formatHour(s.dt, tz)}: ${Math.round(s.temp)}°C, ${s.cond.desc}, rain chance ${s.pop}%, wind ${kmh(s.wind)} km/h`,
    ),
    daily: daily.map(
      (d) => `${weekday(d.dt, tz)}: ${Math.round(d.min)}–${Math.round(d.max)}°C, ${d.cond.desc}, rain chance ${d.pop}%`,
    ),
  };
}

const SYSTEM_PROMPT =
  'You are WeatherSafe, a friendly weather assistant for citizens and municipal staff. ' +
  'Answer ONLY using the weather data provided below. Be concise (under 120 words), practical, and give safety ' +
  'precautions when risk is Moderate or higher. If the data does not contain the answer, say so. Never invent ' +
  'figures. For emergencies, advise contacting local emergency services.\n\nWEATHER DATA (JSON):\n';

/**
 * @param {{role: 'user'|'model', text: string}[]} history conversation so far, ending with the user's question
 */
export async function askGemini({ apiKey, model, history, context }) {
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT + JSON.stringify(context) }] },
    contents: history.slice(-10).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
  };

  const response = await fetch(`${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Gemini error ${response.status}`);

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim();
  if (!text) throw new Error('Empty response');
  return text;
}
