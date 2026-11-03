import { useWeatherApp } from '../context/WeatherContext';
import { TYPE_ICON } from '../utils/guidance';
import RiskBadge from './RiskBadge';

const SUMMARY = ['No major concerns.', 'Stay alert and plan ahead.', 'Take precautions now.', 'Take precautions now.'];

/** Step 4 – Weather Alert and Risk Assessment. */
export default function AlertsPage() {
  const { risk } = useWeatherApp();

  return (
    <section className="card" aria-label="Weather alerts">
      <h2>Weather alerts &amp; risk level</h2>
      <div className="overall">
        <RiskBadge level={risk.level} />
        <span>{SUMMARY[risk.level]}</span>
      </div>
      {risk.items.map((item) => (
        <div key={item.type} className={`alert a${item.level}`}>
          <div className="t">
            <span>{TYPE_ICON[item.type]} {item.title}</span>
            <RiskBadge level={item.level} />
          </div>
          <div className="muted small">{item.detail} · {item.when}</div>
        </div>
      ))}
      <p className="muted small">
        Risk levels are calculated by this app from forecast data using general thresholds. They are not official
        warnings – follow your national weather service and local authorities.
      </p>
    </section>
  );
}
