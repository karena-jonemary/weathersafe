// Central place for configuration. Keys can come from a .env file (VITE_*)
// or from the Settings dialog (stored in the browser's localStorage).
export const ENV = {
  owmKey: import.meta.env.VITE_OWM_KEY || '',
  geminiKey: import.meta.env.VITE_GEMINI_KEY || '',
  geminiModel: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash',
};

export const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const DEMO_SCENARIOS = [
  { value: 'clear', label: 'Clear and warm' },
  { value: 'rain', label: 'Heavy rain' },
  { value: 'storm', label: 'Severe thunderstorm' },
  { value: 'heat', label: 'Extreme heat' },
  { value: 'cold', label: 'Snow and freezing' },
];
