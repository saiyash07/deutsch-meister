import { useState, useCallback, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import PronunciationBtn from '../components/PronunciationBtn';

export default function Translator({ progress }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState('en'); // Translation target
  const { chat } = useAI(progress.apiKey);

  const translate = useCallback(async (text) => {
    if (!text.trim() || !progress.apiKey) {
      setOutput('');
      return;
    }
    setLoading(true);
    const prompt = targetLang === 'en' 
      ? "Translate this German text to English. Respond ONLY with the translation."
      : "Translate this English text to German. Respond ONLY with the translation.";
    
    const response = await chat(
      [{ role: 'user', content: text.trim() }],
      prompt
    );
    setOutput(response.trim());
    setLoading(false);
  }, [progress.apiKey, chat, targetLang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input) translate(input);
    }, 1500);
    return () => clearTimeout(timer);
  }, [input, translate]);

  const swapLanguages = () => {
    const newInput = output;
    const newOutput = input;
    setTargetLang(targetLang === 'en' ? 'de' : 'en');
    setInput(newInput);
    setOutput(newOutput);
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">⚡ Instant Translator</h1>
        <p className="page-subtitle">Real-time AI-powered translation with pronunciation</p>
      </div>

      {!progress.apiKey && (
        <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--orange)' }}>
          <p style={{ color: 'var(--orange)', fontSize: '14px' }}>
            ⚠️ Google Gemini API key is required for live translation. Please add it in your Profile.
          </p>
        </div>
      )}

      <div className="translator-container">
        <div className="translator-panel">
          <div className="translator-label">
            {targetLang === 'en' ? '🇩🇪 German' : '🇺🇸 English'}
            {input && (
              <PronunciationBtn 
                text={input} 
                lang={targetLang === 'en' ? 'de' : 'en'} 
                size="small" 
              />
            )}
          </div>
          <textarea
            className="translator-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here to translate..."
          />
        </div>

        <button className="translator-swap" onClick={swapLanguages} title="Swap Languages">
          ⇄
        </button>

        <div className="translator-panel">
          <div className="translator-label">
            {targetLang === 'en' ? '🇺🇸 English' : '🇩🇪 German'}
            {output && (
              <PronunciationBtn 
                text={output} 
                lang={targetLang === 'en' ? 'en' : 'de'} 
                size="small" 
              />
            )}
          </div>
          <div className={`translator-output ${loading ? 'loading' : ''}`}>
            {loading ? (
              <div className="translator-loader">Translating...</div>
            ) : (
              output || <span style={{ opacity: 0.3 }}>Translation will appear here</span>
            )}
          </div>
        </div>
      </div>

      <div className="translator-shortcuts" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '15px', marginBottom: '12px', color: 'var(--text-secondary)' }}>Common Phrases</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Guten Morgen', 'Wie geht es Ihnen?', 'Ich lerne Deutsch', 'Wo ist der Bahnhof?'].map(phrase => (
            <button 
              key={phrase} 
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setTargetLang('en');
                setInput(phrase);
              }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
