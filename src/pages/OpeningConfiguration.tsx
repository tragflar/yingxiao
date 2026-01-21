import React, { useState } from 'react';
import { Clock, MessageSquare, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { useOpeningStore } from '../store/useOpeningStore';

const OpeningConfiguration: React.FC = () => {
  const { rules, addRule, updateRule, deleteRule } = useOpeningStore();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // Since we are using Zustand persist, data is already in local storage.
    // This button essentially acts as a visual confirmation for the user.
    // In a real app, this might trigger an API call.
    console.log('Saved Opening Rules:', rules);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">开场配置</h2>
          <p className="text-slate-500 text-sm mt-1">配置用户进入私信窗口后的自动回复规则</p>
        </div>
        <button
          onClick={addRule}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          新增规则
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={rule.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Rule Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                开场规则 #{index + 1}
              </h3>
              {rules.length > 1 && (
                <button 
                  onClick={() => deleteRule(rule.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  title="删除规则"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Condition: Time */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Clock size={16} className="text-blue-600" />
                  触发时间
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">用户进入窗口超过</span>
                  <div className="relative flex-1 max-w-[120px]">
                    <input
                      type="number"
                      min="1"
                      value={rule.minutes}
                      onChange={(e) => updateRule(rule.id, { minutes: parseInt(e.target.value) || 0 })}
                      className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">分钟</span>
                  </div>
                  <span className="text-sm text-slate-600">未发送消息</span>
                </div>
                <p className="text-xs text-slate-400">
                  当用户进入私信窗口且在此期间内没有发送任何消息时触发。
                </p>
              </div>

              {/* Action: Message Content */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MessageSquare size={16} className="text-purple-600" />
                  主动发送内容
                </label>
                <div className="relative">
                  <textarea
                    value={rule.message}
                    onChange={(e) => updateRule(rule.id, { message: e.target.value })}
                    placeholder="请输入要自动发送的消息内容..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow resize-none"
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-slate-400">
                    {rule.message.length} 字
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">暂无开场规则，请点击上方“新增规则”添加</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 right-0 left-64 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm active:scale-95"
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaved ? '已保存所有配置' : '保存所有配置'}
        </button>
      </div>
      <div className="h-16"></div> {/* Spacer for fixed footer */}
    </div>
  );
};

export default OpeningConfiguration;
