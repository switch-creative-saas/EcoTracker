import { motion } from 'framer-motion';
import { Car, Utensils, Zap, AlertCircle, RotateCcw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { CarbonData, TravelMode, HeatingType, EmissionResult } from '@/types/carbon';
import { CATEGORY_COLORS } from '@/types/carbon';

interface InputFormProps {
  data: CarbonData;
  results: EmissionResult;
  onUpdateTravel: (travel: Partial<CarbonData['travel']>) => void;
  onUpdateFood: (food: Partial<CarbonData['food']>) => void;
  onUpdateEnergy: (energy: Partial<CarbonData['energy']>) => void;
  onReset: () => void;
}

const travelModes: { value: TravelMode; label: string; icon: string }[] = [
  { value: 'car', label: 'Car', icon: '🚗' },
  { value: 'bus', label: 'Bus', icon: '🚌' },
  { value: 'bike', label: 'Bike', icon: '🚲' },
  { value: 'walk', label: 'Walk', icon: '🚶' },
  { value: 'flight', label: 'Flight', icon: '✈️' },
];

const heatingTypes: { value: HeatingType; label: string }[] = [
  { value: 'gas', label: 'Gas' },
  { value: 'electric', label: 'Electric' },
  { value: 'none', label: 'None' },
];

export function InputForm({
  data,
  results,
  onUpdateTravel,
  onUpdateFood,
  onUpdateEnergy,
  onReset,
}: InputFormProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
    }
  };

  // Format emissions for display
  const formatEmission = (value: number) => value.toFixed(2);

  return (
    <section id="input-form" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Calculate Your Footprint
          </h2>
          <p className="text-emerald-200/70 text-lg max-w-2xl mx-auto">
            Adjust the sliders below to see your carbon impact update in real-time. All data stays on your device.
          </p>
        </motion.div>

        {/* Live Preview Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Live Preview
            </h3>
            <span className="text-2xl font-bold text-white">
              {formatEmission(results.total)} <span className="text-sm text-emerald-300">kg/day</span>
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: `${Math.min((results.total / 50) * 100, 100)}%`,
                background: `linear-gradient(90deg, ${CATEGORY_COLORS.travel}, ${CATEGORY_COLORS.food}, ${CATEGORY_COLORS.energy})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((results.total / 50) * 100, 100)}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          
          {/* Category Breakdown */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-blue-300 mb-1">Travel</p>
              <p className="text-lg font-semibold" style={{ color: CATEGORY_COLORS.travel }}>
                {formatEmission(results.travel)}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-300 mb-1">Food</p>
              <p className="text-lg font-semibold" style={{ color: CATEGORY_COLORS.food }}>
                {formatEmission(results.food)}
              </p>
            </div>
            <div>
              <p className="text-xs text-amber-300 mb-1">Energy</p>
              <p className="text-lg font-semibold" style={{ color: CATEGORY_COLORS.energy }}>
                {formatEmission(results.energy)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Travel Card */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-400/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Travel</h3>
              </div>
              <span className="text-lg font-bold" style={{ color: CATEGORY_COLORS.travel }}>
                {formatEmission(results.travel)} kg
              </span>
            </div>

            <div className="space-y-5">
              {/* Travel Mode */}
              <div>
                <Label className="text-white/80 mb-3 block">Transport Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  {travelModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => onUpdateTravel({ mode: mode.value })}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        data.travel.mode === mode.value
                          ? 'bg-blue-500/20 border-blue-400/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{mode.icon}</span>
                      <span className="text-xs">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Distance: <span className="text-blue-400">{data.travel.distance} km</span>
                </Label>
                <Slider
                  value={[data.travel.distance]}
                  onValueChange={([value]) => onUpdateTravel({ distance: value })}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Frequency */}
              <div>
                <Label className="text-white/80 mb-3 block">Frequency</Label>
                <div className="flex gap-2">
                  {(['daily', 'weekly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => onUpdateTravel({ frequency: freq })}
                      className={`flex-1 py-2 px-4 rounded-xl border capitalize transition-all duration-200 ${
                        data.travel.frequency === freq
                          ? 'bg-blue-500/20 border-blue-400/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Food Card */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Food</h3>
              </div>
              <span className="text-lg font-bold" style={{ color: CATEGORY_COLORS.food }}>
                {formatEmission(results.food)} kg
              </span>
            </div>

            <div className="space-y-5">
              {/* Meat Servings */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Meat Servings/Day: <span className="text-emerald-400">{data.food.meatServings}</span>
                </Label>
                <Slider
                  value={[data.food.meatServings]}
                  onValueChange={([value]) => onUpdateFood({ meatServings: value })}
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Vegetarian Servings */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Veggie Servings/Day: <span className="text-emerald-400">{data.food.vegetarianServings}</span>
                </Label>
                <Slider
                  value={[data.food.vegetarianServings]}
                  onValueChange={([value]) => onUpdateFood({ vegetarianServings: value })}
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Local Food */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Local Food: <span className="text-emerald-400">{data.food.localPercentage}%</span>
                </Label>
                <Slider
                  value={[data.food.localPercentage]}
                  onValueChange={([value]) => onUpdateFood({ localPercentage: value })}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-emerald-200/50 mt-2">
                  Buying local reduces transportation emissions
                </p>
              </div>
            </div>
          </motion.div>

          {/* Energy Card */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-amber-400/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Energy</h3>
              </div>
              <span className="text-lg font-bold" style={{ color: CATEGORY_COLORS.energy }}>
                {formatEmission(results.energy)} kg
              </span>
            </div>

            <div className="space-y-5">
              {/* Electricity */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Electricity: <span className="text-amber-400">{data.energy.electricityKwh} kWh/day</span>
                </Label>
                <Slider
                  value={[data.energy.electricityKwh]}
                  onValueChange={([value]) => onUpdateEnergy({ electricityKwh: value })}
                  min={0}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Heating Type */}
              <div>
                <Label className="text-white/80 mb-3 block">Heating Type</Label>
                <div className="flex gap-2">
                  {heatingTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => onUpdateEnergy({ heatingType: type.value })}
                      className={`flex-1 py-2 px-3 rounded-xl border text-sm transition-all duration-200 ${
                        data.energy.heatingType === type.value
                          ? 'bg-amber-500/20 border-amber-400/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heating Usage */}
              {data.energy.heatingType !== 'none' && (
                <div>
                  <Label className="text-white/80 mb-2 block">
                    Heating: <span className="text-amber-400">{data.energy.heatingKwh} kWh/day</span>
                  </Label>
                  <Slider
                    value={[data.energy.heatingKwh]}
                    onValueChange={([value]) => onUpdateEnergy({ heatingKwh: value })}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {/* Water */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Water: <span className="text-amber-400">{data.energy.waterLiters} L/day</span>
                </Label>
                <Slider
                  value={[data.energy.waterLiters]}
                  onValueChange={([value]) => onUpdateEnergy({ waterLiters: value })}
                  min={0}
                  max={500}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="px-6 py-5 text-base bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2 text-emerald-200/50 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Calculations use standard EPA emission factors and update instantly</span>
        </motion.div>
      </div>
    </section>
  );
}
