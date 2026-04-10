import { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { speakGerman } from '../utils/speech';
import PronunciationBtn from '../components/PronunciationBtn';

const speakingPrompts = [
  { level: 'A1', prompts: [
    { text: 'Hallo', translation: 'Hello' },
    { text: 'Guten Morgen', translation: 'Good morning' },
    { text: 'Wie heißt du?', translation: 'What is your name?' },
    { text: 'Ich heiße Anna', translation: 'My name is Anna' },
    { text: 'Wie geht es dir?', translation: 'How are you?' },
    { text: 'Mir geht es gut, danke', translation: 'I am fine, thank you' },
    { text: 'Woher kommst du?', translation: 'Where are you from?' },
    { text: 'Ich komme aus Indien', translation: 'I come from India' },
    { text: 'Tschüss', translation: 'Goodbye' },
    { text: 'Auf Wiedersehen', translation: 'Goodbye (formal)' },
    { text: 'Ich spreche ein bisschen Deutsch', translation: 'I speak a little German' },
    { text: 'Eins, zwei, drei', translation: 'One, two, three' },
    { text: 'Ich lerne Deutsch', translation: 'I am learning German' },
    { text: 'Das ist gut', translation: 'That is good' },
    { text: 'Danke schön', translation: 'Thank you very much' },
  ]},
  { level: 'A2', prompts: [
    { text: 'Ich habe gestern ein Buch gelesen', translation: 'I read a book yesterday' },
    { text: 'Können Sie mir helfen?', translation: 'Can you help me?' },
    { text: 'Ich möchte einen Kaffee bestellen', translation: 'I would like to order a coffee' },
    { text: 'Wo ist der Bahnhof?', translation: 'Where is the train station?' },
    { text: 'Ich muss morgen arbeiten', translation: 'I have to work tomorrow' },
    { text: 'Das Wetter ist heute schön', translation: 'The weather is nice today' },
    { text: 'Ich wohne in einer großen Stadt', translation: 'I live in a big city' },
    { text: 'In meiner Freizeit spiele ich Fußball', translation: 'In my free time I play soccer' },
  ]},
  { level: 'B1', prompts: [
    { text: 'Wenn ich mehr Zeit hätte, würde ich reisen', translation: 'If I had more time, I would travel' },
    { text: 'Obwohl es regnet, gehe ich spazieren', translation: 'Although it is raining, I go for a walk' },
    { text: 'Der Mann, der dort steht, ist mein Lehrer', translation: 'The man who stands there is my teacher' },
    { text: 'Ich habe mich für die Stelle beworben', translation: 'I applied for the position' },
  ]},
];

export default function Speaking() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const { isListening, transcript, error, startListening, stopListening, compareText } = useSpeech();

  const currentLevel = speakingPrompts[levelIdx];
  const currentPrompt = currentLevel.prompts[promptIdx];

  useEffect(() => {
    if (transcript && currentPrompt) {
      const score = compareText(currentPrompt.text, transcript);
      setAccuracy(score);
      setAttempts(a => a + 1);
    }
  }, [transcript]);

  const nextPrompt = () => {
    setAccuracy(null);
    if (promptIdx + 1 < currentLevel.prompts.length) {
      setPromptIdx(promptIdx + 1);
    } else if (levelIdx + 1 < speakingPrompts.length) {
      setLevelIdx(levelIdx + 1);
      setPromptIdx(0);
    } else {
      setLevelIdx(0);
      setPromptIdx(0);
    }
  };

  const handleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      setAccuracy(null);
      startListening('de-DE');
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">🎤 Speaking Practice</h1>
        <p className="page-subtitle">Practice your German pronunciation</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {speakingPrompts.map((sp, i) => (
          <button
            key={sp.level}
            className={`btn btn-sm ${i === levelIdx ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setLevelIdx(i); setPromptIdx(0); setAccuracy(null); }}
          >
            {sp.level}
          </button>
        ))}
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '8px' }}>
          {promptIdx + 1}/{currentLevel.prompts.length} prompts
        </span>
      </div>

      <div className="speaking-card card">
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Read aloud in German:
        </div>

        <div className="speaking-target">
          {currentPrompt.text}
        </div>

        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          ({currentPrompt.translation})
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <PronunciationBtn text={currentPrompt.text} gender="male" />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center' }}>Listen first</span>
          <PronunciationBtn text={currentPrompt.text} gender="female" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button className={`mic-button ${isListening ? 'recording' : ''}`} onClick={handleMic}>
            {isListening ? '⏹' : '🎤'}
          </button>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {isListening ? 'Listening... Speak now!' : 'Tap to start speaking'}
          </div>
        </div>

        {error && (
          <div className="exercise-feedback incorrect" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {transcript && (
          <div className="speech-result">
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>You said:</div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{transcript}</div>
            
            {accuracy !== null && (
              <>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Accuracy</div>
                <div className={`accuracy-score ${accuracy >= 80 ? 'high' : accuracy >= 50 ? 'mid' : 'low'}`}>
                  {accuracy}%
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {accuracy >= 90 ? '🌟 Excellent! Perfect pronunciation!' :
                   accuracy >= 70 ? '👍 Great job! Almost there!' :
                   accuracy >= 50 ? '💪 Good effort! Keep practicing!' :
                   '🔄 Try again! Listen to the pronunciation first.'}
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={() => { setAccuracy(null); startListening('de-DE'); }}>
            🔄 Try Again
          </button>
          <button className="btn btn-primary" onClick={nextPrompt}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
