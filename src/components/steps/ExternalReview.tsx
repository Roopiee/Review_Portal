import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Copy, CheckCircle2, Share2, Sparkles } from 'lucide-react';

interface ExternalReviewProps {
  formData?: {
    likes: string;
    dislikes: string;
  };
  onPlatformVisited?: (platform: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ExternalReview({ formData, onPlatformVisited, onNext, onBack }: ExternalReviewProps) {
  const [clickedTiles, setClickedTiles] = useState<{ [key: string]: boolean }>({});
  const [copied, setCopied] = useState(false);

  const platforms = [
    {
      name: 'AmbitionBox',
      url: 'https://www.ambitionbox.com/contribute/company-review-v3?campaign=company_info_header&company_name=NetConnectGlobal',
      color: '#FF6F00',
      bg: 'bg-orange-50/50',
      border: 'border-orange-100',
      completedBg: 'bg-emerald-50',
      completedBorder: 'border-emerald-200',
    },
    {
      name: 'Google',
      url: 'https://www.google.com/search?q=NetConnectGlobal+Bangalore',
      color: '#4285F4',
      bg: 'bg-blue-50/50',
      border: 'border-blue-100',
      completedBg: 'bg-emerald-50',
      completedBorder: 'border-emerald-200',
    },
    {
      name: 'Glassdoor',
      url: 'https://www.glassdoor.co.in/surveys/employer/create?i=648576&j=true&y=&c=PAGE_INFOSITE_TOP&rt=https://www.glassdoor.co.in/Reviews/NetConnectGlobal-Reviews-E648576.htm',
      color: '#09f211ff',
      bg: 'bg-red-50/50',
      border: 'border-red-100',
      completedBg: 'bg-emerald-50',
      completedBorder: 'border-emerald-200',
    },
  ];

  const feedbackText = formData?.likes || 'No feedback provided.';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(feedbackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Step header */}
      <div className="flex items-center gap-2 text-indigo font-bold text-[13px] uppercase tracking-wider mb-4">
        <span className="w-8 h-[2px] bg-indigo/20" />
        Step 3 of 4
      </div>
      
      <h2 className="font-serif text-3xl lg:text-[38px] font-bold text-slate mb-3 tracking-tight leading-tight">
        Amplify Your Voice
      </h2>
   <p className="mb-8 text-[18px] font-semibold text-indigo-600 animate-attention tracking-wide">
  Copy your review and share it on other platforms to earn more points!
</p>

      <div className="flex-1 flex flex-col gap-8">
        {/* Feedback preview */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-indigo/10 shadow-sm overflow-hidden bg-white group"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-indigo/5 border-b border-indigo/10">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo" />
              <span className="text-[14px] font-bold text-indigo uppercase tracking-wider">Your Review Snippet</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className={`flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-xl transition-all ${
                copied
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'bg-indigo text-white shadow-lg shadow-indigo-200 hover:bg-indigo-light'
              }`}
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Review'}
            </motion.button>
          </div>
          <div className="px-8 py-6 text-[16px] font-medium text-slate-700 leading-relaxed italic relative">
            <span className="absolute top-4 left-4 text-4xl text-slate-100 font-serif leading-none">“</span>
            <div className="relative z-10 whitespace-pre-wrap max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
              {feedbackText}
            </div>
            <span className="absolute bottom-4 right-4 text-4xl text-slate-100 font-serif leading-none rotate-180">“</span>
          </div>
        </motion.div>

        {/* Platform tiles */}
        <div className="grid gap-3">
          {platforms.map((platform, index) => {
            const isClicked = clickedTiles[platform.name];
              
            return (
              <motion.a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setClickedTiles(prev => ({ ...prev, [platform.name]: true }));
                  onPlatformVisited?.(platform.name.toLowerCase());
                }}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                  isClicked
                    ? `${platform.completedBg} ${platform.completedBorder}`
                    : `${platform.bg} ${platform.border} hover:shadow-md`
                }`}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                    style={{ background: platform.color }}
                  >
                    {platform.name[0]}
                  </div>
                  <div>
                    <p className={`text-[17px] font-bold ${isClicked ? 'text-emerald-800' : 'text-slate-800'}`}>
                      {platform.name}
                    </p>
                    <p className={`text-[13px] font-medium flex items-center gap-1.5 mt-0.5 ${isClicked ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {isClicked ? (
                        <>
                          <CheckCircle2 size={14} strokeWidth={3} />
                          Review shared successfully! +50 pts
                        </>
                      ) : (
                        'Click to open & paste your review'
                      )}
                    </p>
                  </div>
                </div>
                <div className={`p-2 rounded-lg transition-colors ${isClicked ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300 group-hover:text-indigo group-hover:bg-indigo/5'}`}>
                  {isClicked ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Share2 size={20} strokeWidth={2.5} />}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack} 
          className="flex-1 py-5 rounded-2xl font-bold text-slate-500 bg-blue-100 hover:bg-slate-200 transition-all"
        >
          Back
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-1 py-5 rounded-2xl font-bold text-[17px] bg-indigo text-white shadow-lg shadow-indigo/25 hover:bg-indigo-light hover:shadow-indigo/40 transition-all flex items-center justify-center gap-2"
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


