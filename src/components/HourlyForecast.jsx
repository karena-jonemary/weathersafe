import { formatHour, formatTemp, weatherEmoji } from '../utils/format';

export default function HourlyForecast({ slots, tz, unit }) {
  return (
    <section className="card">
      <h2>3-hourly forecast (next 36 hours)</h2>
      <div className="scroll">
        {slots.slice(0, 12).map((s) => (
          <div className="slot" key={s.dt}>
            <div className="muted">{formatHour(s.dt, tz)}</div>
            <div className="e" aria-hidden="true">{weatherEmoji(s.cond.id, s.cond.icon.endsWith('n'))}</div>
            <b>{formatTemp(s.temp, unit)}</b>
            <div className="muted small">💧{s.pop}%</div>
          </div>
        ))}
      </div>
    </section>
  );
}
