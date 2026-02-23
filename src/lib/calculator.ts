import type { CarbonData, EmissionResult } from '@/types/carbon';
import { EMISSION_FACTORS } from '@/types/carbon';

/**
 * Calculate daily travel emissions
 */
export function calculateTravelEmissions(travel: CarbonData['travel']): number {
  const { mode, distance, frequency } = travel;
  
  // Get emission factor for the travel mode
  const factor = EMISSION_FACTORS.travel[mode];
  
  // Calculate daily distance
  let dailyDistance = distance;
  if (frequency === 'weekly') {
    dailyDistance = distance / 7;
  }
  
  return dailyDistance * factor;
}

/**
 * Calculate daily food emissions
 */
export function calculateFoodEmissions(food: CarbonData['food']): number {
  const { meatServings, vegetarianServings, localPercentage } = food;
  
  // Calculate base emissions
  const meatEmissions = meatServings * EMISSION_FACTORS.food.meat;
  const vegEmissions = vegetarianServings * EMISSION_FACTORS.food.vegetarian;
  
  // Apply local/imported multiplier
  const localMultiplier = 1 - (localPercentage / 100) * 0.2;
  
  return (meatEmissions + vegEmissions) * localMultiplier;
}

/**
 * Calculate daily energy emissions
 */
export function calculateEnergyEmissions(energy: CarbonData['energy']): number {
  const { electricityKwh, heatingType, heatingKwh, waterLiters } = energy;
  
  // Electricity emissions
  const electricityEmissions = electricityKwh * EMISSION_FACTORS.energy.electricity;
  
  // Heating emissions
  let heatingEmissions = 0;
  if (heatingType === 'gas') {
    heatingEmissions = heatingKwh * EMISSION_FACTORS.energy.gas;
  } else if (heatingType === 'electric') {
    heatingEmissions = heatingKwh * EMISSION_FACTORS.energy.electricity;
  }
  // 'none' produces 0 emissions
  
  // Water emissions
  const waterEmissions = waterLiters * EMISSION_FACTORS.energy.water;
  
  return electricityEmissions + heatingEmissions + waterEmissions;
}

/**
 * Calculate total carbon footprint
 */
export function calculateCarbonFootprint(data: CarbonData): EmissionResult {
  const travel = calculateTravelEmissions(data.travel);
  const food = calculateFoodEmissions(data.food);
  const energy = calculateEnergyEmissions(data.energy);
  const total = travel + food + energy;
  
  return {
    travel: Math.round(travel * 100) / 100,
    food: Math.round(food * 100) / 100,
    energy: Math.round(energy * 100) / 100,
    total: Math.round(total * 100) / 100,
    annual: Math.round(total * 365 * 100) / 100,
  };
}

/**
 * Format emissions for display
 */
export function formatEmissions(kgCO2: number): string {
  if (kgCO2 >= 1000) {
    return `${(kgCO2 / 1000).toFixed(2)} tons`;
  }
  return `${kgCO2.toFixed(1)} kg`;
}

/**
 * Get comparison to global average
 */
export function getComparison(annualEmissions: number): {
  percentage: number;
  better: boolean;
  message: string;
} {
  const worldAverage = 4800; // kg CO2e per year
  const percentage = Math.round((annualEmissions / worldAverage) * 100);
  const better = annualEmissions < worldAverage;
  
  let message: string;
  if (better) {
    if (percentage < 50) {
      message = 'Excellent! Your footprint is less than half the global average.';
    } else if (percentage < 80) {
      message = 'Great job! Your footprint is below the global average.';
    } else {
      message = 'Good! Your footprint is slightly below the global average.';
    }
  } else {
    if (percentage > 200) {
      message = 'Your footprint is more than double the global average. Consider making some changes.';
    } else if (percentage > 150) {
      message = 'Your footprint is significantly above the global average.';
    } else {
      message = 'Your footprint is slightly above the global average.';
    }
  }
  
  return { percentage, better, message };
}

/**
 * Get eco score (0-100)
 */
export function getEcoScore(annualEmissions: number): number {
  const target = 2000; // Paris Agreement target
  const worldAverage = 4800;
  
  if (annualEmissions <= target) {
    return 100;
  }
  
  if (annualEmissions >= worldAverage * 2) {
    return 0;
  }
  
  // Linear scale between target and 2x average
  const score = 100 - ((annualEmissions - target) / (worldAverage * 2 - target)) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get eco score color
 */
export function getEcoScoreColor(score: number): string {
  if (score >= 80) return '#22C55E'; // green
  if (score >= 60) return '#84CC16'; // lime
  if (score >= 40) return '#EAB308'; // yellow
  if (score >= 20) return '#F97316'; // orange
  return '#EF4444'; // red
}

/**
 * Get eco score label
 */
export function getEcoScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Below Average';
  return 'Needs Improvement';
}

/**
 * Default carbon data
 */
export const DEFAULT_CARBON_DATA: CarbonData = {
  travel: {
    mode: 'car',
    distance: 20,
    frequency: 'daily',
  },
  food: {
    meatServings: 1,
    vegetarianServings: 2,
    localPercentage: 50,
  },
  energy: {
    electricityKwh: 10,
    heatingType: 'gas',
    heatingKwh: 5,
    waterLiters: 150,
  },
};
