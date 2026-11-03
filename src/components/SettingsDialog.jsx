import { useState } from 'react';
import { DEMO_SCENARIOS } from '../config';

export default function SettingsDialog({ settings, onSave, onClose }) {
  const [form, setForm] = useState(settings);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      owmKey: form.owmKey.trim(),
      geminiKey: form.geminiKey.trim(),
      geminiModel: form.geminiModel.trim() || 'gemini-2.5-flash',
      demo: form.demo,
    });
    onClose();
  };

  return (
    <div className="overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title" onSubmit={submit}>
        <div className="dialog-body">
          <h2 id="settings-title" className="no-top">Settings</h2>

          <label className="f" htmlFor="owm">OpenWeatherMap API key</label>
          <input id="owm" type="password" autoComplete="off" value={form.owmKey} onChange={set('owmKey')} placeholder="Paste your key (free plan works)" />

          <label className="f" htmlFor="gem">Gemini API key (for the chatbot)</label>
          <input id="gem" type="password" autoComplete="off" value={form.geminiKey} onChange={set('geminiKey')} placeholder="Optional – a basic offline assistant is used without it" />

          <label className="f" htmlFor="model">Gemini model</label>
          <input id="model" value={form.geminiModel} onChange={set('geminiModel')} placeholder="gemini-2.5-flash" />

          <label className="f" htmlFor="demo">Data source</label>
          <select id="demo" value={form.demo} onChange={set('demo')}>
            <option value="">Live data (needs an OpenWeatherMap key)</option>
            {DEMO_SCENARIOS.map((s) => <option key={s.value} value={s.value}>Demo: {s.label}</option>)}
          </select>

          <p className="muted small">
            Keys are stored only in this browser. For a public deployment, route API calls through your own backend so
            keys are never exposed.
          </p>
          <div className="right row">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}
