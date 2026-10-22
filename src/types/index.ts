export type Habit = {
  id: string;
  title: string;
  emoji: string;
  history: string[];
  time?: string;
  duration?: string;
  createdAt?: string;
};