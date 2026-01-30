import React, { useState, useMemo } from 'react';
import { Search, Plus, MessageCircle, Radio, PlayCircle, MoreHorizontal, X, CheckCircle2, AlertCircle, Edit2, Phone, Filter, ChevronDown, ChevronUp } from 'lucide-react';

// --- Interfaces ---

interface DouyinAccount {
  id: string;
  name: string;
  avatar?: string;
}

interface OutreachAccountDetail {
  accountId: string;
  reachedCount: number;
  leadCount: number;
  status: 'active' | 'closed';
}

interface OutreachPlan {
  id: string;
  name: string;
  type: 'comment' | 'live';
  content: string;
  collectPhone: boolean; // New field
  createdAt: string;
  details: OutreachAccountDetail[]; // One plan -> Multiple accounts
}

// --- Mock Data ---

const MOCK_ACCOUNTS: DouyinAccount[] = [
  { id: 'acc1', name: '美妆旗舰店-小美' },
  { id: 'acc2', name: '美妆旗舰店-大白' },
  { id: 'acc3', name: '品牌官方号' },
  { id: 'acc4', name: '新品体验官' },
];

const INITIAL_PLANS: OutreachPlan[] = [
  {
    id: '10001',
    name: '双11预热评论触达',
    type: 'comment',
    content: '亲，看到您对我们的产品感兴趣，双11预热活动正在进行中，现在预定享额外优惠哦！',
    collectPhone: true,
    createdAt: '2023-10-20 14:30',
    details: [
      { accountId: 'acc1', reachedCount: 800, leadCount: 30, status: 'active' },
      { accountId: 'acc2', reachedCount: 450, leadCount: 15, status: 'active' },
    ]
  },
  {
    id: '10002',
    name: '晚间直播间弹幕跟进',
    type: 'live',
    content: '感谢关注！点击下方链接领取专属粉丝福利，不要错过哦~',
    collectPhone: false,
    createdAt: '2023-10-21 19:00',
    details: [
      { accountId: 'acc3', reachedCount: 3400, leadCount: 120, status: 'active' },
    ]
  },
  {
    id: '10003',
    name: '新品发布意向用户回访',
    type: 'comment',
    content: '您好，我们注意到您对新品很感兴趣，现邀请您成为首批体验官...',
    collectPhone: true,
    createdAt: '2023-10-15 10:00',
    details: [
      { accountId: 'acc1', reachedCount: 300, leadCount: 10, status: 'closed' },
      { accountId: 'acc4', reachedCount: 500, leadCount: 10, status: 'closed' },
    ]
  }
];

// --- Helper Types for Table Display ---

interface FlatRow {
  planId: string;
  accountId: string;
  planName: string;
  accountName: string;
  type: 'comment' | 'live';
  content: string;
  collectPhone: boolean;
  createdAt: string;
  reachedCount: number;
  leadCount: number;
  status: 'active' | 'closed';
  originalPlan: OutreachPlan;
}

