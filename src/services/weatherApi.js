// Weather Data Integration: talks to the OpenWeatherMap API.
import { OWM_BASE_URL } from '../config';

export class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const HTTP_MESSAGES = {
  401: 'Invalid API key (new OpenWeatherMap keys can take a couple of hours to activate).',
  404: 'City not found. Check the spelling or try "City,CountryCode".',
  429: 'API rate limit reached. Please wait a minute and try again.',
};

async function request(path, params, apiKey) {
  if (!apiKey) throw new ApiError('Add your OpenWeatherMap API key in Settings.', 'NO_KEY');

  const url = new URL(`${OWM_BASE_URL}/${path}`);
  Object.entries({ ...params, units: 'metric', appid: apiKey }).forEach(([k, v]) => url.searchParams.set(k, v));

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError('Network error – check your internet connection.', 'NETWORK');
  }
  if (!response.ok) {
    throw new ApiError(HTTP_MESSAGES[response.status] || `Weather service error (${response.status}).`, response.status);
  }
  return response.json();
}

/**
 * @param {{q: string} | {lat: number|string, lon: number|string}} query city name or coordinates
 * @returns {Promise<{cur: object, fc: object, air: object|null}>} raw API payloads
 */
export async function fetchWeather(query, apiKey) {
  const cur = await request('weather', query, apiKey);
  const { lat, lon } = cur.coord || {};
  const [fc, air] = await Promise.all([
    request('forecast', { lat, lon }, apiKey),
    request('air_pollution', { lat, lon }, apiKey).catch(() => null), // air quality is optional
  ]);
  return { cur, fc, air };
}
