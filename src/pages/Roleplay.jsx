import { useState, useEffect, useRef } from 'react';
import { roleplays } from '../data/roleplays';
import { useAI } from '../hooks/useAI';
import { useSpeech } from '../hooks/useSpeech';
import PronunciationBtn from '../components/PronunciationBtn';

export default function Roleplay({ progress }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const { chat, loading } = useAI(progress.apiKey);
  const { isListening, transcript, startListening, stopListening } = useSpeech();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const startScenario = (scenario) => {
    setSelectedScenario(scenario);
    setMessages([{ role: 'model', content: scenario.initialMessage }]);
    setFeedback(null);
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    const aiResponse = await chat(
      newMessages,
      `${selectedScenario.systemPrompt}. Always respond in German. Include a very brief 'Feedback: [English tips on formality/etiquette]' only if the user made a social mistake.`
    );

    setMessages([...newMessages, { role: 'model', content: aiResponse }]);
  };

  const endRoleplay = async () => {
    const analysis = await chat(
      messages,
      "Analyze this German conversation. Provide a final evaluation in this format: Score: [0-100], Grammar: [Feedback], Etiquette: [Feedback on Du/Sie/Politeness]. Respond in English."
    );
    setFeedback(analysis);
  };

  if (!selectedScenario) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <h1 className="page-title">🎭 AI Roleplay</h1>
          <p className="page-subtitle">Test your social skills in real-world German scenarios</p>
        </div>

        <div className="grid-3">
          {roleplays.map(s => (
            <div key={s.id} className="card module-card" onClick={() => startScenario(s)}>
              <div className="module-icon">{s.avatar}</div>
              <div className="module-title">{s.title}</div>
              <div className="module-desc">{s.description}</div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${s.difficulty === 'Easy' ? 'green' : s.difficulty === 'Medium' ? 'orange' : 'red'}`}>
                  {s.difficulty}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in roleplay-page">
      <div className="roleplay-header">
        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedScenario(null)}>← Back</button>
        <div className="roleplay-meta">
          <h2>{selectedScenario.title}</h2>
          <span>{selectedScenario.location} • Character: {selectedScenario.character}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={endRoleplay}>End & Evaluate</button>
      </div>

      <div className="roleplay-chat" style={{ 
        backgroundImage: `linear-gradient(rgba(15, 15, 35, 0.8), rgba(15, 15, 35, 0.8)), url(${selectedScenario.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-lg)'
      }}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            <div className="bubble-content">
              {m.content}
              {m.role === 'model' && (
                <div className="bubble-actions">
                  <PronunciationBtn text={m.content} gender="male" size="small" />
                  <PronunciationBtn text={m.content} gender="female" size="small" />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="chat-bubble model loading">Thinking...</div>}
        <div ref={chatEndRef} />
      </div>

      {feedback && (
        <div className="card feedback-overlay animate-slide">
          <h3>Conversation Review</h3>
          <div className="feedback-content" style={{ whiteSpace: 'pre-wrap' }}>{feedback}</div>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setSelectedScenario(null)}>Finish</button>
        </div>
      )}

      <div className="roleplay-input-area">
        <button 
          className={`mic-button btn-sm ${isListening ? 'recording' : ''}`}
          onClick={() => isListening ? stopListening() : startListening('de-DE')}
        >
          {isListening ? '⏹' : '🎤'}
        </button>
        <input 
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or speak in German..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-icon btn-primary" onClick={() => handleSend()}>➔</button>
      </div>
    </div>
  );
}
