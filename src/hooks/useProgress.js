// Progress tracking hook using localStorage
import { useState, useCallback, useEffect } from 'react';
import { updateStreak } from '../utils/streak';

const STORAGE_KEY = 'deutsch_meister_progress';

const defaultProgress = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  activeDates: [],
  completedLessons: [],
  completedExercises: {},
  lessonScores: {},
  dailyTarget: 3,
  dailyCompleted: 0,
  dailyDate: null,
  reviewWords: [],
  favoriteWords: [],
  achievements: [],
  apiKey: '',
  chatHistory: [],
  totalTimeSpent: 0,
  lessonsStarted: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset daily if different day
        const today = new Date().toISOString().split('T')[0];
        if (parsed.dailyDate !== today) {
          parsed.dailyCompleted = 0;
          parsed.dailyDate = today;
        }
        return { ...defaultProgress, ...parsed };
      }
    } catch (e) {
      console.error('Error loading progress:', e);
    }
    return { ...defaultProgress, dailyDate: new Date().toISOString().split('T')[0] };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }, [progress]);

  const addXP = useCallback((amount) => {
    setProgress(prev => {
      const updated = updateStreak(prev);
      return {
        ...updated,
        totalXP: updated.totalXP + amount,
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId, score, xpEarned) => {
    setProgress(prev => {
      const updated = updateStreak(prev);
      const today = new Date().toISOString().split('T')[0];
      return {
        ...updated,
        totalXP: updated.totalXP + xpEarned,
        completedLessons: [...new Set([...updated.completedLessons, lessonId])],
        lessonScores: { ...updated.lessonScores, [lessonId]: Math.max(score, updated.lessonScores[lessonId] || 0) },
        dailyCompleted: updated.dailyDate === today ? updated.dailyCompleted + 1 : 1,
        dailyDate: today,
        lessonsStarted: updated.lessonsStarted + 1,
      };
    });
  }, []);

  const completeExercise = useCallback((lessonId, exerciseIndex) => {
    setProgress(prev => ({
      ...prev,
      completedExercises: {
        ...prev.completedExercises,
        [lessonId]: [...new Set([...(prev.completedExercises[lessonId] || []), exerciseIndex])],
      },
    }));
  }, []);

  const toggleFavoriteWord = useCallback((word) => {
    setProgress(prev => {
      const favs = prev.favoriteWords;
      const exists = favs.includes(word);
      return {
        ...prev,
        favoriteWords: exists ? favs.filter(w => w !== word) : [...favs, word],
      };
    });
  }, []);

  const addReviewWord = useCallback((word) => {
    setProgress(prev => ({
      ...prev,
      reviewWords: [...new Set([...prev.reviewWords, word])],
    }));
  }, []);

  const removeReviewWord = useCallback((word) => {
    setProgress(prev => ({
      ...prev,
      reviewWords: prev.reviewWords.filter(w => w !== word),
    }));
  }, []);

  const setApiKey = useCallback((key) => {
    setProgress(prev => ({ ...prev, apiKey: key }));
  }, []);

  const setChatHistory = useCallback((history) => {
    setProgress(prev => ({ ...prev, chatHistory: history }));
  }, []);

  const setDailyTarget = useCallback((target) => {
    setProgress(prev => ({ ...prev, dailyTarget: target }));
  }, []);

  const unlockAchievement = useCallback((id) => {
    setProgress(prev => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id] };
    });
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({ ...defaultProgress, dailyDate: new Date().toISOString().split('T')[0] });
  }, []);

  return {
    progress,
    addXP,
    completeLesson,
    completeExercise,
    toggleFavoriteWord,
    addReviewWord,
    removeReviewWord,
    setApiKey,
    setChatHistory,
    setDailyTarget,
    unlockAchievement,
    clearAllData,
  };
}
