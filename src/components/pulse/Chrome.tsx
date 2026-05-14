'use client';

const STEP_NAMES = ['Profile', 'Feedback', 'Share Review', 'Submitted'];

interface Props {
  currentStep: number;
  totalSteps: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSaveDraft: () => void;
  isDraftSaved: boolean;
}

export default function Chrome({
  currentStep,
  totalSteps,
  theme,
  onToggleTheme,
  onSaveDraft,
  isDraftSaved,
}: Props) {
  return (
    <header className="chrome">
      <div className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logodark_2.png" alt="NetConnect Global" className="brand-logo" />
      </div>

      <div className="progress">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const segNum = i + 1;
          let cls = 'seg';
          if (segNum < currentStep) cls += ' done';
          else if (segNum === currentStep) cls += ' active';
          return (
            <div key={i} className={cls}>
              <div className="fill" />
            </div>
          );
        })}
        <span className="label">{STEP_NAMES[currentStep - 1]}</span>
      </div>

      <div className="chrome-right">
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>
        <button type="button" className="ghost" onClick={onSaveDraft}>
          {isDraftSaved ? 'Draft saved' : 'Save draft'}
        </button>
      </div>
    </header>
  );
}
