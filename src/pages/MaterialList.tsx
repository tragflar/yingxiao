import React, { useState } from 'react';
import { Search, Filter, FileImage, FileVideo, CheckCircle2, AlertCircle, Download, ExternalLink, Bot } from 'lucide-react';
import AccountSelect from '../components/AccountSelect';
import { useConfigStore, MOCK_AGENTS } from '../store/useConfigStore';

// Mock Accounts for filter
const MOCK_ACCOUNTS = [
  { id: 'all', name: '全部账户', accountId: '' },
  { id: '1', name: '品牌主账号-美妆', accountId: '1001' },
  { id: '2', name: '品牌主账号-服饰', accountId: '1002' },
  { id: '3', name: '分销商账号-华东', accountId: '2001' },
  { id: '4', name: '分销商账号-华南', accountId: '2002' },
];

// Mock Materials Data
const INITIAL_MATERIALS = Array.from({ length: 20 }).map((_, i) => ({
  id: `m-${i + 1}`,
  name: `2023春季新品推广视频_${i + 1}.mp4`,
  type: i % 3 === 0 ? 'image' : 'video',
  size: Math.floor(Math.random() * 50 * 1024 * 1024), // Random size up to 50MB
  accountId: ['1', '2', '3', '4'][i % 4],
  accountName: ['品牌主账号-美妆', '品牌主账号-服饰', '分销商账号-华东', '分销商账号-华南'][i % 4],
  uploadTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleString(),
  status: Math.random() > 0.1 ? 'success' : 'failed',
  preview: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop'
}));

const MaterialList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [materials] = useState(INITIAL_MATERIALS);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<string>>(new Set());
  
  // Use global config store
  const { auditMode, selectedAgentId } = useConfigStore();
  const selectedAgent = MOCK_AGENTS.find(a => a.id === selectedAgentId);

  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = selectedAccount === 'all' || item.accountId === selectedAccount;
    return matchesSearch && matchesAccount;
  });

  const toggleSelectAll = () => {
    if (selectedMaterialIds.size === filteredMaterials.length) {
      setSelectedMaterialIds(new Set());
    } else {
      setSelectedMaterialIds(new Set(filteredMaterials.map(m => m.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedMaterialIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMaterialIds(newSelected);
  };

  const handleBatchSubmit = () => {
    const count = selectedMaterialIds.size;
    if (count === 0) return;
    
    let modeText = '';
    if (auditMode === 'ai') {
      modeText = `AI 大模型审核 (${selectedAgent?.name || '未知Agent'}) + 平台审核`;
    } else {
      modeText = '仅平台审核';
    }

    alert(`已提交 ${count} 个素材进行审核。\n当前系统配置：${modeText}`);
    
    // Reset selection after action
    setSelectedMaterialIds(new Set());
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">素材管理</h2>
        
        {/* Batch Actions */}
        {selectedMaterialIds.size > 0 && (
          <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm text-blue-800 font-medium">
              已选择 {selectedMaterialIds.size} 项
            </span>
            
            <div className="h-4 w-px bg-blue-200"></div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>当前策略:</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                {auditMode === 'ai' ? (
                  <>
                    <Bot size={16} className="text-blue-600" />
                    AI 智能审核
                    <span className="text-slate-400 text-xs font-normal">
                      ({selectedAgent?.name})
                    </span>
                  </>
                ) : (
                  <>
                    仅平台审核
                  </>
                )}
              </span>
            </div>

            <button
              onClick={handleBatchSubmit}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <CheckCircle2 size={16} />
              批量提审
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索素材名称"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="w-full md:w-64">
           <AccountSelect
            accounts={MOCK_ACCOUNTS.filter(a => a.id !== 'all')}
            value={selectedAccount === 'all' ? '' : selectedAccount}
            onChange={(val) => setSelectedAccount(val)}
            placeholder="筛选账户"
          />
        </div>
        {selectedAccount !== 'all' && (
           <button 
             onClick={() => setSelectedAccount('all')}
             className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
           >
             清除筛选
           </button>
        )}
      </div>

      {/* Material List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  checked={filteredMaterials.length > 0 && selectedMaterialIds.size === filteredMaterials.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 font-semibold text-slate-800 w-20">预览</th>
              <th className="px-6 py-4 font-semibold text-slate-800">素材名称</th>
              <th className="px-6 py-4 font-semibold text-slate-800">所属账户</th>
              <th className="px-6 py-4 font-semibold text-slate-800">大小</th>
              <th className="px-6 py-4 font-semibold text-slate-800">上传时间</th>
              <th className="px-6 py-4 font-semibold text-slate-800">状态</th>
              <th className="px-6 py-4 font-semibold text-slate-800 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMaterials.map((item) => (
              <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${selectedMaterialIds.has(item.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedMaterialIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                    {item.type === 'image' ? (
                       <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                       <FileVideo className="text-slate-400" size={24} />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800 truncate max-w-[200px]" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 uppercase">{item.type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[150px]" title={item.accountName}>
                      {item.accountName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{formatSize(item.size)}</td>
                <td className="px-6 py-4 text-slate-500">{item.uploadTime}</td>
                <td className="px-6 py-4">
                   <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.status === 'success' ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    {item.status === 'success' ? '上传成功' : '上传失败'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="下载">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="查看详情">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMaterials.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                  未找到匹配的素材
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Simple Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
           <span className="text-sm text-slate-500">
             显示 {filteredMaterials.length > 0 ? 1 : 0} 到 {filteredMaterials.length} 条，共 {filteredMaterials.length} 条
           </span>
           <div className="flex gap-2">
             <button disabled className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 disabled:opacity-50">上一页</button>
             <button disabled className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 disabled:opacity-50">下一页</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialList;
