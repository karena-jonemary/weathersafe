import { useState } from 'react';
import { useWeatherApp } from '../context/WeatherContext';
import { PREPAREDNESS_TIPS } from '../utils/guidance';
import { notificationPermission, requestNotificationPermission } from '../utils/notifications';
import EmergencyContent from './EmergencyContent';

const PREVIEW_RISK = {
  level: 3,
  items: [{ type: 'storm', level: 3, title: 'Severe thunderstorm (preview)', detail: 'This is a drill preview', when: 'Now' }],
};

/** Step 6 – Emergency Mode and Notification. */
export default function EmergencyPage({ emergency }) {
  const { data, risk } = useWeatherApp();
  const city = data.cur.city;
  const [permission, setPermission] = useState(notificationPermission());
  const active = risk.level >= 2;

  const enable = async () => setPermission(await requestNotificationPermission());
  const notifyLabel =
    permission === 'granted' ? '🔔 Notifications on'
    : permission === 'denied' ? '🔕 Notifications blocked'
    : permission === 'unsupported' ? 'Notifications not supported'
    : '🔔 Enable device notifications';

  return (
    <section className="card" aria-label="Emergency mode">
      <h2>🚨 Emergency mode &amp; notifications</h2>

      {active ? (
        <>
          <div className={`em-box l${risk.level}`}>
            <strong>{risk.level === 3 ? '🚨 SEVERE WEATHER WARNING' : '⚠️ HIGH RISK WEATHER'} – {city}</strong>
          </div>
          <EmergencyContent city={city} risk={risk} />
        </>
      ) : (
        <>
          <div className="em-box l0">
            <strong>✅ Emergency mode is not active</strong>
            <br />
            No High or Severe conditions detected for {city}. It switches on automatically, with an urgent warning, if
            dangerous weather is detected.
          </div>
          <h3>Be prepared anyway</h3>
          <ul>{PREPAREDNESS_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
        </>
      )}
      <p className="muted small">Emergency numbers: 112 (India and EU) · 911 (US). Always follow instructions from local authorities.</p>

      <div className="row">
        <button className="btn" onClick={enable} disabled={permission === 'granted' || permission === 'unsupported'}>{notifyLabel}</button>
        <button className="btn" onClick={() => emergency.open(`${city} (preview)`, active ? risk : PREVIEW_RISK)}>
          Preview emergency mode
        </button>
      </div>
    </section>
  );
}
