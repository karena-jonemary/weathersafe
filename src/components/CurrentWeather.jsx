import { compass, formatTemp, formatTime, kmh, weatherEmoji } from '../utils/format';
import RiskBadge from './RiskBadge';

const AQI_LABELS = ['Good', 'Fair', 'Moderate', 'Poor', 'Very poor'];

export default function CurrentWeather({ cur, tz, air, risk, unit }) {
  const T = (v) => formatTemp(v, unit);
  const night = cur.cond.icon.endsWith('n');
  const stats = [
    ['Humidity', `${cur.humidity ?? '–'}%`],
    ['Wind', `${kmh(cur.wind)} km/h ${compass(cur.deg)}`],
    ['Pressure', `${cur.pressure ?? '–'} hPa`],
    ['Visibility', `${cur.visibility.toFixed(1)} km`],
    ['Cloud cover', `${cur.clouds}%`],
    ['Rain (1h)', `${cur.rain ? cur.rain.toFixed(1) : 0} mm`],
    ['Sunrise', cur.sunrise ? formatTime(cur.sunrise, tz) : '–'],
    ['Sunset', cur.sunset ? formatTime(cur.sunset, tz) : '–'],
    ['Air quality', air ? AQI_LABELS[air.aqi - 1] : 'n/a'],
  ];

  return (
    <section className="card" aria-label="Current weather">
      <div className="now">
        <div>
          <div className="muted">
            {cur.city}{cur.country ? `, ${cur.country}` : ''} · updated {formatTime(cur.dt, tz)} local
          </div>
          <div className="big">{T(cur.temp)}</div>
          <div className="cap">{cur.cond.desc} · feels like {T(cur.feels)}</div>
          <div className="muted">H {T(cur.max)} · L {T(cur.min)}</div>
        </div>
        <div className="center">
          <div className="ico" aria-hidden="true">{weatherEmoji(cur.cond.id, night)}</div>
          <RiskBadge level={risk.level} prefix="Risk: " />
        </div>
      </div>
      <div className="grid">
        {stats.map(([label, value]) => (
          <div className="stat" key={label}><small>{label}</small><b>{value}</b></div>
        ))}
      </div>
    </section>
  );
}
