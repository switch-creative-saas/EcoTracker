import { motion } from 'framer-motion';
import { Info, Shield, Share2, Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function Footer() {
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EcoTracker - Carbon Footprint Calculator',
          text: 'Check out this carbon footprint calculator!',
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard failed
      }
    }
  };

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Eco
              </span>
              Tracker
            </h3>
            <p className="text-emerald-200/60 text-sm mb-4 max-w-md">
              Track your carbon footprint and discover ways to reduce your impact on the planet. 
              Small changes make a big difference.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-emerald-200/50 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-emerald-200/50 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-emerald-200/50 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setShowAboutDialog(true)}
                  className="text-emerald-200/60 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPrivacyDialog(true)}
                  className="text-emerald-200/60 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={handleShare}
                  className="text-emerald-200/60 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? 'Link Copied!' : 'Share'}
                </button>
              </li>
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <h4 className="text-white font-semibold mb-4">Methodology</h4>
            <p className="text-emerald-200/60 text-sm">
              Emission factors based on EPA and IPCC guidelines. 
              Calculations are estimates for educational purposes.
            </p>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 pt-8 border-t border-white/5 text-center"
        >
          <p className="text-emerald-200/40 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for the planet
          </p>
          <p className="text-emerald-200/30 text-xs mt-2">
            © {new Date().getFullYear()} EcoTracker. All data stays on your device.
          </p>
        </motion.div>
      </div>

      {/* About Dialog */}
      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="bg-slate-950/95 backdrop-blur-xl border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Eco
              </span>
              Tracker
            </DialogTitle>
            <DialogDescription className="text-emerald-200/60">
              Your personal carbon footprint calculator
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-emerald-200/70">
            <p>
              EcoTracker helps you understand your environmental impact by calculating 
              your carbon footprint based on your daily habits.
            </p>
            <div className="space-y-2">
              <h5 className="text-white font-medium">How it works:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter your daily travel, food, and energy habits</li>
                <li>Get instant calculations of your carbon footprint</li>
                <li>Compare with global averages</li>
                <li>Receive personalized tips to reduce your impact</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h5 className="text-white font-medium">Privacy First:</h5>
              <p className="text-sm">
                All your data is stored locally on your device. Nothing is sent to any server.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="bg-slate-950/95 backdrop-blur-xl border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-emerald-200/70 text-sm">
            <p>
              At EcoTracker, we take your privacy seriously. Here's how we handle your data:
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="text-white font-medium mb-1">Local Storage Only</h5>
                <p>
                  All your carbon footprint data is stored locally in your browser using 
                  localStorage. No data is ever sent to our servers.
                </p>
              </div>
              <div>
                <h5 className="text-white font-medium mb-1">No Tracking</h5>
                <p>
                  We don't use cookies, analytics, or any tracking technologies. 
                  Your usage of the app is completely private.
                </p>
              </div>
              <div>
                <h5 className="text-white font-medium mb-1">Your Control</h5>
                <p>
                  You can clear all your data at any time using the reset button. 
                  Clearing your browser data will also remove your EcoTracker data.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
