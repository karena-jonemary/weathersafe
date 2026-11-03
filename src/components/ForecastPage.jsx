import { useWeatherApp } from '../context/WeatherContext';
import CurrentWeather from './CurrentWeather';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';
import TemperatureChart from './TemperatureChart';

/** Step 2 – Current Weather and 5-Day Forecast. */
export default function ForecastPage() {
  const { data, daily, risk, settings } = useWeatherApp();
  const { cur, slots, tz, air } = data;
  const { unit } = settings;

  return (
    <>
      <CurrentWeather cur={cur} tz={tz} air={air} risk={risk} unit={unit} />
      <HourlyForecast slots={slots} tz={tz} unit={unit} />
      <section className="card">
        <h2>Temperature trend – 5 days</h2>
        <TemperatureChart slots={slots} tz={tz} unit={unit} />
        <div className="legend">
          <span>━ Temperature</span><span>┅ Feels like</span><span>Hover a point for rain chance</span>
        </div>
      </section>
      <DailyForecast daily={daily} tz={tz} unit={unit} />
    </>
  );
}
