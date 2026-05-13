import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SuccessScreen() {
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const finalScore = Math.floor(Math.random() * 21) + 80;
    setScore(finalScore);

    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Animate count-up
    let current = 0;
    const increment = Math.ceil(finalScore / 60);
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalScore) {
        setDisplayScore(finalScore);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, 20);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const getRank = (s: number) => {
    if (s >= 95) return { label: 'Exceptional', color: '#C9A84C', icon: '👑' };
    if (s >= 88) return { label: 'Outstanding', color: '#10B981', icon: '🔥' };
    return { label: 'Great', color: '#6366F1', icon: '✨' };
  };

  const rank = getRank(score);

  return (
    <div className="flex flex-col items-center justify-center flex-1 py-4 text-center">
      {/* Success Icon */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-200">
          <CheckCircle2 size={48} className="text-white" />
        </div>
        {/* <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg"
        >
          <Sparkles size={16} />
        </motion.div> */}
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-slate-900 mb-2 tracking-tight"
      >
        Review Successfully Published!
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-500 text-[17px] max-w-sm leading-relaxed mb-10"
      >
        Thank you for your valuable contribution. You've earned new points for your profile!
      </motion.p>

      {/* Score card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="w-full max-w-sm rounded-[32px] p-8 mb-10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F1729 0%, #1A2744 100%)',
          boxShadow: '0 20px 40px rgba(15,23,41,0.2)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-12 -mb-12 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy size={18} className="text-amber-400" />
            <span className="text-white/40 text-[13px] font-bold uppercase tracking-[2px]">Impact Score</span>
          </div>
          
          <div className="text-7xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500">
            {displayScore}
          </div>
          
          <div className="inline-flex items-center gap-2.5 rounded-2xl px-5 py-2.5 bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xl">{rank.icon}</span>
            <span className="text-white font-bold text-[15px]">{rank.label} Contributor</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <button
          onClick={() => window.location.reload()}
          className="group w-full py-5 rounded-2xl font-bold text-[17px] bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo/20 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          Submit Another Review
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-slate-400 text-[13px] font-medium">
          Points will be updated in your dashboard within 24h.
        </p>
      </motion.div>
    </div>
  );
}
