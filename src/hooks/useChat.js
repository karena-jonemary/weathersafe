import { useCallback, useState } from 'react';
import { askGemini, buildWeatherContext } from '../services/geminiApi';
import { localAnswer } from '../utils/localAnswer';

const GREETING = {
  role: 'model',
  greeting: true,
  text: 'Hi! Ask me anything about the weather for the selected city, e.g. “Is it safe to travel tonight?”',
};

/** Chat state lives here (not in the page) so it survives moving between steps. */
export function useChat({ settings, weather }) {
  const [messages, setMessages] = useState([GREETING]);
  const [busy, setBusy] = useState(false);

  const send = useCallback(
    async (question) => {
      const text = question.trim();
      if (!text || busy) return;
      const history = [...messages, { role: 'user', text }];
      setMessages(history);

      if (!weather) {
        setMessages((m) => [...m, { role: 'model', text: 'Please search for a city first.' }]);
        return;
      }

      setBusy(true);
      let answer;
      try {
        if (settings.geminiKey) {
          answer = await askGemini({
            apiKey: settings.geminiKey,
            model: settings.geminiModel,
            // The API expects the conversation to start with a user turn.
            history: history.filter((m) => !m.greeting),
            context: buildWeatherContext(weather),
          });
        } else {
          answer = localAnswer(text, { ...weather, unit: settings.unit });
        }
      } catch (e) {
        answer = `${localAnswer(text, { ...weather, unit: settings.unit })}\n\n(AI service unavailable: ${e.message})`;
      }
      setMessages((m) => [...m, { role: 'model', text: answer }]);
      setBusy(false);
    },
    [messages, busy, settings, weather],
  );

  return { messages, busy, send, usingAI: Boolean(settings.geminiKey) };
}
