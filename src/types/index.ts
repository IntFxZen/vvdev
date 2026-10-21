export type Habit = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  history: string[];
  time?: string;
  duration?: string;
};