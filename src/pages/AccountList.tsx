import React, { useState } from 'react';
import { Plus, Trash2, Search, CheckCircle, AlertCircle } from 'lucide-react';

// Mock Data
const INITIAL_ACCOUNTS = [
  { id: '1', name: '品牌主账号-美妆', accountId: '1001', status: 'active', created: '2023-10-01' },
  { id: '2', name: '品牌主账号-服饰', accountId: '1002', status: 'active', created: '2023-10-05' },
  { id: '3', name: '分销商账号-华东', accountId: '2001', status: 'expired', created: '2023-11-12' },
  { id: '4', name: '分销商账号-华南', accountId: '2002', status: 'active', created: '2023-11-20' },
];

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', accountId: '' });

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.includes(searchTerm) || account.accountId.includes(searchTerm)
  );

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.accountId) return;
    
    setAccounts([
      ...accounts,
      {
        id: Math.random().toString(36).substring(7),
        name: newAccount.name,
        accountId: newAccount.accountId,
        status: 'active',
        created: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewAccount({ name: '', accountId: '' });
    setShowAddModal(false);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('确定要删除该账户吗？')) {
      setAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">账户管理</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          添加账户
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索账户名称或ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Account List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-800">账户名称</th>
              <th className="px-6 py-4 font-semibold text-slate-800">账户ID</th>
              <th className="px-6 py-4 font-semibold text-slate-800">状态</th>
              <th className="px-6 py-4 font-semibold text-slate-800">授权时间</th>
              <th className="px-6 py-4 font-semibold text-slate-800 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{account.name}</td>
                <td className="px-6 py-4 font-mono text-slate-500">{account.accountId}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      account.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {account.status === 'active' ? (
                      <CheckCircle size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    {account.status === 'active' ? '已授权' : '已过期'}
                  </span>
                </td>
                <td className="px-6 py-4">{account.created}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                    title="删除账户"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  未找到匹配的账户
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">添加广告账户</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  账户名称
                </label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="请输入账户名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  账户ID
                </label>
                <input
                  type="text"
                  value={newAccount.accountId}
                  onChange={(e) => setNewAccount({ ...newAccount, accountId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="请输入抖音广告账户ID"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddAccount}
                disabled={!newAccount.name || !newAccount.accountId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;
