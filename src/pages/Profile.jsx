import { useState } from 'react';
import { getLevel, getLevelProgress, getLevelTitle, getXPInCurrentLevel, XP_PER_LEVEL } from '../utils/xp';
import { curriculum, getModuleProgress } from '../data/curriculum';

const ACHIEVEMENTS = [
  { id: 'first-lesson', icon: '🎓', name: 'First Lesson', desc: 'Complete your first lesson', check: (p) => p.completedLessons.length >= 1 },
  { id: 'streak-3', icon: '🔥', name: '3-Day Streak', desc: 'Maintain a 3-day streak', check: (p) => p.currentStreak >= 3 || p.longestStreak >= 3 },
  { id: 'streak-7', icon: '⚡', name: 'Week Warrior', desc: '7-day streak', check: (p) => p.currentStreak >= 7 || p.longestStreak >= 7 },
  { id: 'streak-30', icon: '💎', name: 'Monthly Master', desc: '30-day streak', check: (p) => p.currentStreak >= 30 || p.longestStreak >= 30 },
  { id: '10-lessons', icon: '📚', name: 'Bookworm', desc: 'Complete 10 lessons', check: (p) => p.completedLessons.length >= 10 },
  { id: '50-lessons', icon: '🏆', name: 'Scholar', desc: 'Complete 50 lessons', check: (p) => p.completedLessons.length >= 50 },
  { id: 'xp-1000', icon: '⭐', name: '1K XP Club', desc: 'Earn 1,000 XP', check: (p) => p.totalXP >= 1000 },
  { id: 'xp-5000', icon: '🌟', name: '5K XP Legend', desc: 'Earn 5,000 XP', check: (p) => p.totalXP >= 5000 },
  { id: 'a1-complete', icon: '🇩🇪', name: 'A1 Complete', desc: 'Complete all A1 lessons', check: (p) => {
    const a1 = curriculum.find(l => l.id === 'a1');
    return a1?.modules.every(m => m.lessons.every(l => p.completedLessons.includes(l.id)));
  }},
  { id: 'favorites-10', icon: '💝', name: 'Word Collector', desc: 'Save 10 favorite words', check: (p) => p.favoriteWords.length >= 10 },
  { id: 'level-5', icon: '🎖️', name: 'Rising Star', desc: 'Reach Level 5', check: (p) => getLevel(p.totalXP) >= 5 },
  { id: 'level-10', icon: '👑', name: 'Champion', desc: 'Reach Level 10', check: (p) => getLevel(p.totalXP) >= 10 },
];

export default function Profile({ progress, setApiKey, setDailyTarget, clearAllData, user, logout }) {
  const [apiInput, setApiInput] = useState(progress.apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const level = getLevel(progress.totalXP);
  const xpInLevel = getXPInCurrentLevel(progress.totalXP);
  const levelPct = getLevelProgress(progress.totalXP);

  const handleSaveKey = () => setApiKey(apiInput.trim());

  const handleClear = () => {
    if (confirmClear) {
      clearAllData();
      setConfirmClear(false);
      setApiInput('');
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">👤 Profile & Progress</h1>
          <p className="page-subtitle">Track your German learning journey</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={logout} style={{ color: '#ef4444' }}>
          Logout
        </button>
      </div>

      {/* Profile Hero */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="profile-header">
          <div className="profile-avatar">{user?.photoURL ? <img src={user.photoURL} alt="Avatar" width="48" style={{borderRadius: '50%'}} /> : '🇩🇪'}</div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Level {level} — {getLevelTitle(level)}</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user?.email || 'Student'}</p>
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontWeight: 'bold' }}>
                ☁️ Cloud Synced
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', marginTop: '16px' }}>
          <span>Level {level}</span>
          <span style={{ color: 'var(--text-muted)' }}>{xpInLevel}/{XP_PER_LEVEL} XP to Level {level + 1}</span>
        </div>
        <div className="progress-bar" style={{ height: '12px' }}>
          <div className="progress-fill" style={{ width: `${levelPct}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{progress.totalXP}</div>
          <div className="stat-label">Total XP</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--orange)' }}>{progress.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--purple)' }}>{progress.completedLessons.length}</div>
          <div className="stat-label">Lessons Done</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--blue)' }}>{progress.longestStreak || 0}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      {/* CEFR Progress */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>📊 Level Progress</h3>
        {curriculum.map(lvl => {
          const totalLessons = lvl.modules.reduce((sum, m) => sum + m.lessons.length, 0);
          const doneLessons = lvl.modules.reduce((sum, m) => sum + m.lessons.filter(l => progress.completedLessons.includes(l.id)).length, 0);
          const pct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
          return (
            <div key={lvl.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span><strong style={{ color: lvl.color }}>{lvl.level}</strong> — {lvl.title}</span>
                <span style={{ color: 'var(--text-muted)' }}>{doneLessons}/{totalLessons} ({pct}%)</span>
              </div>
              <div className="progress-bar" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: lvl.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>🏆 Achievements</h3>
        <div className="achievement-grid">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = ach.check(progress);
            return (
              <div key={ach.id} className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">{ach.icon}</div>
                <div className="achievement-name">{ach.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{ach.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>⚙️ Settings</h3>

        <div className="settings-section">
          <h3>🎯 Daily Target</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 5, 10].map(n => (
              <button
                key={n}
                className={`btn btn-sm ${progress.dailyTarget === n ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDailyTarget(n)}
              >
                {n} lesson{n > 1 ? 's' : ''}/day
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="settings-section">
          <h3>🔑 Gemini API Key</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Required for AI chatbot, writing analysis, and pronunciation tips.
          </p>
          <div className="api-key-input">
            <input
              className="input"
              type={showKey ? 'text' : 'password'}
              value={apiInput}
              onChange={e => setApiInput(e.target.value)}
              placeholder="Enter your Gemini API key..."
            />
            <button className="btn btn-secondary btn-sm" onClick={() => setShowKey(s => !s)}>
              {showKey ? '🙈' : '👁'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveKey}>Save</button>
          </div>
        </div>

        <div className="divider" />

        <div className="settings-section">
          <h3>🗑️ Clear All Data</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            This will permanently delete all your progress, XP, streaks, and settings.
          </p>
          <button className="btn btn-danger btn-sm" onClick={handleClear}>
            {confirmClear ? '⚠️ Click again to confirm' : '🗑️ Clear All Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
