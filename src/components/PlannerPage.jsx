import { useMemo } from 'react';
import { useWeatherApp } from '../context/WeatherContext';
import { rateActivities } from '../utils/activities';
import { formatHour } from '../utils/format';

/** Step 7 – Informed Decision and Safe Preparedness. */
export default function PlannerPage() {
  const { data } = useWeatherApp();
  const ratings = useMemo(
    () => rateActivities({ cur: data.cur, slots: data.slots, air: data.air, tz: data.tz, formatHour }),
    [data],
  );

  return (
    <section className="card">
      <h2>Informed decision &amp; safe preparedness</h2>
      <p className="muted no-top">Ratings use current conditions and the next 12 hours of forecast.</p>
      <div className="acts">
        {ratings.map((a) => (
          <div className="act" key={a.name}>
            <span className="e" aria-hidden="true">{a.icon}</span>
            <div className="m">
              <b>{a.name}</b>
              <small>{a.reason}{a.betterAt ? ` · better around ${a.betterAt}` : ''}</small>
            </div>
            <span className={`badge b${a.verdict.level}`}>{a.verdict.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
