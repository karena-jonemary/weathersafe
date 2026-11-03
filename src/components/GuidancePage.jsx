import { useWeatherApp } from '../context/WeatherContext';
import { TYPE_ICON, tipsFor } from '../utils/guidance';
import RiskBadge from './RiskBadge';

/** Step 5 – Weather Safety Guidance. */
export default function GuidancePage() {
  const { risk } = useWeatherApp();

  return (
    <section className="card" aria-label="Safety guidance">
      <h2>🛟 Safety guidance</h2>
      {risk.items.map((item) => (
        <div className="gblock" key={item.type}>
          <h3>{TYPE_ICON[item.type]} {item.title} <RiskBadge level={item.level} /></h3>
          <ul>{tipsFor(item).map((tip) => <li key={tip}>{tip}</li>)}</ul>
        </div>
      ))}
    </section>
  );
}
