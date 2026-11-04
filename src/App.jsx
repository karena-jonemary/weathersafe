import { useState } from 'react';
import AlertsPage from './components/AlertsPage';
import ChatPage from './components/ChatPage';
import EmergencyBanner from './components/EmergencyBanner';
import EmergencyModal from './components/EmergencyModal';
import EmergencyPage from './components/EmergencyPage';
import ForecastPage from './components/ForecastPage';
import GuidancePage from './components/GuidancePage';
import Pager from './components/Pager';
import PlannerPage from './components/PlannerPage';
import SearchPage from './components/SearchPage';
import SettingsDialog from './components/SettingsDialog';
import Stepper from './components/Stepper';
import WelcomePage from './components/WelcomePage';
import { useWeatherApp } from './context/WeatherContext';
import { useEmergency } from './hooks/useEmergency';
import { formatTemp } from './utils/format';

// One page per module of the system flow, in order.
const STEPS = [
  { id: 'search', title: 'Search', Page: SearchPage },
  { id: 'forecast', title: 'Forecast', Page: ForecastPage },
  { id: 'chat', title: 'AI Assistant', Page: ChatPage },
  { id: 'alerts', title: 'Alerts', Page: AlertsPage },
  { id: 'guidance', title: 'Safety Guidance', Page: GuidancePage },
  { id: 'emergency', title: 'Emergency', Page: EmergencyPage },
  { id: 'plan', title: 'Plan', Page: PlannerPage },
];

export default function App() {
  const { data, risk, settings, updateSettings, autoDemo, demo, status } = useWeatherApp();
  const [onWelcome, setOnWelcome] = useState(true);
  const [step, setStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const emergency = useEmergency(data?.cur.city, risk, !onWelcome);

  const ready = Boolean(data && risk);
  const goTo = (i) => {
    setOnWelcome(false);
    setStep(ready || i === 0 ? i : 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleGo = () => {
    setOnWelcome(false);
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const { Page, title } = STEPS[step];
  const onLast = step === STEPS.length - 1;

  return (
    <div className="app-shell">
      <header className="top">
        <button
          type="button"
          className="brand"
          onClick={() => {
            setOnWelcome(true);
            emergency.close();
          }}
          title="WeatherSafe home"
          aria-label="WeatherSafe home"
        >
          🌦️ WeatherSafe
        </button>
        <button className="btn" onClick={() => updateSettings({ unit: settings.unit === 'C' ? 'F' : 'C' })} title="Switch units">
          °{settings.unit}
        </button>
        <button className="btn" onClick={() => setShowSettings(true)}>⚙️ Settings</button>
      </header>

      {!onWelcome && ready && (
        <EmergencyBanner
          city={data.cur.city}
          risk={risk}
          onView={() => emergency.open(data.cur.city, risk)}
        />
      )}

      {onWelcome ? (
        <main className="welcome-main">
          <div className="page" key="welcome">
            <WelcomePage onGo={handleGo} goTo={handleGo} />
          </div>
        </main>
      ) : (
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">Features &amp; Steps</span>
            </div>
            <Stepper steps={STEPS} current={step} unlocked={ready} onSelect={goTo} />
            {data && (
              <div className="sidebar-city-card">
                <div className="sidebar-city-name">📍 {data.cur.city}</div>
                <div className="sidebar-city-temp">
                  {formatTemp(data.cur.temp, settings.unit)} · {data.cur.cond.desc}
                </div>
              </div>
            )}
          </aside>

          <main className="dashboard-main">
            {demo && (
              <div className="notice">
                Demo mode: showing simulated data{autoDemo ? ' because no API key is set.' : '.'} Open Settings and add an
                OpenWeatherMap key to see live weather.
              </div>
            )}

            {step > 0 && !ready ? (
              <section className="card">
                <p>{status === 'loading' ? 'Loading weather…' : 'Search for a city first.'}</p>
                <button className="btn primary" onClick={() => goTo(0)}>Go to search</button>
              </section>
            ) : (
              <div className="page" key={STEPS[step].id}>
                <Page goTo={goTo} emergency={emergency} />
              </div>
            )}

            <Pager
              index={step}
              total={STEPS.length}
              title={title}
              canAdvance={ready}
              onBack={() => goTo(step - 1)}
              onNext={() => goTo(onLast ? 0 : step + 1)}
            />
          </main>
        </div>
      )}

      <footer>
        Weather data © OpenWeatherMap. Guidance is general advice – always follow instructions from your local authorities.
      </footer>

      {!onWelcome && <EmergencyModal view={emergency.view} onClose={emergency.close} />}
      {showSettings && <SettingsDialog settings={settings} onSave={updateSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
}
