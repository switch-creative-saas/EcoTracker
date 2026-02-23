import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, Calculator, BarChart3, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Hero } from '@/sections/Hero';
import { InputForm } from '@/sections/InputForm';
import { Dashboard } from '@/sections/Dashboard';
import { Tips } from '@/sections/Tips';
import { Footer } from '@/sections/Footer';
import { useCarbonData } from '@/hooks/useCarbonData';
import { Toaster, toast } from 'sonner';

function App() {
  const { 
    data, 
    results, 
    updateTravel, 
    updateFood, 
    updateEnergy, 
    resetData 
  } = useCarbonData();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setShowResults] = useState(false);
  
  const inputFormRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleReset = () => {
    resetData();
    toast.info('Data reset to defaults');
  };

  const handleShowResults = () => {
    setShowResults(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navItems = [
    { label: 'Calculator', icon: Calculator, ref: inputFormRef },
    { label: 'Results', icon: BarChart3, ref: dashboardRef },
    { label: 'Tips', icon: Lightbulb, ref: tipsRef },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Toast notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(6, 78, 59, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff'
          }
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="#"
              onClick={(e) => { 
                e.preventDefault(); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white hidden sm:block">
                Eco<span className="text-emerald-400">Tracker</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={() => scrollToSection(item.ref)}
                  className="text-emerald-200/70 hover:text-white hover:bg-white/10"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={() => scrollToSection(item.ref)}
                    className="w-full justify-start text-emerald-200/70 hover:text-white hover:bg-white/10"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero onStartTracking={() => scrollToSection(inputFormRef)} />

        {/* Input Form Section */}
        <div ref={inputFormRef}>
          <InputForm
            data={data}
            results={results}
            onUpdateTravel={updateTravel}
            onUpdateFood={updateFood}
            onUpdateEnergy={updateEnergy}
            onReset={handleReset}
          />
        </div>

        {/* Live Results Preview */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-emerald-200/60 text-sm mb-1">Your Current Footprint</p>
                  <p className="text-3xl font-bold text-white">
                    {results.total.toFixed(2)} <span className="text-lg text-emerald-300">kg CO2e/day</span>
                  </p>
                  <p className="text-emerald-200/50 text-sm">
                    {(results.annual / 1000).toFixed(2)} tons/year
                  </p>
                </div>
                <Button
                  onClick={handleShowResults}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Full Report
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Section */}
        <div ref={dashboardRef}>
          <Dashboard results={results} />
        </div>

        {/* Tips Section */}
        <div ref={tipsRef}>
          <Tips results={results} />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button (Mobile) - Scroll to Calculator */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => scrollToSection(inputFormRef)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center md:hidden z-30"
      >
        <Calculator className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

export default App;
