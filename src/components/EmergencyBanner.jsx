export default function EmergencyBanner({ city, risk, onView }) {
  if (!risk || risk.level < 2) return null;
  const serious = risk.items.filter((i) => i.level >= 2);
  return (
    <div className={`banner l${risk.level}`} role="alert">
      <div>
        <strong>{risk.level === 3 ? '🚨 SEVERE WEATHER WARNING' : '⚠️ HIGH RISK WEATHER'} – {city}</strong>
        <br />
        {serious.map((i) => `${i.title} (${i.when.toLowerCase()})`).join(' · ')}
      </div>
      <button type="button" onClick={onView}>View safety actions</button>
    </div>
  );
}
