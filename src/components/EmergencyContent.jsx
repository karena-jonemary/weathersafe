import { EMERGENCY_ACTIONS, emergencyTips } from '../utils/guidance';
import RiskBadge from './RiskBadge';

/** Shared by the Emergency step and the pop-up: serious hazards + "do this now" actions. */
export default function EmergencyContent({ city, risk }) {
  const serious = risk.items.filter((i) => i.level >= 2);
  const actions = [...emergencyTips(serious), ...EMERGENCY_ACTIONS];

  return (
    <>
      <p className="no-top"><strong>{city}</strong> – risk level: <RiskBadge level={risk.level} /></p>
      <ul>
        {serious.map((i) => (
          <li key={i.type}><strong>{i.title}</strong> – {i.detail} ({i.when.toLowerCase()})</li>
        ))}
      </ul>
      <h3>Do this now</h3>
      <ul>{actions.map((a) => <li key={a}>{a}</li>)}</ul>
    </>
  );
}
