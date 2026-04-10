import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonById } from '../data/curriculum';
import { getExercises } from '../data/exercises';
import { XP_PER_EXERCISE, XP_LESSON_BONUS } from '../utils/xp';
import { speakGerman } from '../utils/speech';
import PronunciationBtn from '../components/PronunciationBtn';

export default function Lesson({ progress, completeLesson, addXP }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId);
  const exercises = getExercises(lessonId);

  const [current, setCurrent] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xpEarned, setXpEarned] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [matchSelected, setMatchSelected] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [orderWords, setOrderWords] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!lesson) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h2>Lesson not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/learn')} style={{ marginTop: '16px' }}>Back to Learn</button>
      </div>
    );
  }

  const ex = exercises[current];
  const progressPct = ((current) / exercises.length) * 100;

  const checkAnswer = (userAnswer) => {
    if (answered) return;
    setAnswered(true);
    let isCorrect = false;

    if (ex.type === 'mcq') {
      isCorrect = userAnswer === ex.answer;
      setSelectedOption(userAnswer);
    } else if (ex.type === 'fill' || ex.type === 'translate' || ex.type === 'listen') {
      const clean = (s) => s.toLowerCase().trim().replace(/[.,!?;:'"]/g, '');
      isCorrect = clean(userAnswer) === clean(ex.answer);
    } else if (ex.type === 'order') {
      const clean = (s) => s.toLowerCase().trim().replace(/[.,!?;:'"]/g, '');
      isCorrect = clean(userAnswer) === clean(ex.answer);
    }

    if (isCorrect) {
      setCorrect(c => c + 1);
      setXpEarned(x => x + XP_PER_EXERCISE);
      setShowFeedback('correct');
    } else {
      setHearts(h => h - 1);
      setShowFeedback('incorrect');
    }
  };

  const nextExercise = () => {
    if (hearts <= 0) {
      setFinished(true);
      return;
    }
    if (current + 1 >= exercises.length) {
      setFinished(true);
      const totalXP = xpEarned + XP_LESSON_BONUS;
      const score = Math.round((correct / exercises.length) * 100);
      completeLesson(lessonId, score, totalXP);
      return;
    }
    setCurrent(c => c + 1);
    setShowFeedback(null);
    setSelectedOption(null);
    setUserInput('');
    setMatchSelected([]);
    setMatchedPairs([]);
    setOrderWords([]);
    setAnswered(false);
  };

  // Auto-play audio for listen exercises
  useEffect(() => {
    if (ex?.type === 'listen' && ex.audio) {
      setTimeout(() => speakGerman(ex.audio), 500);
    }
  }, [current]);

  if (finished) {
    const score = exercises.length > 0 ? Math.round((correct / exercises.length) * 100) : 0;
    const totalXP = xpEarned + (hearts > 0 ? XP_LESSON_BONUS : 0);
    return (
      <div className="lesson-container animate-scale">
        <div className="exercise-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{hearts > 0 ? '🎉' : '💔'}</div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            {hearts > 0 ? 'Lesson Complete!' : 'Out of Hearts!'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {hearts > 0 ? `Great job on "${lesson.title}"!` : 'Try again to master this lesson.'}
          </p>
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <div className="stat-card"><div className="stat-value" style={{ color: 'var(--green)' }}>{score}%</div><div className="stat-label">Score</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: 'var(--blue)' }}>+{totalXP}</div><div className="stat-label">XP Earned</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: 'var(--red)' }}>❤️ {hearts}</div><div className="stat-label">Hearts Left</div></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/learn')}>Back to Learn</button>
            <button className="btn btn-primary" onClick={() => { setCurrent(0); setHearts(5); setXpEarned(0); setCorrect(0); setFinished(false); setShowFeedback(null); setAnswered(false); }}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  const renderExercise = () => {
    if (!ex) return null;

    switch (ex.type) {
      case 'mcq':
        return (
          <>
            <div className="exercise-prompt">{ex.prompt}</div>
            {ex.audio && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                <PronunciationBtn text={ex.audio} gender="male" />
                <PronunciationBtn text={ex.audio} gender="female" />
              </div>
            )}
            <div className="exercise-instruction">Choose the correct answer</div>
            <div className="exercise-options">
              {ex.options.map((opt, i) => (
                <button
                  key={i}
                  className={`exercise-option ${selectedOption === i ? 'selected' : ''} ${
                    answered && i === ex.answer ? 'correct' : ''
                  } ${answered && selectedOption === i && i !== ex.answer ? 'incorrect' : ''}`}
                  onClick={() => checkAnswer(i)}
                  disabled={answered}
                >
                  <span className="exercise-option-letter">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </>
        );

      case 'fill':
        return (
          <>
            <div className="exercise-prompt">{ex.prompt}</div>
            {ex.audio && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                <PronunciationBtn text={ex.audio} gender="male" />
                <PronunciationBtn text={ex.audio} gender="female" />
              </div>
            )}
            <div className="exercise-instruction">Fill in the blank</div>
            <input
              className="exercise-input"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !answered && userInput && checkAnswer(userInput)}
              placeholder="Type your answer..."
              disabled={answered}
              autoFocus
            />
          </>
        );

      case 'translate':
        return (
          <>
            <div className="exercise-prompt">{ex.prompt}</div>
            {ex.audio && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                <PronunciationBtn text={ex.audio} gender="male" />
                <PronunciationBtn text={ex.audio} gender="female" />
              </div>
            )}
            <div className="exercise-instruction">Write the translation</div>
            <input
              className="exercise-input"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !answered && userInput && checkAnswer(userInput)}
              placeholder="Type translation..."
              disabled={answered}
              autoFocus
            />
          </>
        );

      case 'listen':
        return (
          <>
            <div className="exercise-prompt">{ex.prompt}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
              <button className="btn btn-secondary" onClick={() => speakGerman(ex.audio, 'male')} style={{ fontSize: '24px', padding: '16px 24px' }}>
                🔵 🔊
              </button>
              <button className="btn btn-secondary" onClick={() => speakGerman(ex.audio, 'female')} style={{ fontSize: '24px', padding: '16px 24px' }}>
                🔴 🔊
              </button>
            </div>
            <div className="exercise-instruction">Type what you hear</div>
            <input
              className="exercise-input"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !answered && userInput && checkAnswer(userInput)}
              placeholder="Type what you hear..."
              disabled={answered}
              autoFocus
            />
          </>
        );

      case 'match': {
        const allItems = [];
        ex.pairs.forEach(([left, right]) => {
          allItems.push({ text: left, side: 'left', pairId: left });
          allItems.push({ text: right, side: 'right', pairId: left });
        });
        // Shuffle right side
        const leftItems = ex.pairs.map(p => p[0]);
        const rightItems = [...ex.pairs.map(p => p[1])].sort(() => Math.random() - 0.5);

        const handleMatchClick = (text, side) => {
          if (answered) return;
          if (matchedPairs.some(p => p.includes(text))) return;

          const newSel = [...matchSelected];
          const existingIdx = newSel.findIndex(s => s.side === side);
          if (existingIdx >= 0) {
            newSel[existingIdx] = { text, side };
          } else {
            newSel.push({ text, side });
          }
          setMatchSelected(newSel);

          if (newSel.length === 2 && newSel[0].side !== newSel[1].side) {
            const leftText = newSel.find(s => s.side === 'left')?.text;
            const rightText = newSel.find(s => s.side === 'right')?.text;
            const pair = ex.pairs.find(p => p[0] === leftText && p[1] === rightText);
            if (pair) {
              const newMatched = [...matchedPairs, [leftText, rightText]];
              setMatchedPairs(newMatched);
              if (newMatched.length === ex.pairs.length) {
                checkAnswer('correct');
              }
            } else {
              setHearts(h => h - 1);
            }
            setTimeout(() => setMatchSelected([]), 300);
          }
        };

        return (
          <>
            <div className="exercise-prompt">{ex.prompt}</div>
            <div className="exercise-instruction">Match the pairs</div>
            <div className="match-grid">
              <div>
                {leftItems.map(item => (
                  <div
                    key={item}
                    className={`match-item ${matchSelected.some(s => s.text === item) ? 'selected' : ''} ${matchedPairs.some(p => p[0] === item) ? 'matched' : ''}`}
                    onClick={() => handleMatchClick(item, 'left')}
                  >{item}</div>
                ))}
              </div>
              <div>
                {rightItems.map(item => (
                  <div
                    key={item}
                    className={`match-item ${matchSelected.some(s => s.text === item) ? 'selected' : ''} ${matchedPairs.some(p => p[1] === item) ? 'matched' : ''}`}
                    onClick={() => handleMatchClick(item, 'right')}
                  >{item}</div>
                ))}
              </div>
            </div>
          </>
        );
      }

      case 'order': {
        const words = ex.words || ex.answer.split(' ');
        const shuffled = [...words].sort(() => Math.random() - 0.5);

        return (
          <>
            <div className="exercise-prompt">{ex.prompt}</div>
            <div className="exercise-instruction">Arrange the words in correct order</div>
            <div className="word-answer-area" style={{ marginBottom: '16px' }}>
              {orderWords.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tap words to build the sentence</span>}
              {orderWords.map((w, i) => (
                <span key={i} className="word-answer-chip" onClick={() => setOrderWords(orderWords.filter((_, j) => j !== i))}>{w}</span>
              ))}
            </div>
            <div className="word-bank">
              {shuffled.map((w, i) => (
                <span
                  key={i}
                  className={`word-chip ${orderWords.includes(w) ? 'used' : ''}`}
                  onClick={() => !orderWords.includes(w) && setOrderWords([...orderWords, w])}
                >{w}</span>
              ))}
            </div>
          </>
        );
      }

      default:
        return <div>Unknown exercise type</div>;
    }
  };

  const canCheck = () => {
    if (answered) return false;
    if (ex.type === 'mcq') return selectedOption !== null;
    if (ex.type === 'fill' || ex.type === 'translate' || ex.type === 'listen') return userInput.trim().length > 0;
    if (ex.type === 'order') return orderWords.length > 0;
    if (ex.type === 'match') return false; // auto-checks
    return false;
  };

  return (
    <div className="lesson-container animate-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/learn')}>✕ Exit</button>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{lesson.module.icon} {lesson.module.title}</span>
      </div>

      {/* Progress */}
      <div className="lesson-progress">
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="lesson-hearts">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ opacity: i < hearts ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
      </div>

      {/* Exercise */}
      <div className="exercise-card">
        {renderExercise()}

        {/* Feedback */}
        {showFeedback && (
          <div className={`exercise-feedback ${showFeedback}`}>
            {showFeedback === 'correct' ? (
              <>✅ Correct! +{XP_PER_EXERCISE} XP</>
            ) : (
              <>❌ Incorrect! The answer is: <strong>{ex.type === 'mcq' ? ex.options[ex.answer] : ex.answer}</strong></>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="exercise-actions">
          {ex.type !== 'match' && !answered && (
            <button
              className="btn btn-primary"
              disabled={!canCheck()}
              onClick={() => {
                if (ex.type === 'mcq') checkAnswer(selectedOption);
                else if (ex.type === 'order') checkAnswer(orderWords.join(' '));
                else checkAnswer(userInput);
              }}
            >
              Check Answer
            </button>
          )}
          {answered && (
            <button className="btn btn-primary" onClick={nextExercise}>
              {current + 1 >= exercises.length ? 'Finish Lesson' : 'Continue →'}
            </button>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
        Exercise {current + 1} of {exercises.length} • +{xpEarned} XP earned
      </div>
    </div>
  );
}
