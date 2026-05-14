'use client';

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Pill({ label, selected, onClick }: Props) {
  return (
    <button type="button" className={`pill${selected ? ' on' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}
