import { useState } from 'react';
import { Link } from 'react-router-dom';
import { curriculum, getModuleProgress, isModuleUnlocked } from '../data/curriculum';

export default function Learn({ progress }) {
  const [expandedModule, setExpandedModule] = useState(null);
  const [teacherMode, setTeacherMode] = useState(false);

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">📚 Learn German</h1>
          <p className="page-subtitle">Master German from A1 beginner to C2 mastery</p>
        </div>
        <button 
          className={`btn btn-sm ${teacherMode ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTeacherMode(!teacherMode)}
          style={{ height: 'fit-content' }}
        >
          {teacherMode ? '👨‍🏫 Teacher Mode: ON' : '👨‍🏫 Teacher Mode: OFF'}
        </button>
      </div>

      {curriculum.map((level) => {
        const levelLessons = level.modules.flatMap(m => m.lessons);
        const completedInLevel = levelLessons.filter(l => progress.completedLessons.includes(l.id)).length;
        const levelPct = levelLessons.length > 0 ? Math.round((completedInLevel / levelLessons.length) * 100) : 0;

        return (
          <div key={level.id} className="level-section">
            <div className="level-header">
              <span className="level-badge" style={{ background: `${level.color}22`, color: level.color }}>
                {level.level}
              </span>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{level.title}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{level.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: level.color }}>{levelPct}%</div>
                <div className="progress-bar" style={{ width: '100px', height: '6px' }}>
                  <div className="progress-fill" style={{ width: `${levelPct}%`, background: level.color }} />
                </div>
              </div>
            </div>

            <div className="grid-3">
              {level.modules.map((mod) => {
                const unlocked = teacherMode || isModuleUnlocked(mod.id, progress.completedLessons);
                const { percent, done, total } = getModuleProgress(mod.id, progress.completedLessons);

                return (
                  <div
                    key={mod.id}
                    className={`card module-card ${!unlocked ? 'locked' : ''}`}
                    onClick={() => unlocked && setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                  >
                    <div className="module-icon">{mod.icon}</div>
                    <div className="module-title">{mod.title}</div>
                    <div className="module-desc">{mod.description}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{done}/{total} lessons</span>
                      <span style={{ color: level.color, fontWeight: 600 }}>{percent}%</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: '8px', height: '6px' }}>
                      <div className="progress-fill" style={{ width: `${percent}%`, background: level.color }} />
                    </div>

                    {expandedModule === mod.id && (
                      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                        {mod.lessons.map((lesson) => {
                          const isDone = progress.completedLessons.includes(lesson.id);
                          const score = progress.lessonScores[lesson.id];
                          return (
                            <Link
                              key={lesson.id}
                              to={`/lesson/${lesson.id}`}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none', color: 'var(--text-primary)',
                                background: isDone ? 'rgba(88,204,2,0.08)' : 'transparent',
                                marginBottom: '4px', transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass-hover)'}
                              onMouseLeave={e => e.currentTarget.style.background = isDone ? 'rgba(88,204,2,0.08)' : 'transparent'}
                            >
                              <span style={{ fontSize: '16px' }}>{isDone ? '✅' : '○'}</span>
                              <span style={{ flex: 1, fontSize: '14px' }}>{lesson.title}</span>
                              {score !== undefined && (
                                <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>{score}%</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
