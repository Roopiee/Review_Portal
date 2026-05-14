'use client';

interface Props {
  name: string;
  onRestart: () => void;
}

export default function SuccessScene({ name, onRestart }: Props) {
  const first = name.trim().split(/\s+/)[0] || 'there';
  const safe = first.replace(/[<>&"]/g, '');

  return (
    <section className="scene success-scene active">
      <div className="check-stage">
        <div className="check-glow" />
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
        <div className="check-orb">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4 4 10-10" />
          </svg>
        </div>
      </div>

      <span className="success-eyebrow">Submitted &middot; just now</span>
      <h2>
        Thank you, <span className="grad">{safe}</span>.
      </h2>

      <button type="button" className="success-cta" onClick={onRestart}>
        Submit another review
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
      <p className="success-aside">or you may close this window.</p>
    </section>
  );
}
