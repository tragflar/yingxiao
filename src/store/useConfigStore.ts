import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Agent {
  id: string;
  name: string;
  description: string;
}

export const MOCK_AGENTS: Agent[] = [
  { id: 'agent-1', name: '通用合规审核助手', description: '适用于大多数通用素材，基于标准广告法进行审核。' },
  { id: 'agent-2', name: '严谨风控审核助手', description: '严格把控风险，适用于医疗、金融等敏感行业素材。' },
  { id: 'agent-3', name: '营销文案优化助手', description: '不仅审核违规，还会对营销文案的吸引力进行评估。' },
];

interface ConfigState {
  auditMode: 'ai' | 'platform';
  selectedAgentId: string;
  setAuditMode: (mode: 'ai' | 'platform') => void;
  setSelectedAgentId: (id: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      auditMode: 'ai', // Default to AI
      selectedAgentId: 'agent-1',
      setAuditMode: (mode) => set({ auditMode: mode }),
      setSelectedAgentId: (id) => set({ selectedAgentId: id }),
    }),
    {
      name: 'system-config',
    }
  )
);
