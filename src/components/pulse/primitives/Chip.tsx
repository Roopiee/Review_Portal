'use client';

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Chip({ label, selected, onClick }: Props) {
  return (
    <button type="button" className={`chip${selected ? ' on' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}
