import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OpeningRule {
  id: string;
  minutes: number;
  message: string;
}

interface OpeningState {
  rules: OpeningRule[];
  addRule: () => void;
  updateRule: (id: string, updates: Partial<OpeningRule>) => void;
  deleteRule: (id: string) => void;
}

export const useOpeningStore = create<OpeningState>()(
  persist(
    (set) => ({
      rules: [
        { id: '1', minutes: 5, message: '您好，请问有什么可以帮您？' }
      ],
      addRule: () => set((state) => ({
        rules: [
          ...state.rules,
          { 
            id: Date.now().toString(), 
            minutes: 5, 
            message: '' 
          }
        ]
      })),
      updateRule: (id, updates) => set((state) => ({
        rules: state.rules.map((rule) => 
          rule.id === id ? { ...rule, ...updates } : rule
        )
      })),
      deleteRule: (id) => set((state) => ({
        rules: state.rules.filter((rule) => rule.id !== id)
      })),
    }),
    {
      name: 'opening-config-storage',
    }
  )
);
