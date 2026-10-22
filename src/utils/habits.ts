import { Habit } from '../types';
import { formatDateKey } from './date';

export const normalizeHabitTitle = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
};

export const formatHabitTitle = (title: string): string => {
  return (title || '').toUpperCase().replace(/\s+/g, '_');
};

export const formatHabitSchedule = (
  habit: Pick<Habit, 'time' | 'duration'>
): string | null => {
  if (habit.time && habit.duration) {
    return `${habit.time} · ${habit.duration}`;
  }
  if (habit.time) {
    return habit.time;
  }
  if (habit.duration) {
    return habit.duration;
  }
  return null;
};

export const toggleDateInHistory = (history: string[], dateStr: string): string[] => {
  return history.includes(dateStr)
    ? history.filter((date) => date !== dateStr)
    : [...history, dateStr];
};

export const currentStreak = (history: string[] | undefined, fromDate = new Date()): number => {
  if (!history?.length) {
    return 0;
  }

  const dates = new Set(history);
  const cursor = new Date(fromDate);

  if (!dates.has(formatDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(formatDateKey(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (dates.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const longestCurrentStreak = (habits: Habit[]): number => {
  return habits.reduce((max, habit) => Math.max(max, currentStreak(habit.history)), 0);
};
