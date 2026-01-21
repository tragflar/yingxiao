import React, { useState } from 'react';
import { Search, Plus, MessageCircle, Radio, PlayCircle, MoreHorizontal, X, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';

interface OutreachPlan {
  id: string;
  name: string;
  type: 'comment' | 'live';
  content: string;
  createdAt: string;
  reachedCount: number;
  leadCount: number;
  status: 'active' | 'closed';
}

const INITIAL_PLANS: OutreachPlan[] = [
  {
    id: '1',
    name: '双11预热评论触达',
    type: 'comment',
    content: '亲，看到您对我们的产品感兴趣，双11预热活动正在进行中，现在预定享额外优惠哦！',
    createdAt: '2023-10-20 14:30',
    reachedCount: 1250,
    leadCount: 45,
    status: 'active'
  },
  {
    id: '2',
    name: '晚间直播间弹幕跟进',
    type: 'live',
    content: '感谢关注！点击下方链接领取专属粉丝福利，不要错过哦~',
    createdAt: '2023-10-21 19:00',
    reachedCount: 3400,
    leadCount: 120,
    status: 'active'
  },
  {
    id: '3',
    name: '新品发布意向用户回访',
    type: 'comment',
    content: '您好，我们注意到您对新品很感兴趣，现邀请您成为首批体验官...',
    createdAt: '2023-10-15 10:00',
    reachedCount: 800,
    leadCount: 20,
    status: 'closed'
  }
];

const UserOutreach: React.FC = () => {
  const [plans, setPlans] = useState<OutreachPlan[]>(INITIAL_PLANS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanType, setNewPlanType] = useState<'comment' | 'live'>('comment');
  const [newPlanContent, setNewPlanContent] = useState('');

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePlan = () => {
    if (!newPlanName.trim() || !newPlanContent.trim()) return;

    if (isEditMode && editingId) {
      setPlans(plans.map(plan => 
        plan.id === editingId 
          ? { ...plan, name: newPlanName, type: newPlanType, content: newPlanContent }
          : plan
      ));
    } else {
      const newPlan: OutreachPlan = {
        id: Date.now().toString(),
        name: newPlanName,
        type: newPlanType,
        content: newPlanContent,
        createdAt: new Date().toLocaleString(),
        reachedCount: 0,
        leadCount: 0,
        status: 'active'
      };
      setPlans([newPlan, ...plans]);
    }
    closeModal();
  };

  const handleEditPlan = (plan: OutreachPlan) => {
    setIsEditMode(true);
    setEditingId(plan.id);
    setNewPlanName(plan.name);
    setNewPlanType(plan.type);
    setNewPlanContent(plan.content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewPlanName('');
    setNewPlanType('comment');
    setNewPlanContent('');
  };

  const toggleStatus = (id: string) => {
    setPlans(plans.map(plan => 
      plan.id === id 
        ? { ...plan, status: plan.status === 'active' ? 'closed' : 'active' }
        : plan
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">用户触达</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          创建触达计划
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索计划名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Plan List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">计划名称</th>
                <th className="px-6 py-4 font-semibold text-slate-800">计划类型</th>
                <th className="px-6 py-4 font-semibold text-slate-800">触达内容</th>
                <th className="px-6 py-4 font-semibold text-slate-800">创建时间</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">触达人数</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资人数</th>
                <th className="px-6 py-4 font-semibold text-slate-800">状态</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{plan.name}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        plan.type === 'comment' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-purple-50 text-purple-700 border border-purple-100'
                      }`}>
                        {plan.type === 'comment' ? <MessageCircle size={14} /> : <PlayCircle size={14} />}
                        {plan.type === 'comment' ? '评论触达' : '直播触达'}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={plan.content}>
                      {plan.content}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{plan.createdAt}</td>
                    <td className="px-6 py-4 text-right font-medium">{plan.reachedCount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">{plan.leadCount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active' 
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {plan.status === 'active' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {plan.status === 'active' ? '进行中' : '已关闭'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleEditPlan(plan)}
                          className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1"
                        >
                          <Edit2 size={14} />
                          编辑
                        </button>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <button 
                          onClick={() => toggleStatus(plan.id)}
                          className={`text-sm font-medium hover:underline ${
                            plan.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          {plan.status === 'active' ? '关闭' : '开启'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    暂无触达计划
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? '编辑用户触达计划' : '创建用户触达计划'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  计划名称
                </label>
                <input
                  type="text"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="请输入计划名称，如：双11预热活动"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  触达类型
                </label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    newPlanType === 'comment' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="planType"
                      checked={newPlanType === 'comment'}
                      onChange={() => setNewPlanType('comment')}
                      className="hidden"
                    />
                    <MessageCircle size={18} />
                    <span className="font-medium">评论触达</span>
                  </label>
                  
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    newPlanType === 'live' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="planType"
                      checked={newPlanType === 'live'}
                      onChange={() => setNewPlanType('live')}
                      className="hidden"
                    />
                    <PlayCircle size={18} />
                    <span className="font-medium">直播触达</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  主动私信内容
                </label>
                <textarea
                  value={newPlanContent}
                  onChange={(e) => setNewPlanContent(e.target.value)}
                  placeholder="请输入要发送给意向用户的私信内容..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {newPlanContent.length}/500
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSavePlan}
                disabled={!newPlanName.trim() || !newPlanContent.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isEditMode ? '保存修改' : '创建计划'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOutreach;
