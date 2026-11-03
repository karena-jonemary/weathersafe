import { useCallback, useEffect, useRef, useState } from 'react';
import { notifySevere } from '../utils/notifications';

/**
 * Emergency Mode: automatically opens the warning (once per distinct situation)
 * when risk is Severe. `open(city, risk)` can also be called manually.
 */
export function useEmergency(city, risk) {
  const [view, setView] = useState(null); // { city, risk } | null
  const alreadyShown = useRef(new Set());

  const open = useCallback((c, r) => setView({ city: c, risk: r }), []);
  const close = useCallback(() => setView(null), []);

  useEffect(() => {
    if (!risk || risk.level < 3) return;
    const serious = risk.items.filter((i) => i.level >= 2);
    const key = `${city}|${serious.map((i) => i.type).join()}`;
    if (alreadyShown.current.has(key)) return;
    alreadyShown.current.add(key);
    setView({ city, risk });
    notifySevere(city, serious);
  }, [city, risk]);

  return { view, open, close };
}
