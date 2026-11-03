import { formatTemp, kmh, weatherEmoji, weekday } from '../utils/format';

export default function DailyForecast({ daily, tz, unit }) {
  return (
    <section className="card">
      <h2>5-day forecast</h2>
      <div className="days">
        {daily.slice(0, 5).map((d) => (
          <div className="day" key={d.key}>
            <b>{weekday(d.dt, tz)}</b>
            <div className="e" aria-hidden="true">{weatherEmoji(d.cond.id, false)}</div>
            <div><b>{formatTemp(d.max, unit)}</b> <span className="muted">{formatTemp(d.min, unit)}</span></div>
            <div className="muted small cap">{d.cond.desc || d.cond.main}</div>
            <div className="muted small">💧{d.pop}% · 💨{kmh(d.wind)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
