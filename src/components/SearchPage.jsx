import { useState } from 'react';
import { useWeatherApp } from '../context/WeatherContext';
import { formatTemp } from '../utils/format';

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation is not supported by this browser.'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude.toFixed(4), lon: p.coords.longitude.toFixed(4) }),
      () => reject(new Error('Could not get your location. Allow location access (needs https or localhost) or search by city.')),
      { timeout: 10000 },
    );
  });
}

/** Step 1 – Web Application Interface: accepts a city name or the current location. */
export default function SearchPage({ goTo }) {
  const { search, status, error, data, settings } = useWeatherApp();
  const [city, setCity] = useState('');
  const [localError, setLocalError] = useState('');
  const loading = status === 'loading';

  const run = async (queryPromise) => {
    setLocalError('');
    try {
      const query = await queryPromise;
      if (await search(query)) goTo(1);
    } catch (e) {
      setLocalError(e.message);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const q = city.trim();
    if (q) run(Promise.resolve({ q }));
  };

  return (
    <section className="card hero">
      <h2>🌦️ Check the weather</h2>
      <p className="muted">
        Enter a city name or use your current location. You will then be guided step by step through the forecast, AI
        assistant, alerts, safety guidance, emergency mode and activity planning.
      </p>

      <form className="search" onSubmit={onSubmit} role="search">
        <input
          type="search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city, e.g. Mumbai or London,GB"
          aria-label="City name"
          autoComplete="off"
        />
        <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Loading…' : 'Search'}</button>
      </form>

      <button className="btn" type="button" disabled={loading} onClick={() => run(getPosition())}>
        📍 Use my current location
      </button>

      {(localError || error) && <p className="error" role="alert">{localError || error}</p>}
      {data && (
        <p className="muted">
          Loaded: {data.cur.city}{data.cur.country ? `, ${data.cur.country}` : ''} – {formatTemp(data.cur.temp, settings.unit)},{' '}
          {data.cur.cond.desc}. Click Next to continue.
        </p>
      )}
    </section>
  );
}
