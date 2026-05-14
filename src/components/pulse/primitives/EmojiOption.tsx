'use client';

interface Props {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function EmojiOption({ emoji, label, selected, onClick }: Props) {
  return (
    <button type="button" className={`emo${selected ? ' sel' : ''}`} onClick={onClick}>
      <span className="e">{emoji}</span>
      <span className="l">{label}</span>
    </button>
  );
}
