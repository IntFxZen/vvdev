import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Habit } from '../types';
import { getHabits, saveHabits } from '../storage';
import { createId, todayDateKey } from '../utils/date';
import { normalizeHabitTitle, toggleDateInHistory } from '../utils/habits';

type AddHabitInput = {
  title: string;
  emoji: string;
  time: string;
  duration: string;
};

type AddHabitResult = 'ok' | 'empty' | 'duplicate' | 'save_failed';

type HabitsContextType = {
  habits: Habit[];
  addHabit: (input: AddHabitInput) => AddHabitResult;
  toggleCompletion: (id: string, dateStr: string) => boolean;
  removeHabits: (ids: string[]) => boolean;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>(() => getHabits());
  const habitsRef = useRef(habits);
  habitsRef.current = habits;

  const persist = useCallback((next: Habit[]): boolean => {
    if (!saveHabits(next)) {
      return false;
    }
    habitsRef.current = next;
    setHabits(next);
    return true;
  }, []);

  const addHabit = useCallback(
    (input: AddHabitInput): AddHabitResult => {
      const title = input.title.trim();
      if (!title) {
        return 'empty';
      }

      const current = habitsRef.current;
      const normalizedTitle = normalizeHabitTitle(title);
      const hasDuplicate = current.some(
        (habit) => normalizeHabitTitle(habit.title) === normalizedTitle
      );
      if (hasDuplicate) {
        return 'duplicate';
      }

      const newHabit: Habit = {
        id: createId(),
        title,
        emoji: input.emoji.trim() || '🎯',
        time: input.time,
        duration: input.duration.trim() || '30 min',
        createdAt: todayDateKey(),
        history: [],
      };

      return persist([...current, newHabit]) ? 'ok' : 'save_failed';
    },
    [persist]
  );

  const toggleCompletion = useCallback(
    (id: string, dateStr: string): boolean => {
      const next = habitsRef.current.map((habit) =>
        habit.id === id
          ? { ...habit, history: toggleDateInHistory(habit.history, dateStr) }
          : habit
      );
      return persist(next);
    },
    [persist]
  );

  const removeHabits = useCallback(
    (ids: string[]): boolean => {
      if (!ids.length) {
        return true;
      }
      return persist(habitsRef.current.filter((habit) => !ids.includes(habit.id)));
    },
    [persist]
  );

  const value = useMemo(
    () => ({ habits, addHabit, toggleCompletion, removeHabits }),
    [habits, addHabit, toggleCompletion, removeHabits]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
