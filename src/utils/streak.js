// Streak tracking utilities

export function checkStreak(progress) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (progress.lastActiveDate === today) {
    return progress.currentStreak;
  }
  
  if (progress.lastActiveDate === yesterday) {
    return progress.currentStreak;
  }
  
  return 0;
}

export function updateStreak(progress) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (progress.lastActiveDate === today) {
    return { ...progress };
  }
  
  let newStreak;
  if (progress.lastActiveDate === yesterday) {
    newStreak = progress.currentStreak + 1;
  } else {
    newStreak = 1;
  }
  
  return {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, progress.longestStreak || 0),
    lastActiveDate: today,
    activeDates: [...(progress.activeDates || []), today],
  };
}

export function getStreakEmoji(streak) {
  if (streak >= 30) return '🔥';
  if (streak >= 14) return '⚡';
  if (streak >= 7) return '✨';
  if (streak >= 3) return '💪';
  return '🌱';
}
