import { useEffect, useRef } from 'react';

export default function Stepper({ steps, current, unlocked, onSelect }) {
  const activeRef = useRef(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: 'nearest', inline: 'center' });
  }, [current]);

  return (
    <nav className="stepper" aria-label="Steps">
      {steps.map((step, i) => {
        const state = i === current ? 'active' : i < current ? 'done' : '';
        return (
          <button
            key={step.id}
            ref={i === current ? activeRef : null}
            type="button"
            className={state}
            disabled={i > 0 && !unlocked}
            aria-current={i === current ? 'step' : undefined}
            onClick={() => onSelect(i)}
          >
            <span className="n">{i < current ? '✓' : i + 1}</span>
            {step.title}
          </button>
        );
      })}
    </nav>
  );
}
