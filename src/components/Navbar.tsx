'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface NavbarProps {
  /** Current multi-step form step (1-5). Used to offset for the progress bar. */
  step: number;
  totalSubmissions?: number;
}

export default function Navbar({ step, totalSubmissions = 500 }: NavbarProps) {
  return (
    <header
      className="
        flex items-center justify-between
        px-8 lg:px-12 py-4
        bg-gradient-to-r from-white via-indigo-pale to-white
        border-b border-border
        sticky z-10 shadow-sm
      "
      style={{ top: step < 5 ? '6px' : '0' }}   /* sit just below the 6px progress bar */
    >
      {/* ── LEFT: Logo ── */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center select-none"
      >
        <Image
          src="/logodark_2.png"
          alt="NetConnectGlobal Logo"
          width={180}
          height={52}
          className="object-contain h-11 w-auto"
          priority
        />
      </motion.div>

      {/* ── RIGHT: Live submissions counter ── */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[10px] font-medium tracking-[1px] uppercase text-slate-light">
          Submissions
        </span>
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-indigo leading-none">
            {totalSubmissions}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="text-[11px] text-slate-light">employees live</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80 pointer-events-none" />
    </header>
  );
}
