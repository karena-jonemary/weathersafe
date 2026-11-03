# WeatherSafe – Weather Alerts & Safety Guidance (React)

A React (Vite) web app for citizens, community members and municipal staff to search a city's weather and get
alerts, safety guidance and emergency warnings. Each module of the system flow is its own page, reached with
**Next / Back**.

| Step | Page | Source |
|---|---|---|
| 1 | Search (city or current location) | `components/SearchPage.jsx` |
| 2 | Current weather + 5-day forecast + temperature chart | `components/ForecastPage.jsx` |
| 3 | AI Weather Chatbot (Gemini) | `components/ChatPage.jsx`, `services/geminiApi.js` |
| 4 | Weather Alert & Risk Assessment (Low/Moderate/High/Severe) | `components/AlertsPage.jsx`, `utils/risk.js` |
| 5 | Weather Safety Guidance | `components/GuidancePage.jsx`, `utils/guidance.js` |
| 6 | Emergency Mode & Notification | `components/EmergencyPage.jsx`, `EmergencyModal.jsx`, `hooks/useEmergency.js` |
| 7 | Informed decision / activity planner | `components/PlannerPage.jsx`, `utils/activities.js` |

Weather Data Integration lives in `services/weatherApi.js` (OpenWeatherMap) and Data Processing and
Validation in `utils/processing.js`.

## Run it

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Other commands: `npm test` (unit tests), `npm run build` (production build in `dist/`), `npm run preview`.

## API keys

1. **OpenWeatherMap** (required for live data): create a free account at openweathermap.org, then copy a key from
   *My API keys*. New keys can take up to a couple of hours to activate.
2. **Gemini** (optional, for the AI chatbot): get a key at aistudio.google.com.

Provide them either in the app (**⚙️ Settings**, stored in your browser) or in a `.env` file
(copy `.env.example`). Without an OpenWeatherMap key the app shows clearly-labelled **demo data**.

> Any key placed in the front-end can be seen by users. For a public deployment, call the APIs from your own
> backend and keep the keys there.

## Project structure

```
src/
  config.js             env vars, API base URLs, demo scenarios
  services/             weatherApi.js (OpenWeatherMap), geminiApi.js
  utils/                format, processing (validation), risk, guidance, activities, demoData, localAnswer, notifications
  hooks/                useWeather, useChat, useEmergency, useLocalStorage
  context/              WeatherContext.jsx (settings + weather + risk + chat shared by all pages)
  components/           one component per page / widget
tests/utils.test.js     unit tests for validation, risk rules and planner
```

## Notes

- Forecasts come from OpenWeatherMap and are 3-hourly on the free plan.
- Risk levels use general thresholds chosen for this project. They are **not official warnings**; follow your
  national weather service (e.g. IMD) and local authorities.
- Geolocation and device notifications need `https` or `localhost`.
