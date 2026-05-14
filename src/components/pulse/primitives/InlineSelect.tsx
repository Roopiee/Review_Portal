'use client';

import { ChangeEvent } from 'react';

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

export default function InlineSelect({ value, placeholder, options, onChange, ariaLabel }: Props) {
  const isPlaceholder = value === '';
  return (
    <select
      className={`inline-select${isPlaceholder ? ' is-placeholder' : ''}`}
      value={value}
      aria-label={ariaLabel ?? placeholder}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
