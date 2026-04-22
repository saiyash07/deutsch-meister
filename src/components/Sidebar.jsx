import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: '🏠', label: 'Dashboard' },
  { path: '/learn', icon: '📚', label: 'Learn' },
  { path: '/dictionary', icon: '📖', label: 'Dictionary' },
  { path: '/speaking', icon: '🎤', label: 'Speaking' },
  { path: '/writing', icon: '✍️', label: 'Writing' },
  { path: '/review', icon: '🔄', label: 'Review' },
  { path: '/translator', icon: '⚡', label: 'Instant Translator' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar({ streak }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button className="mobile-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '☰'}
      </button>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-logo" onClick={() => setOpen(false)}>
            <div className="sidebar-logo-icon">🇩🇪</div>
            <span className="sidebar-logo-text">Deutsch Meister <small style={{fontSize: '9px', opacity: 0.5}}>v1.2-FINAL</small></span>
          </NavLink>
        </div>
        <div className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
              end={item.path === '/'}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-streak">
            <span className="streak-fire">🔥</span>
            <span>{streak || 0} day streak</span>
          </div>
        </div>
      </nav>
    </>
  );
}
