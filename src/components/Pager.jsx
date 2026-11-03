export default function Pager({ index, total, title, canAdvance, onBack, onNext }) {
  const isLast = index === total - 1;
  return (
    <div className="pager">
      <button type="button" className="btn" onClick={onBack} disabled={index === 0}>← Back</button>
      <span className="muted" aria-live="polite">Step {index + 1} of {total} · {title}</span>
      <button type="button" className="btn primary" onClick={onNext} disabled={!isLast && !canAdvance}>
        {isLast ? '↺ Search another city' : 'Next →'}
      </button>
    </div>
  );
}
