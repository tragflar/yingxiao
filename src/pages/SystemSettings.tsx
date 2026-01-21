import React, { useState } from 'react';
import { Settings, Bot, Shield, CheckCircle2, ShieldAlert, Plus, X } from 'lucide-react';
import { useConfigStore, MOCK_AGENTS } from '../store/useConfigStore';

const SystemSettings: React.FC = () => {
  const { auditMode, selectedAgentId, setAuditMode, setSelectedAgentId } = useConfigStore();
  
  // Sensitive Words State (Migrated from SensitiveWords.tsx)
  const [words, setWords] = useState<string[]>([
    '极限词', '第一', '顶级', '最', '绝对', '独家', '首选', '无敌'
  ]);
  const [behaviors, setBehaviors] = useState<string[]>([
    '虚假宣传', '诱导点击', '低俗内容', '政治敏感', '侵权行为'
  ]);
  const [inputWord, setInputWord] = useState('');
  const [inputBehavior, setInputBehavior] = useState('');

  const handleAddWord = () => {
    if (!inputWord.trim()) return;
    const newWords = inputWord
      .split(/[,，\s]+/)
      .map(w => w.trim())
      .filter(w => w && !words.includes(w));
    if (newWords.length > 0) {
      setWords([...words, ...newWords]);
      setInputWord('');
    }
  };

  const handleAddBehavior = () => {
    if (!inputBehavior.trim()) return;
    const newBehaviors = inputBehavior
      .split(/[,，\s]+/)
      .map(b => b.trim())
      .filter(b => b && !behaviors.includes(b));
    if (newBehaviors.length > 0) {
      setBehaviors([...behaviors, ...newBehaviors]);
      setInputBehavior('');
    }
  };

  const removeWord = (wordToRemove: string) => {
    setWords(words.filter(word => word !== wordToRemove));
  };

  const removeBehavior = (behaviorToRemove: string) => {
    setBehaviors(behaviors.filter(b => b !== behaviorToRemove));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">AI审核配置</h2>
      </div>

      {/* Audit Strategy Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Shield className="text-blue-600" size={24} />
            审核策略配置
          </h3>
          <p className="text-sm text-slate-500 mt-1 ml-8">
            配置系统默认的素材审核流程和 AI 介入策略
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Audit Mode Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 block">
              审核模式选择
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AI + Platform Option */}
              <div 
                onClick={() => setAuditMode('ai')}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  auditMode === 'ai' 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${auditMode === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Bot size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${auditMode === 'ai' ? 'text-blue-900' : 'text-slate-800'}`}>
                      AI 大模型智能初审
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      素材上传后先由 AI Agent 进行合规性检测，通过后再提交平台人工审核。
                    </p>
                  </div>
                  {auditMode === 'ai' && (
                    <div className="absolute top-4 right-4 text-blue-600">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* Platform Only Option */}
              <div 
                onClick={() => setAuditMode('platform')}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  auditMode === 'platform' 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${auditMode === 'platform' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Settings size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${auditMode === 'platform' ? 'text-blue-900' : 'text-slate-800'}`}>
                      仅平台人工审核
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      跳过 AI 初审，直接将素材提交至广告平台进行审核。
                    </p>
                  </div>
                  {auditMode === 'platform' && (
                    <div className="absolute top-4 right-4 text-blue-600">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Agent Selection (Only visible in AI mode) */}
          {auditMode === 'ai' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <label className="text-sm font-medium text-slate-700 block">
                选择审核 Agent
                <span className="ml-2 text-xs font-normal text-slate-500">
                  (由 Admin 端预置的智能体)
                </span>
              </label>
              
              <div className="relative">
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 text-base border-slate-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border bg-white shadow-sm appearance-none"
                >
                  {MOCK_AGENTS.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Selected Agent Description */}
              {selectedAgentId && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 text-sm text-blue-800">
                  <span className="font-semibold">当前说明：</span>
                  {MOCK_AGENTS.find(a => a.id === selectedAgentId)?.description}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sensitive Words Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="text-orange-600" size={24} />
            违禁词与行为配置
          </h3>
          <p className="text-sm text-slate-500 mt-1 ml-8">
            配置 AI 审核时需要拦截的敏感词汇和违规行为
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Prohibited Words Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                违禁词库
              </h3>
              {words.length > 0 && (
                <button 
                  onClick={() => setWords([])}
                  className="text-xs text-red-500 hover:text-red-700 hover:underline"
                >
                  清空词库
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="输入违禁词，多个词可用逗号或空格分隔"
              />
              <button
                onClick={handleAddWord}
                disabled={!inputWord.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                添加
              </button>
            </div>

            {words.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {words.map((word) => (
                  <span
                    key={word}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200 group hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    {word}
                    <button
                      onClick={() => removeWord(word)}
                      className="text-slate-400 group-hover:text-red-500 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400">
                暂无配置违禁词
              </div>
            )}
          </div>

          {/* Prohibited Behaviors Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                违禁行为库
              </h3>
              {behaviors.length > 0 && (
                <button 
                  onClick={() => setBehaviors([])}
                  className="text-xs text-red-500 hover:text-red-700 hover:underline"
                >
                  清空行为库
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputBehavior}
                onChange={(e) => setInputBehavior(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBehavior()}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="输入违禁行为描述，多个可用逗号或空格分隔"
              />
              <button
                onClick={handleAddBehavior}
                disabled={!inputBehavior.trim()}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                添加
              </button>
            </div>

            {behaviors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {behaviors.map((behavior) => (
                  <span
                    key={behavior}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-800 rounded-full text-sm border border-orange-100 group hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    {behavior}
                    <button
                      onClick={() => removeBehavior(behavior)}
                      className="text-orange-400 group-hover:text-red-500 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400">
                暂无配置违禁行为
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Global Save Button */}
      <div className="fixed bottom-0 right-0 left-64 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-end">
         <button className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center gap-2">
           <CheckCircle2 size={18} />
           保存所有配置
         </button>
      </div>
      <div className="h-16"></div> {/* Spacer for fixed footer */}
    </div>
  );
};

export default SystemSettings;
