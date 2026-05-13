import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Users } from 'lucide-react';

interface BasicInfoProps {
  data: {
    name: string;
    teamLead: string;
    role: string;
  };
  updateData: (fields: Partial<{ name: string; teamLead: string; role: string }>) => void;
  onNext: () => void;
}

export default function BasicInfo({ data, updateData, onNext }: BasicInfoProps) {
  const isComplete = data.name && data.teamLead && data.role;
          
  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Step header */}
      <div className="flex items-center gap-2 text-indigo font-bold text-[13px] uppercase tracking-wider mb-4">
        <span className="w-8 h-[2px] bg-indigo/20" />
        Step 1 of 4
      </div>
      
      <h2 className="font-serif text-3xl lg:text-[38px] font-bold text-slate mb-3 tracking-tight leading-tight">
        Personal Profile
      </h2>
      <p className="text-[17px] text-slate-mid font-medium mb-10">
        Tell us a bit about yourself to get started.
      </p>

      <div className="flex-1 space-y-8">
        {/* Full Name */}
        <div className="group">
          <label htmlFor="name" className="flex items-center gap-2 text-[15px] font-bold text-slate-800 mb-3 group-focus-within:text-indigo transition-colors">
            <User size={18} className="text-slate-400 group-focus-within:text-indigo" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            autoFocus
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="e.g. Roopiee eyy test"
            className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 bg-blue-50/30 text-blue focus:border-indigo focus:bg-white focus:ring-4 focus:ring-indigo/5 transition-all outline-none text-base font-medium placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {/* Team Lead */}
        <div className="group">
          <label htmlFor="teamLead" className="flex items-center gap-2 text-[15px] font-bold text-slate-800 mb-3 group-focus-within:text-indigo transition-colors">
            <Users size={18} className="text-slate-400 group-focus-within:text-indigo" />
            Reporting Manager / Team Lead
          </label>
          <input
            type="text"
            id="teamLead"
            value={data.teamLead}
            onChange={(e) => updateData({ teamLead: e.target.value })}
            placeholder="e.g. aruzaaawasthii"
            className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 bg-slate-50/30 text-slate focus:border-indigo focus:bg-white focus:ring-4 focus:ring-indigo/5 transition-all outline-none text-base font-medium placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {/* Role */}
        <div className="group">
          <label htmlFor="role" className="flex items-center gap-2 text-[15px] font-bold text-slate-800 mb-3 group-focus-within:text-indigo transition-colors">
            <Briefcase size={18} className="text-slate-400 group-focus-within:text-indigo" />
            Your Role
          </label>
          <input
            type="text"
            id="role"
            value={data.role}
            onChange={(e) => updateData({ role: e.target.value })}
            placeholder="e.g. Software Engineer"
            className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 bg-blue-50/30 text-blue focus:border-indigo focus:bg-white focus:ring-4 focus:ring-indigo/5 transition-all outline-none text-base font-medium placeholder:text-slate-300 shadow-sm"
          />
        </div>
      </div>

      <div className="mt-10">
        <motion.button
          whileHover={isComplete ? { scale: 1.01, y: -2 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isComplete}
          className={`w-full py-5 rounded-2xl font-bold text-[17px] transition-all flex items-center justify-center gap-2 shadow-lg ${
            isComplete 
              ? 'bg-gradient-to-r from-indigo to-indigo-light text-white shadow-indigo/25 hover:shadow-indigo/40' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Continue to Feedback
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