const UserOutreach: React.FC = () => {
  // State
  const [plans, setPlans] = useState<OutreachPlan[]>(INITIAL_PLANS);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set()); // Format: "planId-accountId"

  // Filter State
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'comment' | 'live'>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null); // We edit Plans, not individual rows usually, but let's see logic

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    type: 'comment' | 'live';
    collectPhone: boolean;
    selectedAccounts: string[];
    content: string;
  }>({
    name: '',
    type: 'comment',
    collectPhone: false,
    selectedAccounts: [],
    content: ''
  });

  // Batch Edit Content Modal
  const [isBatchContentModalOpen, setIsBatchContentModalOpen] = useState(false);
  const [batchContent, setBatchContent] = useState('');
  const [batchCollectPhone, setBatchCollectPhone] = useState(false);

  // --- Derived Data (Flattening) ---

  const flatRows: FlatRow[] = useMemo(() => {
    const rows: FlatRow[] = [];
    plans.forEach(plan => {
      plan.details.forEach(detail => {
        const account = MOCK_ACCOUNTS.find(a => a.id === detail.accountId);
        rows.push({
          planId: plan.id,
          accountId: detail.accountId,
          planName: plan.name,
          accountName: account ? account.name : 'Unknown Account',
          type: plan.type,
          content: plan.content,
          collectPhone: plan.collectPhone,
          createdAt: plan.createdAt,
          reachedCount: detail.reachedCount,
          leadCount: detail.leadCount,
          status: detail.status,
          originalPlan: plan
        });
      });
    });
    return rows;
  }, [plans]);

  // --- Filtering ---

  const filteredRows = useMemo(() => {
    return flatRows.filter(row => {
      const matchName = row.planName.toLowerCase().includes(filterName.toLowerCase());
      const matchType = filterType === 'all' || row.type === filterType;
      const matchAccount = filterAccount === 'all' || row.accountId === filterAccount;
      const matchStatus = filterStatus === 'all' || row.status === filterStatus;
      return matchName && matchType && matchAccount && matchStatus;
    });
  }, [flatRows, filterName, filterType, filterAccount, filterStatus]);

  // --- Handlers ---

  const handleSelectRow = (id: string) => {
    const newSet = new Set(selectedRowIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRowIds(newSet);
  };

  const handleSelectAll = () => {
    const activeRows = filteredRows.filter(r => r.status === 'active');
    // Check if all active rows are selected
    const allActiveSelected = activeRows.length > 0 && activeRows.every(r => selectedRowIds.has(`${r.planId}-${r.accountId}`));
    
    if (allActiveSelected) {
      setSelectedRowIds(new Set());
    } else {
      const allIds = new Set(activeRows.map(r => `${r.planId}-${r.accountId}`));
      setSelectedRowIds(allIds);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingPlanId(null);
    setFormData({
      name: '',
      type: 'comment',
      collectPhone: false,
      selectedAccounts: [],
      content: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan: OutreachPlan) => {
    setIsEditMode(true);
    setEditingPlanId(plan.id);
    setFormData({
      name: plan.name,
      type: plan.type,
      collectPhone: plan.collectPhone,
      selectedAccounts: plan.details.map(d => d.accountId),
      content: plan.content
    });
    setIsModalOpen(true);
  };

  const handleSavePlan = () => {
    if (!formData.name.trim() || !formData.content.trim() || formData.selectedAccounts.length === 0) return;

    if (isEditMode && editingPlanId) {
      // Edit existing plan
      setPlans(plans.map(plan => {
        if (plan.id === editingPlanId) {
          // Preserve existing stats if account still exists, else init new
          const newDetails: OutreachAccountDetail[] = formData.selectedAccounts.map(accId => {
            const existingDetail = plan.details.find(d => d.accountId === accId);
            return existingDetail || {
              accountId: accId,
              reachedCount: 0,
              leadCount: 0,
              status: 'active'
            };
          });
          
          return {
            ...plan,
            name: formData.name,
            type: formData.type,
            collectPhone: formData.collectPhone,
            content: formData.content,
            details: newDetails
          };
        }
        return plan;
      }));
    } else {
      // Create new plan
      const maxId = Math.max(...plans.map(p => parseInt(p.id) || 0), 10000);
      const newId = (maxId + 1).toString();
      
      const newPlan: OutreachPlan = {
        id: newId,
        name: formData.name,
        type: formData.type,
        collectPhone: formData.collectPhone,
        content: formData.content,
        createdAt: new Date().toLocaleString(),
        details: formData.selectedAccounts.map(accId => ({
          accountId: accId,
          reachedCount: 0,
          leadCount: 0,
          status: 'active'
        }))
      };
      setPlans([newPlan, ...plans]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsBatchContentModalOpen(false);
  };

  const handleBatchEditContent = () => {
    if (selectedRowIds.size === 0) return;
    setBatchContent('');
    setBatchCollectPhone(false);
    setIsBatchContentModalOpen(true);
  };

  const saveBatchContent = () => {
    if (!batchContent.trim()) return;
    
    // Find all plans involved in selection
    const involvedPlanIds = new Set<string>();
    selectedRowIds.forEach(rowId => {
      const [planId] = rowId.split('-');
      involvedPlanIds.add(planId);
    });

    setPlans(plans.map(plan => 
      involvedPlanIds.has(plan.id) 
        ? { ...plan, content: batchContent, collectPhone: batchCollectPhone }
        : plan
    ));
    
    setIsBatchContentModalOpen(false);
    setSelectedRowIds(new Set()); // Clear selection
  };

  const toggleRowStatus = (planId: string, accountId: string) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          details: plan.details.map(detail => 
            detail.accountId === accountId
              ? { ...detail, status: detail.status === 'active' ? 'closed' : 'active' }
              : detail
          )
        };
      }
      return plan;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">用户触达</h2>
        <div className="flex gap-3">
          <button 
            onClick={handleBatchEditContent}
            disabled={selectedRowIds.size === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
              selectedRowIds.size > 0 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Edit2 size={18} />
            批量修改 {selectedRowIds.size > 0 ? `(${selectedRowIds.size})` : ''}
          </button>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            创建触达计划
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Plan Name Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="搜索计划名称..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Plan Type Filter */}
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm text-slate-600"
          >
            <option value="all">所有类型</option>
            <option value="comment">评论触达</option>
            <option value="live">直播触达</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        {/* Account Filter */}
        <div className="relative">
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm text-slate-600"
          >
            <option value="all">所有抖音账号</option>
            {MOCK_ACCOUNTS.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm text-slate-600"
          >
            <option value="all">所有状态</option>
            <option value="active">进行中</option>
            <option value="closed">已关闭</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Flattened List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={filteredRows.some(r => r.status === 'active') && filteredRows.filter(r => r.status === 'active').every(r => selectedRowIds.has(`${r.planId}-${r.accountId}`))}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-4 font-semibold text-slate-800 w-16">ID</th>
                <th className="px-4 py-4 font-semibold text-slate-800">抖音账号</th>
                <th className="px-4 py-4 font-semibold text-slate-800">计划名称</th>
                <th className="px-4 py-4 font-semibold text-slate-800">类型</th>
                <th className="px-4 py-4 font-semibold text-slate-800 w-64">触达内容</th>
                <th className="px-4 py-4 font-semibold text-slate-800">收集手机号</th>
                <th className="px-4 py-4 font-semibold text-slate-800 text-right">触达人数</th>
                <th className="px-4 py-4 font-semibold text-slate-800 text-right">留资人数</th>
                <th className="px-4 py-4 font-semibold text-slate-800 text-center">状态</th>
                <th className="px-4 py-4 font-semibold text-slate-800 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => {
                  const rowId = `${row.planId}-${row.accountId}`;
                  return (
                    <tr key={rowId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <input 
                          type="checkbox"
                          disabled={row.status !== 'active'}
                          checked={selectedRowIds.has(rowId)}
                          onChange={() => handleSelectRow(rowId)}
                          className={`rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${row.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-xs font-mono">{row.planId}</td>
                      <td className="px-4 py-4 font-medium text-slate-800">{row.accountName}</td>
                      <td className="px-4 py-4 text-slate-600">{row.planName}</td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                          row.type === 'comment' 
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}>
                          {row.type === 'comment' ? '评论' : '直播'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="truncate w-64 text-slate-500" title={row.content}>
                          {row.content}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {row.collectPhone ? (
                          <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">
                             <CheckCircle2 size={12} className="mr-1"/> 是
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-slate-400 bg-slate-50 px-2 py-0.5 rounded text-xs">
                             否
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right font-medium">{row.reachedCount}</td>
                      <td className="px-4 py-4 text-right font-medium text-green-600">{row.leadCount}</td>
                      <td className="px-4 py-4 text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.status === 'active' 
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {row.status === 'active' ? '进行中' : '已关闭'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => openEditModal(row.originalPlan)}
                             className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                             title="编辑所属计划"
                           >
                             <Edit2 size={16} />
                           </button>
                           {row.status === 'active' && (
                             <button 
                                onClick={() => toggleRowStatus(row.planId, row.accountId)}
                                className="text-xs font-medium px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                             >
                                关闭
                             </button>
                           )}
                         </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                    没有找到匹配的触达记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? '编辑触达计划' : '创建触达计划'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Step 1: Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    计划名称
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="请输入计划名称"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">触达类型</label>
                   {!isEditMode ? (
                     <div className="flex gap-2">
                        <button
                          onClick={() => setFormData({...formData, type: 'comment'})}
                          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                            formData.type === 'comment' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          评论触达
                        </button>
                        <button
                          onClick={() => setFormData({...formData, type: 'live'})}
                          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                            formData.type === 'live' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          直播触达
                        </button>
                     </div>
                   ) : (
                     <div className="w-full py-2 px-4 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${formData.type === 'comment' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                        {formData.type === 'comment' ? '评论触达' : '直播触达'}
                        <span className="text-xs text-slate-400 ml-auto font-normal">不可修改</span>
                     </div>
                   )}
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">是否收集手机号</label>
                   <button
                     onClick={() => setFormData({...formData, collectPhone: !formData.collectPhone})}
                     className={`w-full flex items-center justify-between py-2 px-4 rounded-lg border transition-all ${
                       formData.collectPhone 
                         ? 'border-green-600 bg-green-50 text-green-700' 
                         : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                     }`}
                   >
                     <span className="text-sm font-medium">{formData.collectPhone ? '收集手机号' : '不收集手机号'}</span>
                     <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.collectPhone ? 'bg-green-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${formData.collectPhone ? 'translate-x-5' : 'translate-x-0'}`} />
                     </div>
                   </button>
                </div>
              </div>

              {/* Step 2: Select Accounts (Create Mode Only) */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    选择执行账号 <span className="text-slate-400 font-normal text-xs">(已选 {formData.selectedAccounts.length} 个)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-1">
                    {MOCK_ACCOUNTS.map(acc => (
                      <label 
                        key={acc.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.selectedAccounts.includes(acc.id)
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.selectedAccounts.includes(acc.id)}
                          onChange={() => {
                            const newSelection = formData.selectedAccounts.includes(acc.id)
                              ? formData.selectedAccounts.filter(id => id !== acc.id)
                              : [...formData.selectedAccounts, acc.id];
                            setFormData({...formData, selectedAccounts: newSelection});
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{acc.name}</div>
                        </div>
                        {formData.selectedAccounts.includes(acc.id) && <CheckCircle2 size={16} className="text-blue-600 ml-2" />}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Selected Accounts in Edit Mode (Read Only) */}
              {isEditMode && (
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     执行账号 <span className="text-slate-400 font-normal text-xs">(共 {formData.selectedAccounts.length} 个)</span>
                   </label>
                   <div className="flex flex-wrap gap-2">
                     {formData.selectedAccounts.map(accId => {
                       const acc = MOCK_ACCOUNTS.find(a => a.id === accId);
                       return acc ? (
                         <span key={accId} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                           {acc.name}
                         </span>
                       ) : null;
                     })}
                   </div>
                </div>
              )}

              {/* Step 3: Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  触达内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="请输入触达内容..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-slate-500">支持插入变量：{'{用户昵称}'}</p>
                  <p className="text-xs text-slate-400">{formData.content.length}/500</p>
                </div>
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
                disabled={!formData.name.trim() || !formData.content.trim() || formData.selectedAccounts.length === 0}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isEditMode ? '保存修改' : '创建计划'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Edit Content Modal */}
      {isBatchContentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">批量修改触达内容</h3>
              <p className="text-sm text-slate-500 mb-4">
                将为选中的 <span className="font-bold text-blue-600">{selectedRowIds.size}</span> 个条目所属的计划更新触达内容。
                <br/>
                <span className="text-xs text-amber-500">注意：这将影响该计划下的所有账号任务。</span>
              </p>
              
              <div className="mb-4">
                 <button
                   onClick={() => setBatchCollectPhone(!batchCollectPhone)}
                   className={`w-full flex items-center justify-between py-2 px-4 rounded-lg border transition-all ${
                     batchCollectPhone 
                       ? 'border-green-600 bg-green-50 text-green-700' 
                       : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                   }`}
                 >
                   <span className="text-sm font-medium">{batchCollectPhone ? '收集手机号' : '不收集手机号'}</span>
                   <div className={`w-10 h-5 rounded-full relative transition-colors ${batchCollectPhone ? 'bg-green-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${batchCollectPhone ? 'translate-x-5' : 'translate-x-0'}`} />
                   </div>
                 </button>
              </div>
              
              <textarea
                value={batchContent}
                onChange={(e) => setBatchContent(e.target.value)}
                placeholder="请输入新的触达内容..."
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-4"
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsBatchContentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={saveBatchContent}
                  disabled={!batchContent.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  确认修改
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default UserOutreach;
