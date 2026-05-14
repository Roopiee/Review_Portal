'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  placeholder: string;
  options: readonly Option[];
  onChange: (next: string) => void;
  ariaLabel?: string;
}

interface PopupRect {
  top: number;
  left: number;
  minWidth: number;
}

export default function InlineSelect({ value, placeholder, options, onChange, ariaLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState<PopupRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const wrapperRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const isPlaceholder = value === '';
  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  // Portal target only exists in the browser.
  useEffect(() => setMounted(true), []);

  // Anchor the popup to the trigger's viewport rect.
  const reposition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPopup({
      top: r.bottom + 8,
      left: r.left,
      minWidth: Math.max(240, r.width),
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    reposition();
    const onScroll = () => reposition();
    const onResize = () => reposition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen]);

  // Outside click + Escape — must consider the portaled menu, not just the wrapper.
  useEffect(() => {
    if (!isOpen) return;
    const onDocMouse = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapperRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const choose = (e: React.MouseEvent, v: string) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(v);
    setIsOpen(false);
  };

  return (
    <span className="inline-select-wrap" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`inline-select${isPlaceholder ? ' is-placeholder' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel ?? placeholder}
      >
        {displayLabel}
      </button>
      {isOpen && mounted && popup &&
        createPortal(
          <ul
            ref={menuRef}
            className="inline-select-menu"
            role="listbox"
            aria-label={ariaLabel ?? placeholder}
            style={{
              position: 'fixed',
              top: popup.top,
              left: popup.left,
              minWidth: popup.minWidth,
              zIndex: 9999,
            }}
          >
            {options.map(opt => (
              <li
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                className={`inline-select-item${value === opt.value ? ' is-selected' : ''}`}
                onMouseDown={e => choose(e, opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </span>
  );
}
