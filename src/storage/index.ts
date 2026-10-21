import { createMMKV } from 'react-native-mmkv';
import { Habit } from '../types';

export const storage = createMMKV();

export const getHabits = (): Habit[] => {
  const habitsString = storage.getString('habits');
  return habitsString ? JSON.parse(habitsString) : [];
};

export const saveHabits = (habits: Habit[]) => {
  storage.set('habits', JSON.stringify(habits));
};


export const removeHabit = (id: string) => {
  storage.remove(id);
};