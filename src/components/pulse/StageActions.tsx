'use client';

interface Props {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export default function StageActions({
  currentStep,
  totalSteps,
  isSubmitting,
  canContinue,
  onBack,
  onNext,
  onSkip,
}: Props) {
  if (currentStep >= totalSteps) return null;

  const showBack = currentStep > 1;
  const showSkip = currentStep === 3;
  const isFinal = currentStep === 3;
  const label = isSubmitting ? 'Submitting…' : isFinal ? 'Finish Review' : 'Continue';

  return (
    <div className="stage-actions">
      <div className="bar">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          style={{ visibility: showBack ? 'visible' : 'hidden' }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <div className="bar-divider" />
        {showSkip && (
          <button type="button" className="skip-btn" onClick={onSkip}>
            Skip
          </button>
        )}
        <button
          type="button"
          className="primary-btn"
          onClick={onNext}
          disabled={isSubmitting || !canContinue}
          style={{ opacity: canContinue && !isSubmitting ? 1 : 0.55 }}
        >
          <span>{label}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
