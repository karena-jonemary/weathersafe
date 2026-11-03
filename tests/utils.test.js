import { describe, expect, it } from 'vitest';
import { rateActivities } from '../src/utils/activities';
import { buildDemoData } from '../src/utils/demoData';
import { formatTemp, formatTime } from '../src/utils/format';
import { DataError, groupDaily, inRange, processAir, processCurrent, processForecast } from '../src/utils/processing';
import { assessRisk, evaluateSnapshot } from '../src/utils/risk';

const load = (scenario) => {
  const raw = buildDemoData(scenario);
  const cur = processCurrent(raw.cur);
  const { slots, tz } = processForecast(raw.fc);
  return { cur, slots, tz, air: processAir(raw.air) };
};

describe('format', () => {
  it('formats temperature in C and F', () => {
    expect(formatTemp(30.4, 'C')).toBe('30°C');
    expect(formatTemp(0, 'F')).toBe('32°F');
    expect(formatTemp(null)).toBe('–');
  });
  it('formats local time using the timezone offset', () => {
    // 2024-01-01 00:00 UTC + 5h30 = 5:30 AM
    expect(formatTime(1704067200, 19800)).toBe('5:30 AM');
  });
});

describe('processing / validation', () => {
  it('inRange rejects out-of-range and non-numbers', () => {
    expect(inRange(5, 0, 10)).toBe(5);
    expect(inRange(11, 0, 10)).toBeNull();
    expect(inRange('5', 0, 10)).toBeNull();
    expect(inRange(NaN, 0, 10)).toBeNull();
  });
  it('rejects incomplete current weather', () => {
    expect(() => processCurrent({})).toThrow(DataError);
    expect(() => processCurrent({ main: { temp: 999 }, weather: [{}] })).toThrow(DataError);
  });
  it('rejects empty forecast', () => {
    expect(() => processForecast({ list: [] })).toThrow(DataError);
  });
  it('drops invalid forecast slots but keeps valid ones', () => {
    const raw = buildDemoData('clear').fc;
    raw.list[0].main.temp = 9999;
    expect(processForecast(raw).slots).toHaveLength(39);
  });
  it('groups the 5-day forecast by day', () => {
    const { slots, tz } = load('clear');
    const daily = groupDaily(slots, tz);
    expect(daily.length).toBeGreaterThanOrEqual(5);
    daily.forEach((d) => expect(d.max).toBeGreaterThanOrEqual(d.min));
  });
  it('ignores invalid air quality data', () => {
    expect(processAir({ list: [{ main: { aqi: 9 } }] })).toBeNull();
    expect(processAir(null)).toBeNull();
  });
});

describe('risk assessment', () => {
  const calm = { temp: 24, feels: 24, wind: 2, visibility: 10, id: 800, rain: 0, snow: 0, pop: 0 };

  it('finds no hazards in calm weather', () => {
    expect(evaluateSnapshot(calm)).toEqual([]);
  });
  it('classifies heat by feels-like temperature', () => {
    const level = (feels) => evaluateSnapshot({ ...calm, feels })[0]?.level;
    expect(level(36)).toBe(1);
    expect(level(42)).toBe(2);
    expect(level(46)).toBe(3);
  });
  it('classifies freezing temperatures', () => {
    expect(evaluateSnapshot({ ...calm, temp: 3 })[0].level).toBe(1);
    expect(evaluateSnapshot({ ...calm, temp: -2 })[0].level).toBe(2);
    expect(evaluateSnapshot({ ...calm, temp: -12 })[0].level).toBe(3);
  });
  it('flags a heavy thunderstorm as Severe', () => {
    const hazards = evaluateSnapshot({ ...calm, id: 212 });
    expect(hazards.find((h) => h.type === 'storm').level).toBe(3);
  });

  it.each([
    ['clear', 1, 1], // Moderate: hot
    ['rain', 2, 2], // High
    ['storm', 3, 3], // Severe
    ['heat', 3, 3], // Severe
    ['cold', 2, 2], // High
  ])('demo scenario %s has the expected level', (scenario, min, max) => {
    const { cur, slots, tz, air } = load(scenario);
    const { level, items } = assessRisk({ cur, slots, tz, air });
    expect(level).toBeGreaterThanOrEqual(min);
    expect(level).toBeLessThanOrEqual(max);
    expect(items[0].level).toBe(level); // sorted worst first
  });
});

describe('activity planner', () => {
  it('advises against outdoor activities in a thunderstorm', () => {
    const { cur, slots, tz, air } = load('storm');
    const ratings = rateActivities({ cur, slots, tz, air, formatHour: () => '' });
    expect(ratings.find((r) => r.name.startsWith('Walk')).verdict.label).toBe('Avoid');
  });
  it('rates everything Good-ish in calm weather', () => {
    const { cur, slots, tz } = load('clear');
    const ratings = rateActivities({ cur, slots, tz, air: null, formatHour: () => '' });
    expect(ratings.find((r) => r.name.startsWith('Dry laundry')).verdict.label).toBe('Good');
  });
});
