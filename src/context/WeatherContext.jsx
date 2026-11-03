import { createContext, useCallback, useContext, useMemo } from 'react';
import { ENV } from '../config';
import { useChat } from '../hooks/useChat';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useWeather } from '../hooks/useWeather';
import { groupDaily } from '../utils/processing';
import { assessRisk } from '../utils/risk';

const WeatherContext = createContext(null);

const DEFAULT_SETTINGS = {
  owmKey: ENV.owmKey,
  geminiKey: ENV.geminiKey,
  geminiModel: ENV.geminiModel,
  demo: '', // '' = live data
  unit: 'C',
};

export function WeatherProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('ws_settings', DEFAULT_SETTINGS);
  const merged = useMemo(() => ({ ...DEFAULT_SETTINGS, ...settings }), [settings]);
  const updateSettings = useCallback((patch) => setSettings((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...patch })), [setSettings]);

  // Without an API key the app falls back to a demo scenario so it is still usable.
  const demo = merged.demo || (!merged.owmKey ? 'clear' : '');
  const autoDemo = !merged.demo && !merged.owmKey;

  const { status, error, data, load } = useWeather({ owmKey: merged.owmKey, demo });

  const daily = useMemo(() => (data ? groupDaily(data.slots, data.tz) : []), [data]);
  const risk = useMemo(
    () => (data ? assessRisk({ cur: data.cur, slots: data.slots, tz: data.tz, air: data.air, unit: merged.unit }) : null),
    [data, merged.unit],
  );

  const chat = useChat({ settings: merged, weather: data && { ...data, daily, risk } });

  const value = {
    settings: merged,
    updateSettings,
    demo,
    autoDemo,
    status,
    error,
    data,
    daily,
    risk,
    search: load,
    chat,
  };
  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeatherApp() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherApp must be used inside <WeatherProvider>');
  return ctx;
}
