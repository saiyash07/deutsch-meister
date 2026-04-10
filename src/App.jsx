import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProgress } from './hooks/useProgress';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Dictionary from './pages/Dictionary';
import Speaking from './pages/Speaking';
import Writing from './pages/Writing';
import Review from './pages/Review';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { useEffect } from 'react';
import { loadVoices } from './utils/speech';

function ProtectedRoute({ children, user, loading }) {
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a12', color: '#fff' }}>
      <div className="loader">⌛ Loading your progress...</div>
    </div>
  );
  if (!user) return <Navigate to="/auth" />;
  return children;
}

export default function App() {
  const { user, loading, logout } = useAuth();
  const {
    progress, addXP, completeLesson, completeExercise,
    toggleFavoriteWord, addReviewWord, removeReviewWord,
    setApiKey, setDailyTarget,
    unlockAchievement, clearAllData,
  } = useProgress(user);

  useEffect(() => {
    loadVoices();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        
        <Route element={
          <ProtectedRoute user={user} loading={loading}>
            <Layout progress={progress} setApiKey={setApiKey} logout={logout} user={user} />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard progress={progress} />} />
          <Route path="/learn" element={<Learn progress={progress} />} />
          <Route path="/lesson/:lessonId" element={
            <Lesson progress={progress} completeLesson={completeLesson} addXP={addXP} />
          } />
          <Route path="/dictionary" element={
            <Dictionary progress={progress} toggleFavoriteWord={toggleFavoriteWord} />
          } />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/writing" element={<Writing progress={progress} />} />
          <Route path="/review" element={
            <Review progress={progress} addReviewWord={addReviewWord} removeReviewWord={removeReviewWord} />
          } />
          <Route path="/profile" element={
            <Profile
              progress={progress}
              setApiKey={setApiKey}
              setDailyTarget={setDailyTarget}
              clearAllData={clearAllData}
              user={user}
              logout={logout}
            />
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
