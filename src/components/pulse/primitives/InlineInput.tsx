'use client';

import { ChangeEvent } from 'react';

interface Props {
  value: string;
  placeholder: string;
  onChange: (next: string) => void;
  ariaLabel?: string;
}

export default function InlineInput({ value, placeholder, onChange, ariaLabel }: Props) {
  const len = value.length > 0 ? value.length : placeholder.length;
  const size = Math.max(12, len + 3);
  return (
    <input
      className="inline-input"
      value={value}
      placeholder={placeholder}
      size={size}
      aria-label={ariaLabel ?? placeholder}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
}
