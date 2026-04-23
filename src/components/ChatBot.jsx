import { useState, useRef, useEffect } from 'react';
import { useAI } from '../hooks/useAI';

const SYSTEM_PROMPT = `You are "Deutsch Meister Bot", a private German tutor. 
CRITICAL: Be extremely brief and concise. Answer in 1 short sentence if possible, maximum 2. No intro fluff like "That's an excellent question".
Example:
User: What is bike in German?
Bot: Bike in German is **das Fahrrad** (plural: die Fahrräder).

You help with:
- Grammar, translations, conjugations, and culture.
Always provide English translations in parentheses. Use markdown. Use emojis sparingly.`;

const FAQ_BUTTONS = [
  { label: '🔤 German alphabet', msg: 'Teach me the German alphabet with pronunciation tips' },
  { label: '📝 Explain cases', msg: 'Explain the 4 German cases (Nominative, Accusative, Dative, Genitive) simply' },
  { label: '🗣️ Common phrases', msg: 'What are the 10 most important German phrases for beginners?' },
  { label: '📊 Verb conjugation', msg: 'Show me how to conjugate regular verbs in present tense' },
  { label: '🎯 Quiz me!', msg: 'Give me a quick 5-question German vocabulary quiz for A1 level' },
  { label: '🇩🇪 Culture tip', msg: 'Tell me an interesting fact about German culture' },
];

export default function ChatBot({ apiKey, chatHistory, setChatHistory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatHistory || []);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { chat, loading } = useAI(apiKey);

  useEffect(() => {
    if (messages.length > 0 && setChatHistory) {
      setChatHistory(messages.slice(-50)); // keep last 50 messages
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || !apiKey) return;
    
    const userMsg = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const response = await chat(
      newMessages.map(m => ({ role: m.role, content: m.content })),
      SYSTEM_PROMPT
    );

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', content: response }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-bubble" onClick={() => setIsOpen(true)} title="German Tutor Chat">
          🤖
        </button>
      )}
      
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <h3>🤖 Deutsch Meister Bot</h3>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="chatbot-faq">
            {FAQ_BUTTONS.map((faq, i) => (
              <button key={i} className="faq-btn" onClick={() => sendMessage(faq.msg)} disabled={!apiKey}>
                {faq.label}
              </button>
            ))}
          </div>
          
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🇩🇪</div>
                <p style={{ fontSize: '14px' }}>Hallo! I'm your German tutor. Ask me anything about German language!</p>
                {!apiKey && (
                  <p style={{ fontSize: '12px', color: 'var(--orange)', marginTop: '8px' }}>
                    ⚠️ Set your Gemini API key in Profile to enable AI chat
                  </p>
                )}
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              className="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about German..."
              disabled={loading}
            />
            <button type="submit" className="chatbot-send" disabled={loading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
