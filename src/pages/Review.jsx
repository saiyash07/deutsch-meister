import { useState, useMemo } from 'react';
import { dictionary } from '../data/dictionary';
import PronunciationBtn from '../components/PronunciationBtn';

export default function Review({ progress, addReviewWord, removeReviewWord }) {
  const [flipped, setFlipped] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState('all'); // 'all', 'favorites', 'review'

  const words = useMemo(() => {
    if (mode === 'favorites') return dictionary.filter(w => progress.favoriteWords.includes(w.german));
    if (mode === 'review') return dictionary.filter(w => progress.reviewWords.includes(w.german));
    return [...dictionary].sort(() => Math.random() - 0.5).slice(0, 30);
  }, [mode, progress.favoriteWords, progress.reviewWords]);

  const currentWord = words[currentIdx];

  const next = () => {
    setFlipped(false);
    setCurrentIdx((currentIdx + 1) % (words.length || 1));
  };

  const prev = () => {
    setFlipped(false);
    setCurrentIdx(currentIdx > 0 ? currentIdx - 1 : words.length - 1);
  };

  const markKnown = () => {
    if (currentWord) removeReviewWord(currentWord.german);
    next();
  };

  const markLearning = () => {
    if (currentWord) addReviewWord(currentWord.german);
    next();
  };

  if (words.length === 0) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <h1 className="page-title">🔄 Review</h1>
          <p className="page-subtitle">Flashcard-based spaced repetition</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>{mode === 'favorites' ? 'No favorite words yet! Star words in the Dictionary.' :
              mode === 'review' ? 'No words in review queue. Words you mark as "Still Learning" will appear here.' :
              'No words available.'}</p>
          <button className="btn btn-primary" onClick={() => setMode('all')} style={{ marginTop: '16px' }}>
            Practice All Words
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">🔄 Review</h1>
        <p className="page-subtitle">Flashcard-based spaced repetition</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { key: 'all', label: '🎲 Random' },
          { key: 'favorites', label: `⭐ Favorites (${progress.favoriteWords.length})` },
          { key: 'review', label: `📝 Learning (${progress.reviewWords.length})` },
        ].map(m => (
          <button
            key={m.key}
            className={`btn btn-sm ${mode === m.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setMode(m.key); setCurrentIdx(0); setFlipped(false); }}
          >
            {m.label}
          </button>
        ))}
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '8px' }}>
          {currentIdx + 1}/{words.length}
        </span>
      </div>

      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        style={{ marginBottom: '24px' }}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>🇩🇪 German</div>
            <div className="flashcard-word">{currentWord.german}</div>
            {currentWord.gender && (
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>({currentWord.gender})</div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }} onClick={e => e.stopPropagation()}>
              <PronunciationBtn text={currentWord.german} gender="male" />
              <PronunciationBtn text={currentWord.german} gender="female" />
            </div>
            <div className="flashcard-hint">Tap to reveal</div>
          </div>
          <div className="flashcard-back">
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>🇬🇧 English</div>
            <div className="flashcard-word" style={{ color: 'var(--green)' }}>{currentWord.english}</div>
            {currentWord.example && (
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '12px', fontStyle: 'italic' }}>
                "{currentWord.example}"
              </div>
            )}
            <div className="flashcard-hint">Tap to flip back</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={prev}>← Previous</button>
        <button className="btn btn-danger btn-sm" onClick={markLearning} title="Still learning this word">
          📝 Still Learning
        </button>
        <button className="btn btn-primary btn-sm" onClick={markKnown} title="I know this word">
          ✅ Know It
        </button>
        <button className="btn btn-secondary" onClick={next}>Next →</button>
      </div>
    </div>
  );
}
