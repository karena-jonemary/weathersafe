// Weather Safety Guidance: practical precautions per hazard type and level.
// Each list is [Low, Moderate, High/Severe].
const TIPS = {
  heat: [
    ['Stay hydrated and wear light clothing.'],
    ['Avoid strenuous outdoor work between 11 AM and 4 PM.', 'Drink water often, even if not thirsty.', 'Use sunscreen, a hat or an umbrella outdoors.'],
    ['Stay indoors in a cool, ventilated place.', 'Check on children, the elderly and outdoor workers.', 'Heat stroke signs (confusion, hot dry skin, fainting): seek medical help immediately.'],
  ],
  cold: [
    ['Dress in warm layers.'],
    ['Wear layers, gloves and a cap; keep dry.', 'Keep your home warm and check on elderly neighbours.'],
    ['Limit time outdoors; watch for frostbite and hypothermia.', 'Never use charcoal or gas stoves indoors for heating without ventilation.', 'Keep emergency food, water and blankets ready.'],
  ],
  wind: [
    ['Secure light outdoor items.'],
    ['Secure balcony and roof items; avoid standing under trees or hoardings.', 'Take care when riding two-wheelers.'],
    ['Stay indoors away from windows.', 'Avoid travel, bridges, flyovers and coastal roads.', 'Stay clear of fallen power lines and report them.'],
  ],
  storm: [
    ['Keep an eye on the sky and forecasts.'],
    ['Move indoors at the first thunder; avoid open fields and tall trees.', 'Unplug sensitive electronics.'],
    ['Shelter in a sturdy building; stay away from windows, water and metal fixtures.', 'Do not shelter under isolated trees.', 'Avoid driving; if caught on the road, park safely away from trees and poles.'],
  ],
  rain: [
    ['Carry an umbrella or raincoat.'],
    ['Allow extra travel time and drive slowly.', 'Avoid walking through standing water.'],
    ['Avoid low-lying areas, underpasses and flooded roads – never drive through floodwater.', 'Move valuables to higher places; keep a torch and power bank ready.', 'Move to higher ground if water levels rise.'],
  ],
  snow: [
    ['Wear warm, non-slip footwear.'],
    ['Drive slowly with winter tyres/chains; keep extra distance.', 'Clear walkways to prevent slips.'],
    ['Avoid travel unless essential.', 'Stock food, water, medicines and heating fuel.', 'Check on vulnerable neighbours.'],
  ],
  visibility: [
    ['Use headlights when visibility drops.'],
    ['Use low-beam and fog lights; reduce speed.', 'Increase following distance.'],
    ['Postpone non-essential travel.', 'If driving, pull over safely and switch on hazard lights.'],
  ],
  air: [
    ['Consider reducing intense outdoor exercise.'],
    ['Sensitive groups should limit outdoor time and wear an N95/FFP2 mask.', 'Keep windows closed and use air purifiers if available.'],
    ['Stay indoors; avoid outdoor exercise completely.', 'Wear an N95/FFP2 mask if you must go out.', 'People with asthma/heart conditions should keep medicines at hand.'],
  ],
  clear: [['Enjoy your day – conditions are calm.', 'Still check the forecast before long trips.']],
};

export const TYPE_ICON = {
  heat: '🥵', cold: '🥶', wind: '💨', storm: '⛈️', rain: '🌧️', snow: '❄️', visibility: '🌫️', air: '😷', clear: '✅',
};

export const EMERGENCY_ACTIONS = [
  'Move to a safe, sturdy shelter and stay there until the threat passes.',
  'Avoid all non-essential travel.',
  'Keep your phone charged; keep a power bank, torch, drinking water, first-aid kit and medicines ready.',
  'Follow instructions from local authorities and disaster-management teams.',
  'In danger? Call your local emergency number (112 in India and the EU, 911 in the US).',
];

export const PREPAREDNESS_TIPS = [
  'Keep your phone charged and a power bank ready.',
  'Keep a torch, drinking water, first-aid kit and essential medicines at home.',
  'Know your nearest safe shelter and keep important documents in a waterproof bag.',
];

/** Precautions for one hazard item ({type, level}). */
export function tipsFor(item) {
  const tiers = TIPS[item.type] || TIPS.clear;
  const index = item.level === 0 ? 0 : item.level === 1 ? 1 : 2;
  return tiers[Math.min(index, tiers.length - 1)];
}

/** Unique tips for the most serious hazards, used in emergency mode. */
export function emergencyTips(items, max = 5) {
  return [...new Set(items.flatMap(tipsFor))].slice(0, max);
}
