// XP and leveling utilities

export const XP_PER_EXERCISE = 10;
export const XP_LESSON_BONUS = 50;
export const XP_PER_LEVEL = 500;

export function getLevel(totalXP) {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getXPInCurrentLevel(totalXP) {
  return totalXP % XP_PER_LEVEL;
}

export function getXPForNextLevel() {
  return XP_PER_LEVEL;
}

export function getLevelProgress(totalXP) {
  return (getXPInCurrentLevel(totalXP) / XP_PER_LEVEL) * 100;
}

export function getLevelTitle(level) {
  if (level <= 5) return 'Anfänger';
  if (level <= 10) return 'Lernender';
  if (level <= 20) return 'Fortgeschritten';
  if (level <= 30) return 'Experte';
  if (level <= 40) return 'Meister';
  return 'Großmeister';
}
