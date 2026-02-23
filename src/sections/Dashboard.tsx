import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Leaf, TrendingDown, TrendingUp, Award, Globe, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EmissionResult } from '@/types/carbon';
import { GLOBAL_AVERAGES, CATEGORY_COLORS } from '@/types/carbon';
import { 
  formatEmissions, 
  getComparison, 
  getEcoScore, 
  getEcoScoreColor,
  getEcoScoreLabel 
} from '@/lib/calculator';
import jsPDF from 'jspdf';

interface DashboardProps {
  results: EmissionResult;
}

export function Dashboard({ results }: DashboardProps) {
  const comparison = getComparison(results.annual);
  const ecoScore = getEcoScore(results.annual);
  const ecoScoreColor = getEcoScoreColor(ecoScore);
  const ecoScoreLabel = getEcoScoreLabel(ecoScore);

  // Pie chart data
  const pieData = [
    { name: 'Travel', value: results.travel, color: CATEGORY_COLORS.travel },
    { name: 'Food', value: results.food, color: CATEGORY_COLORS.food },
    { name: 'Energy', value: results.energy, color: CATEGORY_COLORS.energy },
  ];

  // Bar chart data - comparison with averages
  const barData = [
    { name: 'You', value: Math.round(results.annual / 10) / 100, fill: ecoScoreColor },
    { name: 'World Avg', value: Math.round(GLOBAL_AVERAGES.world / 10) / 100, fill: '#64748B' },
    { name: 'USA Avg', value: Math.round(GLOBAL_AVERAGES.usa / 10) / 100, fill: '#94A3B8' },
    { name: 'Target', value: Math.round(GLOBAL_AVERAGES.target / 10) / 100, fill: '#22C55E' },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(34, 197, 94);
    doc.text('EcoTracker Report', 20, 30);
    
    // Date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Results
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Your Carbon Footprint', 20, 70);
    
    doc.setFontSize(14);
    doc.text(`Daily: ${formatEmissions(results.total)} CO2e`, 20, 90);
    doc.text(`Annual: ${formatEmissions(results.annual)} CO2e`, 20, 105);
    doc.text(`Eco Score: ${ecoScore}/100 (${ecoScoreLabel})`, 20, 120);
    
    // Breakdown
    doc.setFontSize(16);
    doc.text('Breakdown by Category', 20, 150);
    
    doc.setFontSize(12);
    doc.text(`Travel: ${formatEmissions(results.travel)}/day`, 20, 170);
    doc.text(`Food: ${formatEmissions(results.food)}/day`, 20, 185);
    doc.text(`Energy: ${formatEmissions(results.energy)}/day`, 20, 200);
    
    // Comparison
    doc.setFontSize(14);
    doc.setTextColor(ecoScoreColor);
    doc.text(comparison.message, 20, 240);
    
    doc.save('ecotracker-report.pdf');
  };

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
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Carbon Footprint
          </h2>
          <p className="text-emerald-200/70 text-lg">
            See how your daily habits impact the planet
          </p>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total Emissions */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-emerald-200/70">Annual Emissions</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {formatEmissions(results.annual)}
            </div>
            <div className="text-sm text-emerald-200/50">CO2e per year</div>
          </motion.div>

          {/* Daily Average */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-emerald-200/70">Daily Average</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {formatEmissions(results.total)}
            </div>
            <div className="text-sm text-emerald-200/50">CO2e per day</div>
          </motion.div>

          {/* Eco Score */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ecoScoreColor}30` }}>
                <Award className="w-5 h-5" style={{ color: ecoScoreColor }} />
              </div>
              <span className="text-emerald-200/70">Eco Score</span>
            </div>
            <div className="text-4xl font-bold mb-2" style={{ color: ecoScoreColor }}>
              {ecoScore}/100
            </div>
            <div className="text-sm text-emerald-200/50">{ecoScoreLabel}</div>
          </motion.div>
        </motion.div>

        {/* Comparison Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${
            comparison.better ? 'bg-emerald-500/10 border border-emerald-400/30' : 'bg-amber-500/10 border border-amber-400/30'
          }`}
        >
          {comparison.better ? (
            <TrendingDown className="w-5 h-5 text-emerald-400" />
          ) : (
            <TrendingUp className="w-5 h-5 text-amber-400" />
          )}
          <span className={comparison.better ? 'text-emerald-300' : 'text-amber-300'}>
            {comparison.message} ({comparison.percentage}% of global average)
          </span>
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Pie Chart */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              Emissions by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(6, 78, 59, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`${formatEmissions(value)}/day`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-emerald-200/70">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Comparison (tons CO2e/year)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(6, 78, 59, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`${value} tons`, 'CO2e/year']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { name: 'Travel', value: results.travel, color: CATEGORY_COLORS.travel, icon: '🚗' },
            { name: 'Food', value: results.food, color: CATEGORY_COLORS.food, icon: '🥗' },
            { name: 'Energy', value: results.energy, color: CATEGORY_COLORS.energy, icon: '⚡' },
          ].map((category) => (
            <motion.div
              key={category.name}
              variants={cardVariants}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{category.icon}</span>
                <span className="text-white font-medium">{category.name}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: category.color }}>
                {formatEmissions(category.value)}
              </div>
              <div className="text-sm text-emerald-200/50">per day</div>
              <div className="mt-2 text-lg font-semibold" style={{ color: category.color }}>
                {formatEmissions(category.value * 365)}
              </div>
              <div className="text-sm text-emerald-200/50">per year</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={exportToPDF}
            size="lg"
            className="group relative px-6 py-5 text-base font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-xl shadow-blue-500/25 backdrop-blur-sm border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report (PDF)
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
