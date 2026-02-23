import { motion } from 'framer-motion';
import { Leaf, ArrowDown, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onStartTracking: () => void;
}

export function Hero({ onStartTracking }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span className="text-sm font-medium text-emerald-100">Track Your Impact on the Planet</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Eco
          </span>
          <span className="text-white/90">Tracker</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-xl sm:text-2xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Track Your Carbon Footprint & Go Green
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Button
            onClick={onStartTracking}
            size="lg"
            className="group relative px-8 py-6 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-xl shadow-emerald-500/25 backdrop-blur-sm border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40"
          >
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%', opacity: 0 }}
              whileHover={{ x: '100%', opacity: 0.3 }}
              transition={{ duration: 0.6 }}
            />
            <Leaf className="w-5 h-5 mr-2" />
            Start Tracking
          </Button>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: '🚗', label: 'Track Travel', desc: 'Monitor your transport emissions' },
            { icon: '🥗', label: 'Log Food', desc: 'See your diet\'s impact' },
            { icon: '⚡', label: 'Measure Energy', desc: 'Track home energy use' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="text-white font-medium">{feature.label}</div>
              <div className="text-emerald-200/60 text-sm">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 flex items-center justify-center gap-8 text-emerald-200/50"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="text-sm">Global Impact Tracking</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="text-sm">100% Private & Local</div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-emerald-200/50"
          >
            <span className="text-xs mb-2">Scroll to explore</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
