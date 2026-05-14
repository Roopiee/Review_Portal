'use client';

import { useState } from 'react';
import { PLATFORMS, PulseFormData, PlatformValue } from '../options';

interface Props {
  data: PulseFormData;
  update: (patch: Partial<PulseFormData>) => void;
}

const FALLBACK_QUOTE =
  'The cross-team design review ritual has been the highlight of my quarter. The team makes ambitious feel achievable — I’d love to see more of those moments.';

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AY';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || 'AY';
}

function tenureLabel(value: string): string {
  switch (value) {
    case 'lt_6m':
      return 'under 6 months';
    case 'm6_12':
      return '6–12 months';
    case 'y1_3':
      return '1–3 years';
    case 'y3_5':
      return '3–5 years';
    case 'y5_plus':
      return '5+ years';
    default:
      return '';
  }
}

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function ShareReviewScene({ data, update }: Props) {
  const [copied, setCopied] = useState(false);

  const quote = data.reflection.trim() || FALLBACK_QUOTE;
  const displayName = data.name.trim() || 'Ashlin Yousef';
  const roleLine = [data.role.trim() || 'Product Engineer', tenureLabel(data.tenure)]
    .filter(Boolean)
    .join(' · ');

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(quote);
    } catch {
      /* clipboard blocked */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const onPlatformClick = (platform: PlatformValue) => {
    if (data.platformsVisited.includes(platform)) return;
    update({ platformsVisited: [...data.platformsVisited, platform] });
  };

  return (
    <section className="scene share-scene active">
      <span className="eyebrow" style={{ display: 'inline-flex' }}>
        <span className="num">03</span>
        <span className="bar" /> Amplify
      </span>
      <h1 className="display">
        Amplify <span className="grad">Your Voice</span>.
      </h1>
      <p className="lede">
        Share your feedback across platforms and help others discover the workplace culture.
      </p>

      <div className="review-float">
        <div className="rf-head">
          <div className="rf-av">{initialsFor(displayName)}</div>
          <div className="rf-who">
            <div className="rf-name">{displayName}</div>
            <div className="rf-role">{roleLine}</div>
          </div>
          <button type="button" className={`rf-copy${copied ? ' copied' : ''}`} onClick={onCopy}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="rf-quote">{quote}</div>
      </div>

      <div className="launcher">
        {PLATFORMS.map(p => (
          <a
            key={p.value}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="tile"
            onClick={() => onPlatformClick(p.value as PlatformValue)}
          >
            <div className={`tile-logo ${p.logoClass}`}>
              {p.logo === 'GOOGLE_SVG' ? <GoogleLogo /> : p.logo}
            </div>
            <span className="tile-name">{p.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
