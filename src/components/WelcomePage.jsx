import AnimeWeatherArt from './AnimeWeatherArt';
import { getGreeting } from '../utils/format';

export default function WelcomePage({ onGo, goTo, onStart }) {
  const greeting = getGreeting();
  const handleStart = onGo || onStart || goTo;

  const isMorning = greeting.toLowerCase().includes('morning');
  const isEvening = greeting.toLowerCase().includes('evening');
  const timeOfDay = isMorning ? 'morning' : isEvening ? 'evening' : 'afternoon';
  const greetingIcon = isMorning ? '🌅' : isEvening ? '🌙' : '☀️';

  return (
    <section className="card welcome welcome-showcase" aria-label="Welcome">
      <div className="welcome-content">
        <div className="welcome-badge">
          <span className="welcome-badge-icon" aria-hidden="true">{greetingIcon}</span>
          <span className="greeting welcome-greeting">{greeting}</span>
        </div>

        <h2>Welcome to WeatherSafe</h2>

        <p className="desc muted welcome-desc">
          Your companion for local weather updates, safety guidance, and emergency alerts.
        </p>

        <ul className="features welcome-features">
          <li>
            <span className="feature-icon" aria-hidden="true">🌤️</span>
            <span>Current weather, 5-day forecasts, and temperature trends</span>
          </li>
          <li>
            <span className="feature-icon" aria-hidden="true">🤖</span>
            <span>AI Weather Chatbot for instant answers and personalized activity planning</span>
          </li>
          <li>
            <span className="feature-icon" aria-hidden="true">🚨</span>
            <span>Weather alerts, risk assessments, and severe emergency notifications</span>
          </li>
        </ul>

        <div className="welcome-actions">
          <button type="button" className="btn primary btn-large welcome-go-btn" onClick={handleStart}>
            Go
          </button>
        </div>
      </div>

      <div className="welcome-art-wrapper" aria-hidden="true">
        <AnimeWeatherArt timeOfDay={timeOfDay} />
      </div>
    </section>
  );
}
