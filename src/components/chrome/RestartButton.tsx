// puts the demo back on home and parks the loose ends again.
interface Props {
  label: string;
  onRestart: () => void;
}

export default function RestartButton({ label, onRestart }: Props) {
  return (
    <button type="button" className="restart" id="restart" onClick={onRestart}>
      <svg className="restart-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.7 12a7.3 7.3 0 0 1 12.4-5.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.1 4.15V7.7h3.55" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.3 12a7.3 7.3 0 0 1-12.4 5.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.9 19.85V16.3H4.35" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
