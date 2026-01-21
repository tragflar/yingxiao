import React, { useState } from 'react';
import { Clock, AlertCircle, Bot, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { MOCK_AGENTS } from '../store/useConfigStore';

interface ReturnRule {
  id: string;
  noReplyMinutes: number;
  missingFields: string[];
  selectedAgentId: string;
}

const ReturnVisitRules: React.FC = () => {
  const [rules, setRules] = useState<ReturnRule[]>([
    { id: '1', noReplyMinutes: 30, missingFields: ['phone'], selectedAgentId: MOCK_AGENTS[0].id }
  ]);
  const [isSaved, setIsSaved] = useState(false);

  const handleAddRule = () => {
    const newRule: ReturnRule = {
      id: Date.now().toString(),
      noReplyMinutes: 30,
      missingFields: [],
      selectedAgentId: MOCK_AGENTS[0].id
    };
    setRules([...rules, newRule]);
  };

  const handleDeleteRule = (id: string) => {
    if (rules.length > 1) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const updateRule = (id: string, field: keyof ReturnRule, value: any) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleSave = () => {
    // Save logic here (e.g. API call or Store update)
    console.log('Saved Rules:', rules);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">回访规则配置</h2>
          <p className="text-slate-500 text-sm mt-1">配置自动回访策略，挽回潜在流失客户</p>
        </div>
        <button
          onClick={handleAddRule}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          新增规则
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={rule.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
            {/* Rule Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                回访规则 #{index + 1}
              </h3>
              {rules.length > 1 && (
                <button 
                  onClick={() => handleDeleteRule(rule.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  title="删除规则"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Condition 1: Time */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" />
                  触发时间
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">用户超过</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      value={rule.noReplyMinutes}
                      onChange={(e) => updateRule(rule.id, 'noReplyMinutes', parseInt(e.target.value) || 0)}
                      className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">分钟</span>
                  </div>
                  <span className="text-sm text-slate-600">未回复</span>
                </div>
              </div>

              {/* Condition 2: Missing Fields (Select) */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <AlertCircle size={16} className="text-orange-500" />
                  缺失字段 (多选)
                </label>
                <div className="relative">
                   <select
                    multiple
                    value={rule.missingFields}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      updateRule(rule.id, 'missingFields', selectedOptions);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[42px] bg-white"
                    size={3} // Show multiple lines
                  >
                    <option value="name">姓名</option>
                    <option value="phone">手机号</option>
                    <option value="wechat">微信号</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-1">按住 Ctrl/Cmd 可多选</p>
                </div>
              </div>

              {/* Action: AI Model (Select) */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Bot size={16} className="text-purple-600" />
                  选择回访大模型
                </label>
                <select
                  value={rule.selectedAgentId}
                  onChange={(e) => updateRule(rule.id, 'selectedAgentId', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                >
                  {MOCK_AGENTS.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                {rule.selectedAgentId && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                    {MOCK_AGENTS.find(a => a.id === rule.selectedAgentId)?.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 right-0 left-64 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm active:scale-95"
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaved ? '已保存所有规则' : '保存所有规则'}
        </button>
      </div>
      <div className="h-16"></div> {/* Spacer for fixed footer */}
    </div>
  );
};

export default ReturnVisitRules;
