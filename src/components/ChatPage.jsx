import { useEffect, useRef, useState } from 'react';
import { useWeatherApp } from '../context/WeatherContext';

const SUGGESTIONS = ['Do I need an umbrella?', 'Is it safe to go out?', 'What is the forecast for tomorrow?', 'Best time for a walk?'];

/** Step 3 – AI Weather Chatbot (Gemini). */
export default function ChatPage() {
  const { chat } = useWeatherApp();
  const [input, setInput] = useState('');
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.messages]);

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim() || chat.busy) return;
    chat.send(input);
    setInput('');
  };

  const handleSuggestion = (s) => {
    setInput(s);
    inputRef.current?.focus();
  };

  return (
    <section className="card" aria-label="AI weather chatbot">
      <h2>🤖 AI Weather Assistant</h2>
      <div className="chat-log" ref={logRef} aria-live="polite">
        {chat.messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'u' : 'b'}`}>{m.text}</div>
        ))}
        {chat.busy && <div className="msg b">…</div>}
      </div>

      <div className="chips">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={chat.busy}
            onClick={() => handleSuggestion(s)}
            title="Click to copy into question box"
          >
            {s}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the weather…"
          aria-label="Ask a weather question"
          autoComplete="off"
        />
        <button className="btn primary" type="submit" disabled={chat.busy || !input.trim()}>Send</button>
      </form>

      <div className="muted small">
        {chat.usingAI
          ? 'Powered by Gemini AI using the weather data on this page.'
          : 'Basic offline assistant active – add a Gemini API key in Settings for AI answers.'}
      </div>
    </section>
  );
}
