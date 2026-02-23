import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Leaf } from 'lucide-react';
import type { EmissionResult } from '@/types/carbon';
import { getRelevantTips } from '@/types/carbon';

interface TipsProps {
  results: EmissionResult;
}

export function Tips({ results }: TipsProps) {
  const relevantTips = getRelevantTips(results, 6);

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

  return (
    <section id="tips" className="py-20 px-4 sm:px-6 lg:px-8">
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
            Personalized Tips
          </h2>
          <p className="text-emerald-200/70 text-lg max-w-2xl mx-auto">
            Based on your carbon footprint, here are ways to reduce your impact
          </p>
        </motion.div>

        {/* Tips Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {relevantTips.map((tip) => (
            <motion.div
              key={tip.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon & Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{tip.icon}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    tip.category === 'travel' ? 'bg-blue-500/20 text-blue-300' :
                    tip.category === 'food' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {tip.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {tip.title}
                </h3>

                {/* Description */}
                <p className="text-emerald-200/60 text-sm mb-4 leading-relaxed">
                  {tip.description}
                </p>

                {/* Potential Reduction */}
                <div className="flex items-center gap-2 text-sm">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">
                    Save up to {tip.potentialReduction}%
                  </span>
                </div>
              </div>

              {/* Arrow Indicator */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight className="w-5 h-5 text-emerald-400" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-semibold text-white mb-1">
                Want to learn more?
              </h4>
              <p className="text-emerald-200/60 text-sm">
                Small changes add up. Reducing your footprint by just 10% can save 
                approximately {formatEmissions(results.annual * 0.1)} of CO2 per year.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Helper function for formatting
function formatEmissions(kgCO2: number): string {
  if (kgCO2 >= 1000) {
    return `${(kgCO2 / 1000).toFixed(2)} tons`;
  }
  return `${kgCO2.toFixed(0)} kg`;
}
