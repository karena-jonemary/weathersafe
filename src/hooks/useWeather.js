import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWeather } from '../services/weatherApi';
import { buildDemoData } from '../utils/demoData';
import { processAir, processCurrent, processForecast } from '../utils/processing';
import { useLocalStorage } from './useLocalStorage';

/**
 * Loads, validates and holds the weather for one location.
 * `demo` (scenario name or '') switches to simulated data.
 */
export function useWeather({ owmKey, demo }) {
  const [state, setState] = useState({ status: 'idle', data: null, error: '' });
  const [lastQuery, setLastQuery] = useLocalStorage('ws_last_query', { q: 'London' });
  const latestRequest = useRef(0);

  const load = useCallback(
    async (query) => {
      const requestId = ++latestRequest.current;
      setState((s) => ({ ...s, status: 'loading', error: '' }));
      try {
        const raw = demo ? buildDemoData(demo) : await fetchWeather(query, owmKey);
        const cur = processCurrent(raw.cur);
        const forecast = processForecast(raw.fc);
        const data = {
          cur,
          tz: forecast.tz || cur.tz,
          slots: forecast.slots.filter((s) => s.dt > cur.dt - 3 * 3600),
          air: processAir(raw.air),
        };
        if (requestId !== latestRequest.current) return false; // a newer request superseded this one
        setState({ status: 'ready', data, error: '' });
        if (!demo) setLastQuery(query);
        return true;
      } catch (e) {
        if (requestId === latestRequest.current) setState((s) => ({ ...s, status: 'error', error: e.message }));
        return false;
      }
    },
    [owmKey, demo, setLastQuery],
  );

  // Initial load, and reload when the key or demo scenario changes.
  const queryRef = useRef(lastQuery);
  queryRef.current = lastQuery;
  useEffect(() => {
    load(queryRef.current);
  }, [load]);

  return { ...state, load, lastQuery };
}
