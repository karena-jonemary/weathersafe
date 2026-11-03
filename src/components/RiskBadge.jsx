import { LEVELS } from '../utils/format';

export default function RiskBadge({ level, prefix = '' }) {
  return <span className={`badge b${level}`}>{prefix}{LEVELS[level]}</span>;
}
