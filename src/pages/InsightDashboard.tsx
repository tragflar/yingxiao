import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, TrendingDown, TrendingUp, 
  Search, Filter, ChevronRight, BarChart2, Video, 
  ArrowRight, Store, AlertCircle 
} from 'lucide-react';

// --- Mock Data ---

// Scenario 1: Budget Black Holes (High Incoming, Low Conversion)
const RISKY_STORES = [
  { id: 's1', region: '华东战区', name: '上海静安旗舰店', incoming: 5800, openingRate: '22%', conversionRate: '0.8%', riskLevel: 'high', reason: '进线量极大但开口率极低，疑似“标题党”骗点击' },
  { id: 's2', region: '华南战区', name: '广州天河体验店', incoming: 4200, openingRate: '25%', conversionRate: '1.2%', riskLevel: 'high', reason: '进线量大，开口率低，需检查人群包定向' },
  { id: 's3', region: '华北战区', name: '北京朝阳中心店', incoming: 3500, openingRate: '85%', conversionRate: '1.5%', riskLevel: 'medium', reason: '开口率正常，但留资转化极低，需检查客服话术' },
];

// Scenario 2: Diagnosis (Trend Analysis)
const DIAGNOSIS_DATA = {
  storeName: '深圳南山店',
  trends: [
    { date: '11-01', incoming: 120, leads: 15 },
    { date: '11-02', incoming: 130, leads: 16 },
    { date: '11-03', incoming: 125, leads: 14 },
    { date: '11-04', incoming: 140, leads: 8 }, // Drop starts
    { date: '11-05', incoming: 135, leads: 6 },
    { date: '11-06', incoming: 138, leads: 5 },
    { date: '11-07', incoming: 142, leads: 4 },
  ],
  analysis: {
    status: 'warning',
    issue: '流量正常但留资腰斩',
    rootCause: 'Opening Rate Dropped',
    description: '进线量环比持平(+1.2%)，但留资数环比下跌60%。检测到开口率从 25% 降至 8%，疑似近期投放的广告素材吸引了非目标人群（泛娱乐人群）。',
    suggestion: '建议立即暂停 ID 为 vid-sz-003 的视频投放，并检查其评论区反馈。'
  }
};

// Scenario 3: Top Assets (High Conversion)
const TOP_ASSETS = [
  { id: 'v1', title: '0首付提车回家', tags: ['低门槛', '促销'], incoming: 1200, conversion: '18.5%', store: '杭州西湖店', link: '#' },
  { id: 'v2', title: '沉浸式内饰讲解', tags: ['产品力', '探店'], incoming: 850, conversion: '15.2%', store: '成都高新店', link: '#' },
  { id: 'v3', title: '置换补贴3万起', tags: ['置换', '高意向'], incoming: 600, conversion: '14.8%', store: '南京新街口店', link: '#' },
  { id: 'v4', title: '周末车展现场', tags: ['活动', '氛围'], incoming: 2200, conversion: '12.1%', store: '武汉江汉店', link: '#' },
];

const InsightDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'risk' | 'diagnosis' | 'assets'>('risk');
  const [selectedStore, setSelectedStore] = useState('深圳南山店');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">智能诊断与实战演练</h2>
          <p className="text-slate-500 text-sm mt-1">基于业务场景的自动化分析与决策建议</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'risk' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle size={16} />
            预算黑洞预警
          </button>
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'diagnosis' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown size={16} />
            留资下跌诊断
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'assets' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle size={16} />
            标杆素材库
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
        
        {/* Scenario 1: Budget Black Holes */}
        {activeTab === 'risk' && (
          <div className="p-6 space-y-6">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-800 font-bold">发现 3 家“高耗低效”门店</h3>
                <p className="text-red-600 text-sm mt-1">
                  定义标准：月进线量 &gt; 3000 且 (开口率 &lt; 30% 或 转化率 &lt; 1%)。建议重点排查广告投放人群包。
                </p>
              </div>
            </div>

            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-800">门店名称</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">所属战区</th>
                  <th className="px-4 py-3 font-semibold text-slate-800 text-right">进线量 (消耗)</th>
                  <th className="px-4 py-3 font-semibold text-slate-800 text-right">开口率</th>
                  <th className="px-4 py-3 font-semibold text-slate-800 text-right">转化率</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">诊断建议</th>
                  <th className="px-4 py-3 font-semibold text-slate-800 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RISKY_STORES.map(store => (
                  <tr key={store.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                      <Store size={16} className="text-slate-400" />
                      {store.name}
                    </td>
                    <td className="px-4 py-3">{store.region}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{store.incoming}</td>
                    <td className="px-4 py-3 text-right text-orange-600">{store.openingRate}</td>
                    <td className="px-4 py-3 text-right text-red-600">{store.conversionRate}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs">{store.reason}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-2 py-1 rounded">
                        查看投放详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Scenario 2: Diagnosis */}
        {activeTab === 'diagnosis' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-slate-800">留资异常下跌诊断</h3>
                <select 
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>深圳南山店</option>
                  <option>广州白云店</option>
                </select>
              </div>
              <div className="text-sm text-slate-500">
                检测周期：最近 7 天
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Simulation */}
              <div className="lg:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100 relative h-64 flex items-end justify-between px-8 pb-8 gap-4">
                 {/* Simple Bar Chart Mock */}
                 {DIAGNOSIS_DATA.trends.map((day, idx) => (
                   <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                     <div className="relative w-full flex items-end justify-center gap-1 h-full">
                        <div 
                          className="w-3 bg-blue-200 rounded-t-sm group-hover:bg-blue-300 transition-all relative group-hover:w-4" 
                          style={{ height: `${day.incoming / 2}%` }}
                        >
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100">{day.incoming}</div>
                        </div>
                        <div 
                          className={`w-3 rounded-t-sm transition-all relative group-hover:w-4 ${idx >= 3 ? 'bg-red-400 group-hover:bg-red-500' : 'bg-green-400 group-hover:bg-green-500'}`} 
                          style={{ height: `${day.leads * 3}%` }}
                        >
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-bold opacity-0 group-hover:opacity-100">{day.leads}</div>
                        </div>
                     </div>
                     <span className="text-xs text-slate-500">{day.date}</span>
                   </div>
                 ))}
                 
                 {/* Legend */}
                 <div className="absolute top-4 right-4 flex gap-4 text-xs">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-200"></div>进线量</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400"></div>留资(正常)</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400"></div>留资(异常)</div>
                 </div>
              </div>

              {/* Analysis Panel */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-orange-800 font-bold">
                  <TrendingDown size={20} />
                  诊断结果：{DIAGNOSIS_DATA.analysis.issue}
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Root Cause</span>
                    <p className="text-sm font-medium text-slate-800">{DIAGNOSIS_DATA.analysis.rootCause}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Description</span>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {DIAGNOSIS_DATA.analysis.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-orange-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Action Item</span>
                    <p className="text-sm font-bold text-orange-700 mt-1">
                      {DIAGNOSIS_DATA.analysis.suggestion}
                    </p>
                  </div>
                </div>
                <button className="w-full py-2 bg-white border border-orange-200 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors">
                  一键通知门店店长
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 3: Top Assets */}
        {activeTab === 'assets' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div>
                <h3 className="text-xl font-bold text-emerald-900">全网标杆素材库</h3>
                <p className="text-emerald-700 mt-1">基于全平台实时数据，自动筛选“高进线 + 高转化”的优质视频。</p>
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors">
                导出 SOP 手册
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOP_ASSETS.map((video, idx) => (
                <div key={video.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
                  {/* Thumbnail Mock */}
                  <div className="h-40 bg-slate-100 relative flex items-center justify-center">
                    <Video size={32} className="text-slate-300" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      TOP {idx + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center">
                       <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 shadow-lg">
                         <ArrowRight size={16} className="text-slate-800" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 truncate" title={video.title}>{video.title}</h4>
                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                      {video.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                      <div>
                        <div className="text-slate-400 text-xs">转化率</div>
                        <div className="font-bold text-green-600">{video.conversion}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-xs">进线量</div>
                        <div className="font-medium text-slate-700">{video.incoming}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                      <Store size={12} />
                      {video.store}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightDashboard;
