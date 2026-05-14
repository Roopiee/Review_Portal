'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';

const COLORS = [
  '#4f5bff',
  '#7a6bff',
  '#a78bff',
  '#8ad0ff',
  '#c3a8ff',
  '#ffce5e',
  '#ff8fb3',
  '#5ee0b4',
];

export interface ConfettiHandle {
  fire: () => void;
}

const ConfettiLayer = forwardRef<ConfettiHandle, {}>(function ConfettiLayer(_, ref) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    fire() {
      const layer = layerRef.current;
      if (!layer) return;
      layer.innerHTML = '';
      const count = 90;
      for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const left = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 280;
        const rot = Math.random() * 1200 - 600;
        const dur = 2.4 + Math.random() * 2.2;
        const delay = Math.random() * 0.6;
        const w = 6 + Math.random() * 6;
        const h = 8 + Math.random() * 8;
        piece.style.left = `${left}%`;
        piece.style.width = `${w}px`;
        piece.style.height = `${h}px`;
        piece.style.background = COLORS[i % COLORS.length];
        piece.style.animationDuration = `${dur}s`;
        piece.style.animationDelay = `${delay}s`;
        piece.style.setProperty('--dx', `${dx}px`);
        piece.style.setProperty('--rot', `${rot}deg`);
        if (Math.random() > 0.6) piece.style.borderRadius = '50%';
        layer.appendChild(piece);
      }
      window.setTimeout(() => {
        if (layerRef.current === layer) layer.innerHTML = '';
      }, 6000);
    },
  }));

  return <div className="confetti-layer" ref={layerRef} />;
});

export default ConfettiLayer;
