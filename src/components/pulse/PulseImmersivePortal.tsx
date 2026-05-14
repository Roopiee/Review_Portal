'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Atmosphere from './Atmosphere';
import Chrome from './Chrome';
import StageActions from './StageActions';
import ConfettiLayer, { ConfettiHandle } from './ConfettiLayer';
import ProfileScene from './scenes/ProfileScene';
import FeedbackScene from './scenes/FeedbackScene';
import ShareReviewScene from './scenes/ShareReviewScene';
import SuccessScene from './scenes/SuccessScene';
import { INITIAL_FORM_DATA, PulseFormData } from './options';
import { useDraft } from '@/lib/useDraft';

const TOTAL_STEPS = 4;

export default function PulseImmersivePortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PulseFormData>(INITIAL_FORM_DATA);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);

  const confettiRef = useRef<ConfettiHandle | null>(null);
  const { hydrated, loadedDraft, save: saveDraft, clear: clearDraft } = useDraft<PulseFormData>();

  // Restore draft on first paint.
  useEffect(() => {
    if (hydrated && loadedDraft) {
      setFormData({ ...INITIAL_FORM_DATA, ...loadedDraft });
    }
  }, [hydrated, loadedDraft]);

  // Sync the data-theme attribute on body (matches the HTML's CSS-variable system).
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  // Fire confetti when arriving on the success scene.
  useEffect(() => {
    if (currentStep === TOTAL_STEPS) {
      confettiRef.current?.fire();
    }
  }, [currentStep]);

  const update = useCallback((patch: Partial<PulseFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  }, []);

  const canContinue = (() => {
    if (currentStep === 1) {
      return (
        formData.name.trim().length > 0 &&
        formData.role.trim().length > 0 &&
        formData.department !== '' &&
        formData.tenure !== ''
      );
    }
    return true;
  })();

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          department: formData.department,
          tenure: formData.tenure,
          emotion: formData.emotion,
          energizers: formData.energizers,
          reflection: formData.reflection,
          improvements: formData.improvements,
          platformsVisited: formData.platformsVisited,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error ?? `Submit failed (${res.status})`);
      }
      clearDraft();
      setCurrentStep(TOTAL_STEPS);
    } catch (err: any) {
      setSubmitError(err?.message ?? 'Something went wrong while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, clearDraft]);

  const onNext = useCallback(() => {
    if (currentStep === 3) {
      void submit();
      return;
    }
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  }, [currentStep, submit]);

  const onBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const onSkip = useCallback(() => {
    void submit();
  }, [submit]);

  const onRestart = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    clearDraft();
    setCurrentStep(1);
  }, [clearDraft]);

  const onToggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const onSaveDraft = useCallback(() => {
    saveDraft(formData);
    setDraftSavedAt(Date.now());
    window.setTimeout(() => setDraftSavedAt(null), 2000);
  }, [formData, saveDraft]);

  return (
    <>
      <Atmosphere />
      <Chrome
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSaveDraft={onSaveDraft}
        isDraftSaved={draftSavedAt !== null}
      />

      <main className="stage">
        {currentStep === 1 && <ProfileScene data={formData} update={update} />}
        {currentStep === 2 && <FeedbackScene data={formData} update={update} />}
        {currentStep === 3 && <ShareReviewScene data={formData} update={update} />}
        {currentStep === 4 && <SuccessScene name={formData.name} onRestart={onRestart} />}

        <StageActions
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          isSubmitting={isSubmitting}
          canContinue={canContinue}
          onBack={onBack}
          onNext={onNext}
          onSkip={onSkip}
        />
      </main>

      <ConfettiLayer ref={confettiRef} />

      {submitError && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 11,
            padding: '10px 16px',
            borderRadius: 12,
            background: '#ff5470',
            color: '#fff',
            fontSize: 13,
            boxShadow: '0 12px 30px rgba(255, 84, 112, 0.35)',
          }}
        >
          {submitError}
        </div>
      )}
    </>
  );
}
