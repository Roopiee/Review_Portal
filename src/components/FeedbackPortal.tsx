'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle2 } from 'lucide-react';
import Navbar from './Navbar';
import BasicInfo from './steps/BasicInfo';
import FeedbackDetails from './steps/FeedbackDetails';
import ExternalReview from './steps/ExternalReview';
import ImageUpload from './steps/ImageUpload';
import SuccessScreen from './steps/SuccessScreen';

interface Contributor {
  id: number;
  initials: string;
  bg: string;
  name: string;
  role: string;
  score: number;
}

export default function FeedbackPortal() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    teamLead: '',
    role: '',
    likes: '',
    dislikes: '',
    rating: 0,
    isAnonymous: false,
    platformsVisited: [] as string[],
  });
  const [images, setImages] = useState<Record<string, File>>({});
  const [leaderboard, setLeaderboard] = useState<Contributor[]>([
    { id: 1, initials: 'AR', bg: 'from-[#6366f1] to-[#8b5cf6]', name: 'Roopieee', role: 'AI Developer', score: 12 },
    { id: 2, initials: 'SC', bg: 'from-[#14b8a6] to-[#06b6d4]', name: 'Aruzaa', role: 'Product Manager', score: 9 },
    { id: 3, initials: 'MS', bg: 'from-[#f59e0b] to-[#ef4444]', name: 'Yuvi', role: 'UX Designer', score: 7 },
    { id: 4, initials: 'JW', bg: 'from-[#10b981] to-[#3b82f6]', name: 'murlibro', role: 'Backend Dev', score: 5 },
    { id: 5, initials: 'DP', bg: 'from-[#ec4899] to-[#8b5cf6]', name: 'sunilbro', role: 'Data Scientist', score: 4 },
  ]);
  const [totalSubmissions, setTotalSubmissions] = useState(2000);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.contributors && data.contributors.length > 0) {
          const bgColors = [
            'from-[#6366f1] to-[#8b5cf6]',
            'from-[#14b8a6] to-[#06b6d4]',
            'from-[#f59e0b] to-[#ef4444]',
            'from-[#10b981] to-[#3b82f6]',
            'from-[#ec4899] to-[#8b5cf6]'
          ];
          setLeaderboard(data.contributors.map((c: any, i: number) => ({
            id: i + 1,
            initials: c.name.substring(0, 2).toUpperCase(),
            bg: bgColors[i % bgColors.length],
            name: c.name,
            role: c.role,
            score: c.score,
          })));
        }
        if (data.totalEmployees) {
          setTotalSubmissions(data.totalEmployees);
        }
      })
      .catch(err => console.error('Failed to fetch leaderboard:', err));
  }, []);

  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const goToStep = (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        console.error('Submit failed', await res.text());
      }
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
    setStep(5);
  };

  const stepVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const [direction, setDirection] = useState(0);

  const handleStepChange = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate bg-blue-300">
      {/* ── PROGRESS BAR ── */}
      {step < 5 && (
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo via-indigo-light to-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
      )}

      {/* ── NAVBAR ── */}
      <Navbar step={step} totalSubmissions={totalSubmissions} />
      

      {/* ── HERO TEXT ── */}
      <div className="pt-12 px-8 lg:px-20 pb-0 w-full max-w-[1500px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl lg:text-[42px] font-bold text-slate tracking-[-0.5px] mb-2"
        >
          Fill the form to win exciting prizes!! 🎁
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[16px] lg:text-lg text-slate-mid font-normal"
        >
          Shape the future of our company
        </motion.p>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 max-w-[1500px] mx-auto mt-4 mb-16 px-8 lg:px-20 items-start w-full">
        {/* ── CARD ── */}
        <div className="bg-white rounded-3xl shadow-xl p-12 lg:p-14 border border-slate-100 relative overflow-hidden min-h-[600px]">
          {/* Submitting overlay */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-full border-[3px] border-slate-100 border-t-indigo animate-spin mb-4" />
                <p className="text-slate-mid font-bold text-base">Submitting your review…</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="w-full h-full"
                >
                  {step === 1 && <BasicInfo data={formData} updateData={updateFormData} onNext={nextStep} />}
                  {step === 2 && <FeedbackDetails data={formData} updateData={updateFormData} onNext={nextStep} onBack={prevStep} />}
                  {step === 3 && <ExternalReview formData={formData} onPlatformVisited={(platform) => updateFormData({ platformsVisited: Array.from(new Set([...formData.platformsVisited, platform])) })} onNext={nextStep} onBack={prevStep} />}
                  {step === 4 && <ImageUpload images={images} setImages={setImages} onNext={nextStep} onBack={prevStep} />}
                  {step === 5 && <SuccessScreen />}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {step < 5 && (
              <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-slate-50">
                {[1, 2, 3, 4].map(idx => (
                  <button 
                    key={idx} 
                    onClick={() => idx < step && handleStepChange(idx)}
                    className={`group relative flex items-center justify-center transition-all duration-300 ${idx < step ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className={`h-[6px] rounded-full transition-all duration-500 ${
                      step === idx ? 'bg-indigo w-12' : 
                      idx < step ? 'bg-indigo/40 w-8 group-hover:bg-indigo/60' : 
                      'bg-slate-200 w-8'
                    }`} />
                    {idx < step && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Go to Step {idx}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="flex flex-col gap-8 sticky top-32">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
          >
            <div className="flex items-center gap-3 font-serif text-xl font-bold text-slate mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl">🏆</div>
              Top Contributors
            </div>
            <div className="space-y-2">
              {leaderboard.map((contributor, index) => (
                <motion.div 
                  key={contributor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(248,250,252,0.8)' }}
                  className="flex items-center gap-4 p-3 rounded-2xl transition-colors cursor-default"
                >
                  <div className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${contributor.bg} flex items-center justify-center text-[13px] font-bold text-white shadow-lg shrink-0`}>
                    {contributor.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold text-slate leading-tight">{contributor.name}</div>
                    <div className="text-[12px] text-slate-light font-medium mt-[1px]">{contributor.role}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-indigo/5 text-indigo px-3 py-1 rounded-full text-[13px] font-bold">
                    {contributor.score}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
          >
            <div className="flex items-center gap-3 font-serif text-[18px] font-bold text-slate mb-6">
              <div className="w-9 h-9 rounded-lg bg-indigo/5 flex items-center justify-center">
                <Users size={18} className="text-indigo" />
              </div>
              Community Impact
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4 p-[2px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo via-indigo-light to-blue-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]" 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold tracking-wider uppercase text-indigo">{(totalSubmissions/500) * 100}% Target Reached</span>
              <span className="text-[12px] font-bold text-slate-mid">{totalSubmissions}/500</span>
            </div>
          </motion.div>
        </aside>
      </div>
      
      <footer className="text-center p-8 text-[12px] text-slate-light font-medium tracking-wide">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>Internal Secure Portal</span>
          <span className="text-slate-200">|</span>
          <span>Confidential</span>
        </div>
        <div className="opacity-60">Version 2.4.0 &bull; &copy; 2024 NetConnectGlobal</div>
      </footer>
    </div>
  );
}
