import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Identity', 'Feedback', 'Reviews', 'Evidence'];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-between mb-10">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={index}>
            {/* Step node */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'border-[#C9A84C] text-white'
                    : isActive
                    ? 'border-[#C9A84C] bg-white text-[#C9A84C] shadow-lg'
                    : 'border-slate-200 bg-white text-slate-300'
                }`}
                style={isCompleted ? { background: 'linear-gradient(135deg, #C9A84C 0%, #A67C2E 100%)', boxShadow: '0 2px 12px rgba(201,168,76,0.35)' } : isActive ? { boxShadow: '0 2px 12px rgba(201,168,76,0.25)' } : {}}
              >
                {isCompleted ? <Check size={16} strokeWidth={2.5} className="text-white" /> : stepNum}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap transition-colors duration-300 ${
                  isActive ? 'text-[#C9A84C]' : isCompleted ? 'text-slate-400' : 'text-slate-300'
                }`}
              >
                {stepLabels[index]}
              </span>
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div className="flex-1 h-[1.5px] mx-3 mt-[1.1rem] transition-colors duration-500"
                style={{ background: isCompleted ? 'linear-gradient(90deg, #C9A84C, #C9A84C80)' : '#E2E8F0' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
