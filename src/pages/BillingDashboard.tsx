import React from 'react';
import { CreditCard, Coins, Activity, TrendingUp, AlertCircle, Database } from 'lucide-react';

const BillingDashboard: React.FC = () => {
  // Mock Data for Token Billing
  const tokenStats = {
    total: 10000000,
    used: 2345000,
    balance: 7655000,
    unit: 'Tokens'
  };

  const tokenUsagePercentage = (tokenStats.used / tokenStats.total) * 100;

  // Mock Data for Lead Billing
  const leadStats = {
    acquiredLeads: 1250, // 已获取线索数
    totalPurchased: 5000, // 购买总数
    costPerLead: 15.0, // RMB
    totalCost: 18750.0,
    month: '2023-10'
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">计费看板</h2>
        <p className="text-slate-500 text-sm mt-1">查看大模型Token消耗与线索获取成本</p>
      </div>

      {/* Token Billing Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">大模型 Token 计费</h3>
              <p className="text-sm text-slate-500">实时监控 Token 使用情况与剩余额度</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
            按量计费中
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">总额度 (Total)</p>
            <h4 className="text-2xl font-bold text-slate-800">{tokenStats.total.toLocaleString()}</h4>
            <p className="text-xs text-slate-400 mt-1">{tokenStats.unit}</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-600 mb-1">已使用 (Used)</p>
            <h4 className="text-2xl font-bold text-blue-700">{tokenStats.used.toLocaleString()}</h4>
            <p className="text-xs text-blue-500 mt-1">占总量的 {tokenUsagePercentage.toFixed(1)}%</p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-sm text-green-600 mb-1">剩余余额 (Balance)</p>
            <h4 className="text-2xl font-bold text-green-700">{tokenStats.balance.toLocaleString()}</h4>
            <p className="text-xs text-green-500 mt-1">可用额度充足</p>
          </div>
        </div>
      </div>

      {/* Lead Billing Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Coins size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">线索计费</h3>
              <p className="text-sm text-slate-500">本月线索获取成本统计 ({leadStats.month})</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
             <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
               <Activity size={24} />
             </div>
             <div>
               <p className="text-sm text-slate-500">已获取线索数</p>
               <h4 className="text-2xl font-bold text-slate-800">{leadStats.acquiredLeads.toLocaleString()}</h4>
             </div>
           </div>

           <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
               <CreditCard size={24} />
             </div>
             <div>
               <p className="text-sm text-slate-500">购买总数</p>
               <h4 className="text-2xl font-bold text-slate-800">{leadStats.totalPurchased.toLocaleString()}</h4>
             </div>
           </div>

           <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
             <div className="p-3 bg-green-100 text-green-600 rounded-lg">
               <TrendingUp size={24} />
             </div>
             <div>
               <p className="text-sm text-slate-500">剩余线索额度</p>
               <h4 className="text-2xl font-bold text-slate-800">{(leadStats.totalPurchased - leadStats.acquiredLeads).toLocaleString()}</h4>
             </div>
           </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <AlertCircle size={18} className="text-slate-500 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-700 mb-1">计费说明</p>
              <p>线索计费按照“有效留资”进行统计，重复线索不重复计费。Token 计费包含输入与输出 Token 总和。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
