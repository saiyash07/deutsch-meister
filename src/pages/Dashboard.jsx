import { Link } from 'react-router-dom';
import { getLevel, getLevelProgress, getLevelTitle, getXPInCurrentLevel, XP_PER_LEVEL } from '../utils/xp';
import { getStreakEmoji } from '../utils/streak';
import { curriculum, getModuleProgress } from '../data/curriculum';

export default function Dashboard({ progress }) {
  const level = getLevel(progress.totalXP);
  const xpInLevel = getXPInCurrentLevel(progress.totalXP);
  const levelPct = getLevelProgress(progress.totalXP);
  const dailyPct = Math.min((progress.dailyCompleted / progress.dailyTarget) * 100, 100);

  // Find next lesson to continue
  let nextLesson = null;
  for (const lvl of curriculum) {
    for (const mod of lvl.modules) {
      for (const lesson of mod.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          nextLesson = { ...lesson, module: mod, level: lvl };
          break;
        }
      }
      if (nextLesson) break;
    }
    if (nextLesson) break;
  }

  // Recent 7 days activity
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
    last7.push({ day: dayName, active: progress.activeDates?.includes(dateStr) || false });
  }

  return (
    <div className="animate-in">
      <div className="dashboard-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
              Willkommen zurück! <span className="streak-fire">🔥</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              Keep learning German — you're doing amazing!
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--green)' }}>{progress.currentStreak}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{getStreakEmoji(progress.currentStreak)} Day Streak</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{progress.totalXP}</div>
          <div className="stat-label">Total XP</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--blue)' }}>Lv.{level}</div>
          <div className="stat-label">{getLevelTitle(level)}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--purple)' }}>{progress.completedLessons.length}</div>
          <div className="stat-label">Lessons Done</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--orange)' }}>{progress.longestStreak || 0}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* XP Progress */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>📊 Level Progress</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span>Level {level}</span>
            <span style={{ color: 'var(--text-muted)' }}>{xpInLevel}/{XP_PER_LEVEL} XP</span>
          </div>
          <div className="progress-bar" style={{ height: '12px' }}>
            <div className="progress-fill" style={{ width: `${levelPct}%` }} />
          </div>
        </div>

        {/* Daily Target */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>🎯 Daily Target</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span>{progress.dailyCompleted}/{progress.dailyTarget} lessons</span>
            <span style={{ color: dailyPct >= 100 ? 'var(--green)' : 'var(--text-muted)' }}>
              {dailyPct >= 100 ? '✅ Complete!' : `${Math.round(dailyPct)}%`}
            </span>
          </div>
          <div className="progress-bar" style={{ height: '12px' }}>
            <div className="progress-fill" style={{ width: `${dailyPct}%`, background: dailyPct >= 100 ? 'var(--green)' : undefined }} />
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      {nextLesson && (
        <div className="card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, rgba(88,204,2,0.1), rgba(73,192,248,0.05))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Continue Learning</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{nextLesson.module.icon} {nextLesson.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{nextLesson.module.title} • {nextLesson.level.level}</p>
            </div>
            <Link to={`/lesson/${nextLesson.id}`} className="btn btn-primary btn-lg">
              Start Lesson →
            </Link>
          </div>
        </div>
      )}

      {/* Weekly Activity */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📅 This Week</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {last7.map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: 'var(--radius-full)',
                background: d.active ? 'var(--green)' : 'var(--bg-glass)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', marginBottom: '6px', margin: '0 auto 6px',
                border: d.active ? 'none' : '1px solid var(--border)',
              }}>
                {d.active ? '✓' : ''}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
