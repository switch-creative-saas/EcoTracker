import { useState, useCallback, useEffect, useMemo } from 'react';
import type { CarbonData, EmissionResult } from '@/types/carbon';
import { 
  calculateCarbonFootprint, 
  DEFAULT_CARBON_DATA 
} from '@/lib/calculator';

const STORAGE_KEY = 'ecotracker-data';

interface UseCarbonDataReturn {
  data: CarbonData;
  results: EmissionResult;
  updateTravel: (travel: Partial<CarbonData['travel']>) => void;
  updateFood: (food: Partial<CarbonData['food']>) => void;
  updateEnergy: (energy: Partial<CarbonData['energy']>) => void;
  resetData: () => void;
}

export function useCarbonData(): UseCarbonDataReturn {
  // Load from localStorage or use defaults
  const [data, setData] = useState<CarbonData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_CARBON_DATA;
        }
      }
    }
    return DEFAULT_CARBON_DATA;
  });

  // Calculate results in real-time whenever data changes
  const results = useMemo(() => {
    return calculateCarbonFootprint(data);
  }, [data]);

  // Save to localStorage when data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const updateTravel = useCallback((travel: Partial<CarbonData['travel']>) => {
    setData(prev => ({
      ...prev,
      travel: { ...prev.travel, ...travel },
    }));
  }, []);

  const updateFood = useCallback((food: Partial<CarbonData['food']>) => {
    setData(prev => ({
      ...prev,
      food: { ...prev.food, ...food },
    }));
  }, []);

  const updateEnergy = useCallback((energy: Partial<CarbonData['energy']>) => {
    setData(prev => ({
      ...prev,
      energy: { ...prev.energy, ...energy },
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(DEFAULT_CARBON_DATA);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    data,
    results,
    updateTravel,
    updateFood,
    updateEnergy,
    resetData,
  };
}
