import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReturnVisitState {
  noReplyMinutes: number;
  missingFields: string[];
  selectedAgentId: string;
  updateConfig: (config: Partial<Omit<ReturnVisitState, 'updateConfig'>>) => void;
}

export const useReturnVisitStore = create<ReturnVisitState>()(
  persist(
    (set) => ({
      noReplyMinutes: 30,
      missingFields: ['phone', 'wechat'],
      selectedAgentId: 'agent-1',
      updateConfig: (config) => set((state) => ({ ...state, ...config })),
    }),
    {
      name: 'return-visit-storage',
    }
  )
);
