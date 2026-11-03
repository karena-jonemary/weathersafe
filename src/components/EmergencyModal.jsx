import { useEffect, useRef } from 'react';
import EmergencyContent from './EmergencyContent';

export default function EmergencyModal({ view, onClose }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!view) return undefined;
    buttonRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, onClose]);

  if (!view) return null;
  return (
    <div className="overlay" role="presentation">
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="em-title">
        <div className="dialog-head danger"><h2 id="em-title">⚠️ SEVERE WEATHER – EMERGENCY MODE</h2></div>
        <div className="dialog-body">
          <EmergencyContent city={view.city} risk={view.risk} />
          <div className="right">
            <button ref={buttonRef} className="btn primary" onClick={onClose}>I understand</button>
          </div>
        </div>
      </div>
    </div>
  );
}
