'use client';

import { useCallback, useState } from 'react';
import EmojiOption from '../primitives/EmojiOption';
import Chip from '../primitives/Chip';
import { EMOTIONS, REVIEW_KEYWORDS, PulseFormData, EmotionValue } from '../options';
import { useSpeechRecognition } from '@/lib/useSpeechRecognition';

interface Props {
  data: PulseFormData;
  update: (patch: Partial<PulseFormData>) => void;
}

export default function FeedbackScene({ data, update }: Props) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const onTranscript = useCallback(
    (full: string) => {
      update({ reflection: full });
    },
    [update],
  );

  const speech = useSpeechRecognition({ onTranscript });

  const toggleKeyword = (label: string) => {
    setSelectedKeywords(prev =>
      prev.includes(label) ? prev.filter(k => k !== label) : [...prev, label],
    );
  };

  const generate = async () => {
    if (selectedKeywords.length === 0 || isGenerating) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ keywords: selectedKeywords }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error ?? `Generation failed (${res.status})`);
      }
      if (typeof payload?.text === 'string') {
        update({ reflection: payload.text });
      }
    } catch (err: any) {
      setGenerateError(err?.message ?? 'Could not generate a review. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMic = () => {
    if (speech.isRecording) speech.stop();
    else speech.start(data.reflection);
  };

  const recordingClass = speech.isRecording ? ' is-recording' : '';
  const hintText = speech.errorMessage
    ? speech.errorMessage
    : speech.isRecording
      ? 'Listening… tap the mic again to stop.'
      : 'Optional · type, tap the mic, or pick keywords below to draft with AI.';

  return (
    <section className="scene active">
      <span className="eyebrow">
        <span className="num">02</span>
        <span className="bar" /> Feedback
      </span>
      <h1 className="display">
        How are things, <span className="grad">really</span>?
      </h1>
      <p className="lede">An honest snapshot of your last three months. Pick what feels closest.</p>

      <div className="emo-row">
        {EMOTIONS.map(em => (
          <EmojiOption
            key={em.value}
            emoji={em.emoji}
            label={em.label}
            selected={data.emotion === em.value}
            onClick={() => update({ emotion: em.value as EmotionValue })}
          />
        ))}
      </div>

      <div className="question" style={{ marginTop: 32 }}>
        Pick a few words that capture your experience.
        <span className="small">We&rsquo;ll draft a review for you with AI.</span>
      </div>
      <div className="chips">
        {REVIEW_KEYWORDS.map(label => (
          <Chip
            key={label}
            label={label}
            selected={selectedKeywords.includes(label)}
            onClick={() => toggleKeyword(label)}
          />
        ))}
      </div>

      <div className="generate-row">
        <button
          type="button"
          className="generate-btn"
          onClick={generate}
          disabled={selectedKeywords.length === 0 || isGenerating}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
          </svg>
          {isGenerating ? 'Drafting…' : 'Generate review'}
        </button>
        {selectedKeywords.length > 0 && (
          <span className="generate-meta">{selectedKeywords.length} selected</span>
        )}
        {generateError && <span className="generate-error">{generateError}</span>}
      </div>

      <div className="reflection" style={{ marginTop: 24 }}>
        <div className="reflection-label">Positive review</div>
        <div className={`reflection-box${recordingClass}`}>
          <textarea
            className="reflection-area"
            value={data.reflection}
            placeholder="In your own words — what would you tell your team lead?"
            onChange={e => update({ reflection: e.target.value })}
          />
          <button
            type="button"
            className={`mic-btn${speech.isRecording ? ' recording' : ''}`}
            onClick={toggleMic}
            disabled={!speech.isSupported}
            title={
              speech.isSupported ? 'Dictate your review' : 'Voice dictation is not supported in this browser'
            }
            aria-label="Dictate your review"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="3" width="6" height="12" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          </button>
        </div>
        <div className={`reflection-hint${recordingClass}`}>
          <span className="dot" /> <span>{hintText}</span>
        </div>
      </div>

      {(data.emotion === 'drained' || data.emotion === 'neutral') && (
        <div className="reflection" style={{ marginTop: 24 }}>
          <div className="reflection-label">What can be improved? Honest reviews please.</div>
          <div className="reflection-box">
            <textarea
              className="reflection-area"
              value={data.improvements}
              placeholder="Be candid — what's not working, where could things get better?"
              onChange={e => update({ improvements: e.target.value })}
            />
          </div>
        </div>
      )}
    </section>
  );
}
