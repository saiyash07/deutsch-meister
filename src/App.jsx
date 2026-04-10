import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useProgress } from './hooks/useProgress';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Dictionary from './pages/Dictionary';
import Speaking from './pages/Speaking';
import Writing from './pages/Writing';
import Review from './pages/Review';
import Profile from './pages/Profile';
import { useEffect } from 'react';
import { loadVoices } from './utils/speech';

export default function App() {
  const {
    progress, addXP, completeLesson, completeExercise,
    toggleFavoriteWord, addReviewWord, removeReviewWord,
    setApiKey, setChatHistory, setDailyTarget,
    unlockAchievement, clearAllData,
  } = useProgress();

  // Preload speech voices
  useEffect(() => {
    loadVoices();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout progress={progress} setApiKey={setApiKey} setChatHistory={setChatHistory} />}>
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
            />
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
