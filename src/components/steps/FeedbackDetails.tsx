import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Mic, MessageSquare, AlertCircle } from 'lucide-react';

interface FeedbackDetailsProps {
  data: {
    likes: string;
    dislikes: string;
    rating: number;
    isAnonymous: boolean;
  };
  updateData: (fields: Partial<{ likes: string; dislikes: string; rating: number; isAnonymous: boolean }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FeedbackDetails({ data, updateData, onNext, onBack }: FeedbackDetailsProps) {
  const isComplete = data.rating > 0 && data.likes.length >= 10;
  const [listeningFor, setListeningFor] = useState<'likes' | 'dislikes' | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  const toggleListening = (field: 'likes' | 'dislikes') => {
    if (listeningFor === field) {
      setListeningFor(null);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onstart = () => setListeningFor(field);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript).join(' ');
      updateData({ [field]: data[field] ? `${data[field]} ${transcript}` : transcript });
    };
    recognition.onerror = () => setListeningFor(null);
    recognition.onend = () => setListeningFor(null);
    recognition.start();
  };

  const getSentimentEmoji = (r: number) => {
    if (r === 0) return '😶';
    if (r <= 1) return '😫';
    if (r <= 2) return '😕';
    if (r <= 3) return '🙂';
    if (r <= 4) return '😊';
    return '🤩';
  };

  const MicButton = ({ field }: { field: 'likes' | 'dislikes' }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => toggleListening(field)}
      title="Speak your answer"
      type="button"
      className={`absolute right-4 top-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
        listeningFor === field
          ? 'bg-red-500 text-white shadow-red-200'
          : 'bg-white text-slate-400 hover:text-indigo border border-slate-100 hover:border-indigo/20'
      }`}
    >
      <Mic size={18} className={listeningFor === field ? 'animate-pulse' : ''} />
    </motion.button>
  );

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Step header */}
      <div className="flex items-center gap-2 text-indigo font-bold text-[13px] uppercase tracking-wider mb-4">
        <span className="w-8 h-[2px] bg-indigo/20" />
        Step 2 of 4
      </div>
      
      <h2 className="font-serif text-3xl lg:text-[38px] font-bold text-slate mb-3 tracking-tight leading-tight">
        Share Your Experience
      </h2>
      <p className="text-[17px] text-slate-mid font-medium mb-8">
        Your honest feedback helps us grow and improve.
      </p>

      <div className="flex-1 space-y-10">
        {/* Rating Section */}
        <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
          <label className="block text-[15px] font-bold text-slate-800 mb-6 text-center">
            How would you rate your overall experience working in this company?
          </label>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => updateData({ rating: star })}
                  className="relative group"
                >
                  <Star
                    size={42}
                    className={`transition-all duration-300 ${
                      star <= (hoveredStar || data.rating)
                        ? 'fill-amber-400 stroke-amber-400 filter drop-shadow-sm'
                        : 'fill-white stroke-slate-300'
                    }`}
                    strokeWidth={1.5}
                  />
                  {star <= (hoveredStar || data.rating) && (
                    <motion.div
                      layoutId="star-glow"
                      className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full -z-10"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <motion.div 
              key={data.rating}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl mt-2"
            >
              {getSentimentEmoji(hoveredStar || data.rating)}
            </motion.div>
          </div>
        </div>

        {/* Likes */}
        <div className="group">
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="likes"
              className="group flex items-start gap-3 text-slate-800"
            >
              <MessageSquare
                size={18}
                className="mt-1 text-slate-400 group-focus-within:text-indigo transition-colors"
              />

              <div className="flex flex-col">
                <span className="text-[15px] font-semibold leading-snug group-focus-within:text-indigo transition-colors">
                  What do you enjoy most about being part of this company?
                </span>

                <span className="text-sm text-slate-500 leading-snug mt-0.5">
                  Talk about Work culture, collaboration, team support, flexibility, or career growth
                </span>
              </div>
            </label>
           
          </div>
          <div className="relative">
            <textarea
              id="likes"
              rows={4}
              value={data.likes}
              onChange={(e) => updateData({ likes: e.target.value })}
              placeholder="The culture, team support, flexibility…"
              className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/30 text-slate focus:border-indigo focus:bg-white focus:ring-4 focus:ring-indigo/5 transition-all outline-none text-base font-medium placeholder:text-slate-300 shadow-sm pr-16 resize-none"
            />
            <MicButton field="likes" />
          </div>
        </div>

        {/* Dislikes (Progressive Disclosure) */}
        <AnimatePresence>
          {(data.rating > 0 && data.rating <= 3) && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="dislikes" className="flex items-center gap-2 text-[15px] font-bold text-slate-800 group-focus-within:text-red-500 transition-colors">
                  <AlertCircle size={18} className="text-red-400 group-focus-within:text-red-500" />
                  What can we do better? Honest Reviews please...
                </label>
                <span className="text-[12px] font-bold text-slate-400">
                  {data.dislikes.length} chars
                </span>
              </div>
              <div className="relative">
                <textarea
                  id="dislikes"
                  rows={4}
                  value={data.dislikes}
                  onChange={(e) => updateData({ dislikes: e.target.value })}
                  placeholder="Tell us what went wrong so we can fix it…"
                  className="w-full px-6 py-5 rounded-2xl border-2 border-red-50 bg-red-50/10 text-slate focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-400/5 transition-all outline-none text-base font-medium placeholder:text-slate-300 shadow-sm pr-16 resize-none"
                />
                <MicButton field="dislikes" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-12">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack} 
          className="flex-1 py-5 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={isComplete ? { scale: 1.02, y: -2 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isComplete}
          className={`flex-1 py-5 rounded-2xl font-bold text-[17px] transition-all flex items-center justify-center gap-2 shadow-lg ${
            isComplete 
              ? 'bg-gradient-to-r from-indigo to-indigo-light text-white shadow-indigo/25 hover:shadow-indigo/40' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Next Step
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
