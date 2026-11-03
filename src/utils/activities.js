// Informed Decision and Safe Preparedness: rates everyday activities
// against current conditions and the next 12 hours of forecast.
import { evaluateSnapshot, toSnapshot } from './risk';

export const ACTIVITIES = [
  { name: 'Walk / jog outdoors', icon: '🏃', hazards: ['heat', 'cold', 'rain', 'storm', 'air', 'wind', 'visibility', 'snow'] },
  { name: 'Commute by two-wheeler', icon: '🏍️', hazards: ['rain', 'storm', 'wind', 'visibility', 'snow', 'cold'] },
  { name: 'Outdoor event / gathering', icon: '🎪', hazards: ['rain', 'storm', 'wind', 'heat', 'cold', 'snow'] },
  { name: 'Road trip / long travel', icon: '🚗', hazards: ['storm', 'rain', 'visibility', 'snow', 'wind'] },
  { name: 'Dry laundry outside', icon: '👕', hazards: ['rain', 'storm', 'snow'] },
  { name: 'Children playing outside', icon: '🧒', hazards: ['heat', 'cold', 'air', 'storm', 'rain', 'wind', 'snow'] },
];

const VERDICTS = [
  { label: 'Good', level: 0 },
  { label: 'Caution', level: 1 },
  { label: 'Avoid', level: 3 },
];

export function rateActivities({ cur, slots, air, tz, formatHour }) {
  const airHazard = air && air.aqi >= 3 ? [{ type: 'air', level: air.aqi - 2, title: 'Poor air quality' }] : [];

  // Worst relevant hazard for one snapshot.
  const worstFor = (snapshot, hazards) => {
    const relevant = [...evaluateSnapshot(snapshot), ...airHazard]
      .filter((h) => hazards.includes(h.type))
      .sort((a, b) => b.level - a.level);
    return { level: relevant[0]?.level ?? 0, hazard: relevant[0] };
  };

  return ACTIVITIES.map((activity) => {
    const next12h = [toSnapshot(cur), ...slots.slice(0, 4).map(toSnapshot)].map((s) => worstFor(s, activity.hazards));
    const worst = next12h.reduce((m, x) => (x.level > m.level ? x : m), next12h[0]);
    const verdict = worst.level >= 2 ? VERDICTS[2] : worst.level === 1 ? VERDICTS[1] : VERDICTS[0];

    // Best slot within the next 24h (lowest hazard, then lowest rain chance, then earliest).
    const best = slots
      .slice(0, 8)
      .map((s) => ({ s, level: worstFor(toSnapshot(s), activity.hazards).level }))
      .sort((a, b) => a.level - b.level || a.s.pop - b.s.pop || a.s.dt - b.s.dt)[0];

    return {
      ...activity,
      verdict,
      reason: worst.hazard ? worst.hazard.title : 'Conditions are favourable',
      betterAt: best && best.level < worst.level ? formatHour(best.s.dt, tz) : null,
    };
  });
}
