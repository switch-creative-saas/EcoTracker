// Carbon Footprint Types and Emission Factors

// Travel Types
export type TravelMode = 'car' | 'bus' | 'bike' | 'walk' | 'flight';

export interface TravelData {
  mode: TravelMode;
  distance: number; // in km
  frequency: 'daily' | 'weekly';
}

// Food Types
export interface FoodData {
  meatServings: number; // per day
  vegetarianServings: number; // per day
  localPercentage: number; // 0-100
}

// Energy Types
export type HeatingType = 'gas' | 'electric' | 'none';

export interface EnergyData {
  electricityKwh: number; // per day
  heatingType: HeatingType;
  heatingKwh: number; // per day
  waterLiters: number; // per day
}

// Complete Carbon Data
export interface CarbonData {
  travel: TravelData;
  food: FoodData;
  energy: EnergyData;
}

// Emission Results
export interface EmissionResult {
  travel: number; // kg CO2e per day
  food: number; // kg CO2e per day
  energy: number; // kg CO2e per day
  total: number; // kg CO2e per day
  annual: number; // kg CO2e per year
}

// Emission Factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  travel: {
    car: 0.2, // kg CO2e per km
    bus: 0.1, // kg CO2e per km
    bike: 0, // kg CO2e per km
    walk: 0, // kg CO2e per km
    flight: 0.25, // kg CO2e per km
  },
  food: {
    meat: 10, // kg CO2e per serving
    vegetarian: 2, // kg CO2e per serving
    localMultiplier: 0.8, // reduce by 20% if local
    importedMultiplier: 1.2, // increase by 20% if imported
  },
  energy: {
    electricity: 0.5, // kg CO2e per kWh
    gas: 0.2, // kg CO2e per kWh
    water: 0.001, // kg CO2e per liter
  },
} as const;

// Global averages (kg CO2e per year)
export const GLOBAL_AVERAGES = {
  world: 4800, // ~4.8 tons
  usa: 16000, // ~16 tons
  eu: 7500, // ~7.5 tons
  target: 2000, // ~2 tons (Paris Agreement target)
} as const;

// Tips based on emission categories
export interface Tip {
  id: string;
  category: 'travel' | 'food' | 'energy';
  icon: string;
  title: string;
  description: string;
  potentialReduction: number; // percentage reduction possible
}

export const TIPS: Tip[] = [
  {
    id: 'travel-1',
    category: 'travel',
    icon: '🚌',
    title: 'Switch to Public Transport',
    description: 'Taking the bus instead of driving can reduce your travel emissions by up to 50%.',
    potentialReduction: 50,
  },
  {
    id: 'travel-2',
    category: 'travel',
    icon: '🚲',
    title: 'Bike or Walk Short Distances',
    description: 'For trips under 5km, biking or walking produces zero emissions and improves health.',
    potentialReduction: 100,
  },
  {
    id: 'travel-3',
    category: 'travel',
    icon: '✈️',
    title: 'Reduce Air Travel',
    description: 'Consider video calls for meetings and trains for shorter trips. One flight can equal months of car emissions.',
    potentialReduction: 80,
  },
  {
    id: 'food-1',
    category: 'food',
    icon: '🥗',
    title: 'Eat More Plant-Based Meals',
    description: 'Reducing meat consumption by just one meal per day can cut your food emissions by 15%.',
    potentialReduction: 15,
  },
  {
    id: 'food-2',
    category: 'food',
    icon: '🌾',
    title: 'Choose Local & Seasonal',
    description: 'Buying local produce reduces transportation emissions and supports local farmers.',
    potentialReduction: 20,
  },
  {
    id: 'food-3',
    category: 'food',
    icon: '🥩',
    title: 'Reduce Red Meat',
    description: 'Beef has the highest carbon footprint. Try chicken, fish, or plant-based alternatives.',
    potentialReduction: 30,
  },
  {
    id: 'energy-1',
    category: 'energy',
    icon: '💡',
    title: 'Switch to LED Bulbs',
    description: 'LED bulbs use 75% less energy and last 25 times longer than incandescent.',
    potentialReduction: 10,
  },
  {
    id: 'energy-2',
    category: 'energy',
    icon: '🌡️',
    title: 'Adjust Thermostat',
    description: 'Lowering heating by 1°C can reduce energy use by up to 10%.',
    potentialReduction: 10,
  },
  {
    id: 'energy-3',
    category: 'energy',
    icon: '🔌',
    title: 'Unplug Unused Devices',
    description: 'Standby power can account for up to 10% of your electricity bill.',
    potentialReduction: 5,
  },
  {
    id: 'energy-4',
    category: 'energy',
    icon: '🚿',
    title: 'Take Shorter Showers',
    description: 'Reducing shower time by 2 minutes can save thousands of liters of water per year.',
    potentialReduction: 5,
  },
];

// Category colors for charts
export const CATEGORY_COLORS = {
  travel: '#3B82F6', // blue-500
  food: '#22C55E', // green-500
  energy: '#F59E0B', // amber-500
} as const;

// Get relevant tips based on emission breakdown
export function getRelevantTips(emissions: EmissionResult, topN: number = 4): Tip[] {
  // Sort categories by emission
  const categories: Array<{ category: 'travel' | 'food' | 'energy'; value: number }> = [
    { category: 'travel', value: emissions.travel },
    { category: 'food', value: emissions.food },
    { category: 'energy', value: emissions.energy },
  ];
  
  categories.sort((a, b) => b.value - a.value);
  
  // Get tips for highest emission categories
  const relevantTips: Tip[] = [];
  const usedIds = new Set<string>();
  
  for (const cat of categories) {
    const catTips = TIPS.filter(t => t.category === cat.category && !usedIds.has(t.id));
    for (const tip of catTips.slice(0, 2)) {
      if (relevantTips.length < topN) {
        relevantTips.push(tip);
        usedIds.add(tip.id);
      }
    }
  }
  
  return relevantTips;
}
