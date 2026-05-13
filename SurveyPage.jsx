"use client";

/**
 * NetConnectGlobal – Employee Survey
 *
 * Font setup (add to your layout.tsx or globals.css):
 *   import { Playfair_Display, DM_Sans } from "next/font/google";
 *   or add to <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
 *
 * Tailwind config – add these custom values to tailwind.config.js if needed:
 *   theme: { extend: { fontFamily: { playfair: ['"Playfair Display"', 'serif'], dmSans: ['"DM Sans"', 'sans-serif'] } } }
 */

import { useState, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const TOP_CONTRIBUTORS = [
  { initials: "AR", name: "Roopieee",  role: "Frontend Lead",    score: 12, grad: "from-indigo-500 to-violet-500" },
  { initials: "SC", name: "Aruzaa",    role: "Product Manager",  score: 9,  grad: "from-teal-400 to-cyan-400"    },
  { initials: "MS", name: "Yuvi",      role: "UX Designer",      score: 7,  grad: "from-amber-400 to-red-400"    },
  { initials: "JW", name: "murlibro",  role: "Backend Dev",      score: 5,  grad: "from-emerald-400 to-blue-400" },
  { initials: "DP", name: "sunilbro",  role: "Data Scientist",   score: 4,  grad: "from-pink-400 to-violet-500"  },
];

const TOTAL_STEPS = 4;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Stepper dots at the top of every step card */
function Stepper({ current }) {
  return (
    <div className="flex justify-center gap-2.5 mb-9">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <span
          key={i}
          className={`block h-[7px] rounded-full transition-all duration-300 ${
            i + 1 === current
              ? "w-14 bg-indigo-600"
              : "w-9 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

/** Reusable labelled input */
function Field({ label, id, type = "text", placeholder, value, onChange }) {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold tracking-[0.8px] uppercase text-slate-500 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-[18px] py-[14px] border-[1.5px] border-slate-200 rounded-[10px]
                   text-[15px] text-slate-800 bg-slate-50 outline-none font-[DM_Sans,sans-serif]
                   placeholder:text-slate-400
                   focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-100 focus:bg-white
                   transition-all duration-200"
      />
    </div>
  );
}

/** Textarea with optional mic button */
function TextareaField({ label, id, placeholder, value, onChange }) {
  const recognitionRef = useRef(null);
  const [micActive, setMicActive] = useState(false);

  function toggleMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition is not supported in your browser. Try Chrome or Edge.");
      return;
    }
    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      onChange({ target: { value: (value ? value + " " : "") + transcript } });
    };
    rec.onerror = () => setMicActive(false);
    rec.onend = () => { if (micActive) rec.start(); };
    rec.start();
    recognitionRef.current = rec;
    setMicActive(true);
  }

  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold tracking-[0.8px] uppercase text-slate-500 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={4}
          className="w-full pr-[54px] px-[18px] py-[14px] border-[1.5px] border-slate-200 rounded-[10px]
                     text-[15px] text-slate-800 bg-slate-50 outline-none resize-none font-[DM_Sans,sans-serif]
                     placeholder:text-slate-400
                     focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-100 focus:bg-white
                     transition-all duration-200"
        />
        <button
          type="button"
          onClick={toggleMic}
          title="Speak your answer"
          className={`absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center
                      border-none outline-none cursor-pointer transition-all duration-200
                      ${micActive
                        ? "bg-red-500 animate-pulse shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"
                        : "bg-indigo-50 hover:bg-indigo-600 group"
                      }`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-[18px] h-[18px] fill-none stroke-[2] transition-colors ${
              micActive ? "stroke-white" : "stroke-indigo-600 group-hover:stroke-white"
            }`}
          >
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Sidebar – top contributors leaderboard */
function ContributorCard() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(67,56,202,0.08)] border border-slate-200 p-6">
      <h3 className="flex items-center gap-2 font-['Playfair_Display',serif] text-base font-bold text-slate-800 mb-[18px]">
        <span className="text-lg">🏆</span> Top Contributors
      </h3>
      {TOP_CONTRIBUTORS.map((c, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 py-2.5 ${
            i < TOP_CONTRIBUTORS.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <div
            className={`w-9 h-9 rounded-[10px] flex items-center justify-center
                        text-[11px] font-bold text-white tracking-[0.3px] flex-shrink-0
                        bg-gradient-to-br ${c.grad}`}
          >
            {c.initials}
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-slate-800">{c.name}</p>
            <p className="text-[11px] text-slate-400 mt-px">{c.role}</p>
          </div>
          <span className="text-[13px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-[3px] rounded-full">
            {c.score}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Sidebar – community impact progress */
function ImpactCard() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(67,56,202,0.08)] border border-slate-200 p-6">
      <div className="flex items-center gap-2 font-['Playfair_Display',serif] text-[15px] font-bold text-slate-800 mb-3.5">
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#4338ca" strokeWidth="2" className="flex-shrink-0"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Community Impact
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500
                     relative overflow-hidden after:absolute after:inset-0
                     after:bg-gradient-to-r after:from-transparent after:via-transparent after:to-white/30"
        />
      </div>
      <p className="text-[11px] font-semibold tracking-[0.8px] uppercase text-indigo-600">
        75% Target Reached
      </p>
    </div>
  );
}

// ─── Step Pages ───────────────────────────────────────────────────────────────

function Step1({ data, onChange, onNext }) {
  return (
    <>
      <Stepper current={1} />
      <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-indigo-400 mb-2">
        Step 1 of 4
      </p>
      <h2 className="font-['Playfair_Display',serif] text-[26px] font-bold text-slate-800 mb-1.5 tracking-[-0.3px]">
        Fill your Name and your Role
      </h2>
      <p className="text-[13.5px] text-slate-500 mb-8">Tell us a bit about yourself.</p>

      <Field
        label="Full Name" id="fullName" placeholder="Roopiee test eyyy"
        value={data.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
      />
      <Field
        label="Team Lead" id="teamLead" placeholder="Aruzaaawasthi"
        value={data.teamLead}
        onChange={(e) => onChange("teamLead", e.target.value)}
      />
      <Field
        label="Your Role" id="role" placeholder="Software Engineer"
        value={data.role}
        onChange={(e) => onChange("role", e.target.value)}
      />

      <button
        onClick={onNext}
        className="w-full py-[15px] px-6 rounded-xl text-[15px] font-semibold text-white
                   bg-gradient-to-br from-indigo-700 to-indigo-500
                   shadow-[0_4px_16px_rgba(99,102,241,0.35)]
                   hover:shadow-[0_6px_24px_rgba(99,102,241,0.45)] hover:-translate-y-px
                   transition-all duration-200 border-none cursor-pointer mt-1.5"
      >
        Continue →
      </button>
    </>
  );
}

function Step2({ data, onChange, onNext, onBack }) {
  return (
    <>
      <Stepper current={2} />
      <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-indigo-400 mb-2">
        Step 2 of 4
      </p>
      <h2 className="font-['Playfair_Display',serif] text-[26px] font-bold text-slate-800 mb-1.5 tracking-[-0.3px]">
        Fill the Review box
      </h2>
      <p className="text-[13.5px] text-slate-500 mb-8">Be honest, we value your input.</p>

      <TextareaField
        label="What do you like about the company?" id="likes"
        placeholder="Great culture, supportive team…"
        value={data.likes}
        onChange={(e) => onChange("likes", e.target.value)}
      />
      <TextareaField
        label="What could be improved?" id="improve"
        placeholder="More remote flexibility, better tools…"
        value={data.improve}
        onChange={(e) => onChange("improve", e.target.value)}
      />

      {/* Anonymous toggle */}
      <label className="flex items-center gap-2.5 my-2 mb-8 text-[13.5px] text-slate-500 cursor-pointer select-none">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={data.anonymous}
          onChange={(e) => onChange("anonymous", e.target.checked)}
        />
        <span
          className="relative w-10 h-[22px] rounded-full bg-slate-200 flex-shrink-0
                     peer-checked:bg-indigo-600 transition-colors duration-200
                     after:content-[''] after:absolute after:w-4 after:h-4 after:rounded-full
                     after:bg-white after:top-[3px] after:left-[3px]
                     after:shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                     after:transition-transform after:duration-200
                     peer-checked:after:translate-x-[18px]"
        />
        Can we reuse this anonymously externally?
      </label>

      <div className="flex gap-3.5 mt-1.5">
        <button
          onClick={onBack}
          className="flex-1 py-[15px] px-6 rounded-xl text-[15px] font-semibold text-slate-500
                     bg-slate-100 border-[1.5px] border-slate-200
                     hover:bg-slate-200 transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-[15px] px-6 rounded-xl text-[15px] font-semibold text-white
                     bg-gradient-to-br from-indigo-700 to-indigo-500
                     shadow-[0_4px_16px_rgba(99,102,241,0.35)]
                     hover:shadow-[0_6px_24px_rgba(99,102,241,0.45)] hover:-translate-y-px
                     transition-all duration-200 border-none cursor-pointer"
        >
          Continue →
        </button>
      </div>
    </>
  );
}

function Step3({ data, onChange, onNext, onBack }) {
  return (
    <>
      <Stepper current={3} />
      <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-indigo-400 mb-2">
        Step 3 of 4
      </p>
      <h2 className="font-['Playfair_Display',serif] text-[26px] font-bold text-slate-800 mb-1.5 tracking-[-0.3px]">
        Rate Your Experience
      </h2>
      <p className="text-[13.5px] text-slate-500 mb-8">How satisfied are you overall?</p>

      <div className="mb-8">
        <p className="text-[12px] font-semibold tracking-[0.8px] uppercase text-slate-500 mb-4">
          Overall Satisfaction
        </p>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange("rating", n)}
              className={`flex-1 py-4 rounded-xl text-xl font-bold border-[1.5px] transition-all duration-200
                         ${data.rating === n
                           ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                           : "border-slate-200 bg-slate-50 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50"
                         }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-slate-400">Very Dissatisfied</span>
          <span className="text-[11px] text-slate-400">Very Satisfied</span>
        </div>
      </div>

      <div className="flex gap-3.5 mt-1.5">
        <button
          onClick={onBack}
          className="flex-1 py-[15px] px-6 rounded-xl text-[15px] font-semibold text-slate-500
                     bg-slate-100 border-[1.5px] border-slate-200
                     hover:bg-slate-200 transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-[15px] px-6 rounded-xl text-[15px] font-semibold text-white
                     bg-gradient-to-br from-indigo-700 to-indigo-500
                     shadow-[0_4px_16px_rgba(99,102,241,0.35)]
                     hover:shadow-[0_6px_24px_rgba(99,102,241,0.45)] hover:-translate-y-px
                     transition-all duration-200 border-none cursor-pointer"
        >
          Continue →
        </button>
      </div>
    </>
  );
}

function Step4({ data, onBack, onSubmit }) {
  return (
    <>
      <Stepper current={4} />
      <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-indigo-400 mb-2">
        Step 4 of 4
      </p>
      <h2 className="font-['Playfair_Display',serif] text-[26px] font-bold text-slate-800 mb-1.5 tracking-[-0.3px]">
        Review &amp; Submit
      </h2>
      <p className="text-[13.5px] text-slate-500 mb-8">Confirm your details before submitting.</p>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-6 space-y-3">
        {[
          ["Full Name",  data.fullName  || "—"],
          ["Team Lead",  data.teamLead  || "—"],
          ["Role",       data.role      || "—"],
          ["Rating",     data.rating ? `${data.rating} / 5` : "—"],
          ["Anonymous",  data.anonymous ? "Yes" : "No"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-[13.5px]">
            <span className="text-slate-500 font-medium">{k}</span>
            <span className="text-slate-800 font-semibold">{v}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3.5 mt-1.5">
        <button
          onClick={onBack}
          className="flex-1 py-[15px] px-6 rounded-xl text-[15px] font-semibold text-slate-500
                     bg-slate-100 border-[1.5px] border-slate-200
                     hover:bg-slate-200 transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 py-[15px] px-6 rounded-xl text-[15px] font-semibold text-white
                     bg-gradient-to-br from-indigo-700 to-indigo-500
                     shadow-[0_4px_16px_rgba(99,102,241,0.35)]
                     hover:shadow-[0_6px_24px_rgba(99,102,241,0.45)] hover:-translate-y-px
                     transition-all duration-200 border-none cursor-pointer"
        >
          Submit 🎉
        </button>
      </div>
    </>
  );
}

function SuccessScreen() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="font-['Playfair_Display',serif] text-[28px] font-bold text-slate-800 mb-3">
        Thank you!
      </h2>
      <p className="text-[15px] text-slate-500">
        Your response has been recorded. You're in the running for exciting prizes!
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName:  "",
    teamLead:  "",
    role:      "",
    likes:     "",
    improve:   "",
    anonymous: false,
    rating:    null,
  });

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function renderStep() {
    if (submitted) return <SuccessScreen />;
    switch (step) {
      case 1: return <Step1 data={formData} onChange={handleChange} onNext={() => setStep(2)} />;
      case 2: return <Step2 data={formData} onChange={handleChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3: return <Step3 data={formData} onChange={handleChange} onNext={() => setStep(4)} onBack={() => setStep(2)} />;
      case 4: return <Step4 data={formData} onBack={() => setStep(3)} onSubmit={() => setSubmitted(true)} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-[DM_Sans,sans-serif] text-slate-800">

      {/* ── Google Fonts (remove if using next/font in layout) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-12 py-[22px] bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3.5">
          {/* Logo mark */}
          <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-700 to-indigo-500">
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8" />
              <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="white" strokeWidth="1.8" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.8" />
              <line x1="4" y1="7"  x2="20" y2="7"  stroke="white" strokeWidth="1.3" strokeOpacity="0.6" />
              <line x1="4" y1="17" x2="20" y2="17" stroke="white" strokeWidth="1.3" strokeOpacity="0.6" />
            </svg>
          </div>
          {/* Logo text */}
          <div className="flex flex-col leading-[1.15]">
            <span className="font-['Playfair_Display',serif] text-[17px] font-bold text-slate-800 tracking-[-0.3px]">
              NetConnectGlobal
            </span>
            <span className="text-[11px] font-normal text-slate-400 tracking-[0.5px] uppercase">
              Connecting People &amp; Ideas
            </span>
          </div>
        </div>
        {/* Submission count */}
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-medium tracking-[1px] uppercase text-slate-400">Submissions</span>
          <span className="font-['Playfair_Display',serif] text-xl font-bold text-indigo-600">128</span>
          <span className="text-[11px] text-slate-400">employees</span>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <div className="max-w-[1100px] mx-auto px-12 pt-9">
        <h1 className="font-['Playfair_Display',serif] text-[30px] font-bold text-slate-800 tracking-[-0.5px] mb-1">
          Fill the form to win exciting prizes!! 🎁
        </h1>
        <p className="text-sm text-slate-500">Shape the future of our company</p>
      </div>

      {/* ─── Main Grid ─── */}
      <div className="max-w-[1100px] mx-auto px-12 mt-7 mb-10 grid grid-cols-[1fr_300px] gap-7 items-start">

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(67,56,202,0.08)] border border-slate-200 px-12 py-11">
          {renderStep()}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          <ContributorCard />
          <ImpactCard />
        </aside>
      </div>

      {/* ─── Footer ─── */}
      <footer className="text-center pb-5 text-[11.5px] text-slate-400 tracking-[0.3px]">
        Internal Secure Portal &bull; Confidential &bull; Version 2.4.0
      </footer>
    </div>
  );
}
