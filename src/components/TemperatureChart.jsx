import { useMemo } from 'react';
import { dayKey, formatHour, formatTemp, weekday } from '../utils/format';

const W = 800;
const H = 260;
const PAD = { l: 48, r: 16, t: 14, b: 30 };

/** Dependency-free SVG line chart: temperature and feels-like over 5 days. */
export default function TemperatureChart({ slots, tz, unit }) {
  const chart = useMemo(() => {
    const values = slots.flatMap((s) => [s.temp, s.feels]);
    const lo = Math.floor(Math.min(...values) - 1);
    let hi = Math.ceil(Math.max(...values) + 1);
    if (hi === lo) hi = lo + 1;

    const n = slots.length;
    const x = (i) => PAD.l + (n === 1 ? 0 : (i * (W - PAD.l - PAD.r)) / (n - 1));
    const y = (v) => PAD.t + (H - PAD.t - PAD.b) * (1 - (v - lo) / (hi - lo));
    const path = (key) => slots.map((s, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(s[key]).toFixed(1)}`).join(' ');

    const gridLines = Array.from({ length: 5 }, (_, i) => {
      const v = lo + ((hi - lo) * i) / 4;
      return { v, y: y(v) };
    });
    const dayMarks = [];
    let seen = '';
    slots.forEach((s, i) => {
      const k = dayKey(s.dt, tz);
      if (k !== seen) { seen = k; dayMarks.push({ x: x(i), label: weekday(s.dt, tz) }); }
    });

    return { x, y, gridLines, dayMarks, tempPath: path('temp'), feelsPath: path('feels') };
  }, [slots, tz]);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Temperature trend for the next five days">
      {chart.gridLines.map((g) => (
        <g key={g.y}>
          <line x1={PAD.l} x2={W - PAD.r} y1={g.y} y2={g.y} stroke="var(--line)" />
          <text x={PAD.l - 6} y={g.y + 4} textAnchor="end">{formatTemp(g.v, unit)}</text>
        </g>
      ))}
      {chart.dayMarks.map((d) => (
        <g key={d.x}>
          <line x1={d.x} x2={d.x} y1={PAD.t} y2={H - PAD.b} stroke="var(--line)" strokeDasharray="2 4" />
          <text x={d.x + 4} y={H - 10}>{d.label}</text>
        </g>
      ))}
      <path d={chart.feelsPath} fill="none" stroke="var(--l2)" strokeWidth="2" strokeDasharray="5 4" />
      <path d={chart.tempPath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" />
      {slots.map((s, i) => (
        <circle key={s.dt} cx={chart.x(i)} cy={chart.y(s.temp)} r="6" fill="transparent">
          <title>
            {`${weekday(s.dt, tz)} ${formatHour(s.dt, tz)}: ${formatTemp(s.temp, unit)} (feels ${formatTemp(s.feels, unit)}), rain chance ${s.pop}%`}
          </title>
        </circle>
      ))}
    </svg>
  );
}
