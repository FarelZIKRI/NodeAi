import { create } from 'zustand';

export const useHeroFlowStore = create((set) => ({
  topic: 'React JS',
  level: 'Pemula',
  layout: 'Horizontal',
  setTopic: (topic) => set({ topic }),
  setLevel: (level) => set({ level }),
  setLayout: (layout) => set({ layout }),
}));
