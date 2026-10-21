import { createMMKV } from 'react-native-mmkv';
import { Habit } from '../types';

export const storage = createMMKV();

export const getHabits = (): Habit[] => {
  try {
    const habitsString = storage.getString('habits');
    return habitsString ? JSON.parse(habitsString) : [];
  } catch (error) {
    console.warn('Failed to read habits from storage', error);
    return [];
  }
};

export const saveHabits = (habits: Habit[]): boolean => {
  try {
    storage.set('habits', JSON.stringify(habits));
    return true;
  } catch (error) {
    console.warn('Failed to save habits to storage', error);
    return false;
  }
};


export const removeHabit = (id: string): boolean => {
  const habits = getHabits().filter((habit) => habit.id !== id);
  return saveHabits(habits);
};

export const removeHabits = (ids: string[]): boolean => {
  if (!ids.length) return true;
  const habits = getHabits().filter((habit) => !ids.includes(habit.id));
  return saveHabits(habits);
};