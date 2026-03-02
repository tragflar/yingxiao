import React, { useState, useMemo } from 'react';
import { Users, MessageSquare, Target, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, ArrowUpDown, ChevronDown, ChevronRight, Search, Filter } from 'lucide-react';

// Mock Data for Daily Trends
const DAILY_STATS = [
  { date: '01-01', receptions: 120, leads: 15 },
  { date: '01-02', receptions: 132, leads: 18 },
  { date: '01-03', receptions: 101, leads: 12 },
  { date: '01-04', receptions: 134, leads: 20 },
  { date: '01-05', receptions: 90, leads: 8 },
  { date: '01-06', receptions: 230, leads: 35 },
  { date: '01-07', receptions: 210, leads: 30 },
];

interface SourceDetail {
  source: string;
  incoming: number;
  opening: number;
  leads: number;
}

interface AgentPerformance {
  id: string;
  name: string;
  incoming: number;
  opening: number;
  leads: number;
  rate: string;
  openingRate: string;
  details: SourceDetail[];
}

interface LivePerformance {
  id: string;
  name: string; // Live Room Name / Topic
  accountName: string; // Douyin Account
  incoming: number;
  opening: number;
  leads: number;
}

// Mock Data for Live Performance
const LIVE_PERFORMANCE_BASE: LivePerformance[] = [
  { id: 'live-1', name: '双11超级福利夜', accountName: '品牌主账号-美妆', incoming: 8500, opening: 7200, leads: 950 },
  { id: 'live-2', name: '秋季新品发布会', accountName: '品牌主账号-服饰', incoming: 6200, opening: 5400, leads: 680 },
  { id: 'live-3', name: '华东大区专场', accountName: '分销商账号-华东', incoming: 4100, opening: 3600, leads: 420 },
  { id: 'live-4', name: '深夜宠粉专场', accountName: '分销商账号-华南', incoming: 3800, opening: 3200, leads: 350 },
  { id: 'live-5', name: '周末狂欢购', accountName: '品牌主账号-美妆', incoming: 5600, opening: 4900, leads: 600 },
];

interface MaterialDetail {
  materialId: string;
  incoming: number;
  opening: number;
  leads: number;
}

interface AdPerformance extends AgentPerformance {
  accountName: string;
  materials?: MaterialDetail[];
}

// Mock Data for Ad Performance
const AD_PERFORMANCE_BASE: AdPerformance[] = [
  {
    id: 'ad-1',
    name: '双11大促通投计划',
    accountName: '抖音-美妆旗舰店',
    incoming: 5400,
    opening: 4800,
    leads: 650,
    rate: '13.5%',
    openingRate: '88.9%',
    materials: [
      { materialId: 'mat-1001', incoming: 2000, opening: 1800, leads: 250 },
      { materialId: 'mat-1002', incoming: 1500, opening: 1300, leads: 200 },
      { materialId: 'mat-1003', incoming: 1900, opening: 1700, leads: 200 },
    ],
    details: [
      { source: '品牌主账号-美妆', incoming: 2000, opening: 1800, leads: 250 },
      { source: 'AI 客服助手 A', incoming: 3400, opening: 3000, leads: 400 },
    ]
  },
  {
    id: 'ad-2',
    name: '朋友圈精选投放',
    accountName: '微信-品牌官方号',
    incoming: 3200,
    opening: 2900,
    leads: 380,
    rate: '13.1%',
    openingRate: '90.6%',
    materials: [
      { materialId: 'mat-2001', incoming: 1600, opening: 1450, leads: 190 },
      { materialId: 'mat-2002', incoming: 1600, opening: 1450, leads: 190 },
    ],
    details: [
      { source: '品牌主账号-服饰', incoming: 1200, opening: 1100, leads: 130 },
      { source: 'AI 客服助手 A', incoming: 2000, opening: 1800, leads: 250 },
    ]
  },
  {
    id: 'ad-3',
    name: '品牌词搜索保护',
    accountName: '百度-企业推广',
    incoming: 1500,
    opening: 1450,
    leads: 280,
    rate: '19.3%',
    openingRate: '96.7%',
    materials: [
      { materialId: 'mat-3001', incoming: 1500, opening: 1450, leads: 280 },
    ],
    details: [
      { source: 'AI 客服助手 A', incoming: 1500, opening: 1450, leads: 280 },
    ]
  },
  {
    id: 'ad-4',
    name: '直播间投流计划A',
    accountName: '抖音-华东分销商',
    incoming: 4200,
    opening: 3800,
    leads: 520,
    rate: '13.7%',
    openingRate: '90.5%',
    materials: [
      { materialId: 'mat-4001', incoming: 2100, opening: 1900, leads: 260 },
      { materialId: 'mat-4002', incoming: 2100, opening: 1900, leads: 260 },
    ],
    details: [
      { source: '分销商账号-华东', incoming: 2200, opening: 2000, leads: 270 },
      { source: '分销商账号-华南', incoming: 2000, opening: 1800, leads: 250 },
    ]
  },
];

// Mock Data for Agent Performance with Details
const AGENT_PERFORMANCE_BASE: AgentPerformance[] = [
  { 
    id: '1', 
    name: '品牌主账号-美妆', 
    incoming: 1250, 
    opening: 1100, 
    leads: 150, 
    rate: '12.0%', 
    openingRate: '88.0%',
    details: [
      { source: 'live', incoming: 600, opening: 550, leads: 90 },
      { source: 'organic', incoming: 400, opening: 350, leads: 40 },
      { source: 'ads', incoming: 250, opening: 200, leads: 20 },
    ]
  },
  { 
    id: '2', 
    name: '品牌主账号-服饰', 
    incoming: 980, 
    opening: 850, 
    leads: 98, 
    rate: '10.0%', 
    openingRate: '86.7%',
    details: [
      { source: 'live', incoming: 500, opening: 450, leads: 60 },
      { source: 'organic', incoming: 300, opening: 250, leads: 25 },
      { source: 'ads', incoming: 180, opening: 150, leads: 13 },
    ]
  },
  { 
    id: '3', 
    name: '分销商账号-华东', 
    incoming: 2100, 
    opening: 1950, 
    leads: 310, 
    rate: '14.7%', 
    openingRate: '92.8%',
    details: [
      { source: 'live', incoming: 1000, opening: 950, leads: 180 },
      { source: 'organic', incoming: 800, opening: 750, leads: 100 },
      { source: 'ads', incoming: 300, opening: 250, leads: 30 },
    ]
  },
  { 
    id: '4', 
    name: '分销商账号-华南', 
    incoming: 1800, 
    opening: 1600, 
    leads: 220, 
    rate: '12.2%', 
    openingRate: '88.9%',
    details: [
      { source: 'live', incoming: 900, opening: 800, leads: 120 },
      { source: 'organic', incoming: 600, opening: 550, leads: 70 },
      { source: 'ads', incoming: 300, opening: 250, leads: 30 },
    ]
  },
  { 
    id: '5', 
    name: 'AI 客服助手 A', 
    incoming: 3500, 
    opening: 3450, 
    leads: 525, 
    rate: '15.0%', 
    openingRate: '98.5%',
    details: [
      { source: 'live', incoming: 1500, opening: 1480, leads: 250 },
      { source: 'organic', incoming: 1200, opening: 1180, leads: 180 },
      { source: 'ads', incoming: 800, opening: 790, leads: 95 },
    ]
  },
];

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('yesterday');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [openingRateSort, setOpeningRateSort] = useState<'top' | 'bottom'>('top');
  const [leadsSort, setLeadsSort] = useState<'top' | 'bottom'>('top');
  const [conversionRateSort, setConversionRateSort] = useState<'top' | 'bottom'>('top');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Separate states for search and filter for each board
  const [agentSearch, setAgentSearch] = useState('');
  const [agentAccountFilter, setAgentAccountFilter] = useState('all');

  const [adSearch, setAdSearch] = useState('');
  const [adAccountFilter, setAdAccountFilter] = useState('all');

  const [liveSearch, setLiveSearch] = useState('');
  const [liveAccountFilter, setLiveAccountFilter] = useState('all');

  // Helper function to adjust data based on date range
  const adjustData = (data: any[], range: string, start?: string, end?: string) => {
    // Multipliers for simulation
    let multiplier = 1;
    
    if (range === 'today') {
      multiplier = 0.14;
    } else if (range === 'yesterday') {
      multiplier = 0.15;
    } else if (range === 'last30') {
      multiplier = 4.2;
    } else if (range === 'custom' && start && end) {
      const startD = new Date(start);
      const endD = new Date(end);
      const diffTime = Math.abs(endD.getTime() - startD.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
      multiplier = Math.max(0.1, diffDays / 7); // Base on weekly rate
    } else {
      multiplier = 1; // last7 default
    }
    
    return data.map(item => {
      const newItem = { ...item };
      
      // Adjust main numbers
      newItem.incoming = Math.floor(item.incoming * multiplier);
      newItem.opening = Math.floor(item.opening * multiplier);
      newItem.leads = Math.floor(item.leads * multiplier);
      
      // Recalculate rates strings if they exist
      if (item.rate && item.openingRate) {
        newItem.rate = newItem.opening > 0 ? ((newItem.leads / newItem.opening) * 100).toFixed(1) + '%' : '0.0%';
        newItem.openingRate = newItem.incoming > 0 ? ((newItem.opening / newItem.incoming) * 100).toFixed(1) + '%' : '0.0%';
      }

      // Adjust details if exist
      if (newItem.details) {
        newItem.details = newItem.details.map((d: any) => ({
          ...d,
          incoming: Math.floor(d.incoming * multiplier),
          opening: Math.floor(d.opening * multiplier),
          leads: Math.floor(d.leads * multiplier),
        }));
      }

      // Adjust materials if exist
      if (newItem.materials) {
        newItem.materials = newItem.materials.map((m: any) => ({
          ...m,
          incoming: Math.floor(m.incoming * multiplier),
          opening: Math.floor(m.opening * multiplier),
          leads: Math.floor(m.leads * multiplier),
        }));
      }
      
      return newItem;
    });
  };

  // Memoized data based on dateRange
  const agentPerformance = useMemo(() => adjustData(AGENT_PERFORMANCE_BASE, dateRange, startDate, endDate), [dateRange, startDate, endDate]);
  const adPerformance = useMemo(() => adjustData(AD_PERFORMANCE_BASE, dateRange, startDate, endDate), [dateRange, startDate, endDate]);
  const livePerformance = useMemo(() => adjustData(LIVE_PERFORMANCE_BASE, dateRange, startDate, endDate), [dateRange, startDate, endDate]);

  // Overview stats based on dateRange
  const overviewStats = useMemo(() => {
    const baseIncoming = 2845;
    const baseOpening = 2560;
    const baseLeads = 342;
    
    let multiplier = 1;
    if (dateRange === 'today') {
      multiplier = 0.14;
    } else if (dateRange === 'yesterday') {
      multiplier = 0.15;
    } else if (dateRange === 'last30') {
      multiplier = 4.2;
    } else if (dateRange === 'custom' && startDate && endDate) {
      const startD = new Date(startDate);
      const endD = new Date(endDate);
      const diffTime = Math.abs(endD.getTime() - startD.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      multiplier = Math.max(0.1, diffDays / 7);
    } else {
      multiplier = 1;
    }
    
    const incoming = Math.floor(baseIncoming * multiplier);
    const opening = Math.floor(baseOpening * multiplier);
    const leads = Math.floor(baseLeads * multiplier);
    const conversionRate = opening > 0 ? ((leads / opening) * 100).toFixed(1) + '%' : '0.0%';

    return { incoming, opening, leads, conversionRate };
  }, [dateRange, startDate, endDate]);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'live': return '直播';
      case 'organic': return '自然流';
      case 'ads': return '短视频';
      default: return source;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">数据看板</h2>
        <div className="flex flex-wrap items-center gap-2">
          {dateRange === 'custom' && (
             <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm border-none outline-none text-slate-600 bg-transparent"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm border-none outline-none text-slate-600 bg-transparent"
                />
             </div>
          )}
          <div className="relative flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Calendar size={16} />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-transparent outline-none pr-6 cursor-pointer font-medium text-slate-600"
            >
              <option value="yesterday">昨日</option>
              <option value="last7">最近 7 天</option>
              <option value="last30">最近 30 天</option>
              <option value="custom">自定义时间</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">
                总进线量
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.incoming.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">
                开口数
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.opening.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">
                留资数
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.leads.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Target size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">
                平均转化率
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.conversionRate}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Leads Ranking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">线索数量排行</h3>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button 
                onClick={() => setLeadsSort('top')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  leadsSort === 'top' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                最高
              </button>
              <button 
                onClick={() => setLeadsSort('bottom')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  leadsSort === 'bottom' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                最低
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {agentPerformance.slice(0, 5)
              .sort((a, b) => leadsSort === 'top' ? b.leads - a.leads : a.leads - b.leads)
              .map((agent, index) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    leadsSort === 'top' && index < 3
                      ? index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-700'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800 truncate w-24" title={agent.name}>{agent.name}</div>
                    <div className="text-xs text-slate-500">转化率: {agent.rate}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">{agent.leads}</div>
                  <div className="text-xs text-slate-400">留资数</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Conversion Rate Ranking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">转化率排行</h3>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button 
                onClick={() => setConversionRateSort('top')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  conversionRateSort === 'top' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                最高
              </button>
              <button 
                onClick={() => setConversionRateSort('bottom')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  conversionRateSort === 'bottom' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                最低
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {agentPerformance.slice(0, 5)
              .sort((a, b) => {
                const rateA = parseFloat(a.rate);
                const rateB = parseFloat(b.rate);
                return conversionRateSort === 'top' ? rateB - rateA : rateA - rateB;
              })
              .map((agent, index) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    conversionRateSort === 'top' && index < 3
                      ? index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-700'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800 truncate w-24" title={agent.name}>{agent.name}</div>
                    <div className="text-xs text-slate-500">留资: {agent.leads}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-600">{agent.rate}</div>
                  <div className="text-xs text-slate-400">留资转化率</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Opening Rate Ranking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">开口率排行</h3>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button 
                onClick={() => setOpeningRateSort('top')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  openingRateSort === 'top' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                最高
              </button>
              <button 
                onClick={() => setOpeningRateSort('bottom')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  openingRateSort === 'bottom' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                最低
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {agentPerformance.slice(0, 5)
              .sort((a, b) => {
                const rateA = parseFloat(a.openingRate);
                const rateB = parseFloat(b.openingRate);
                return openingRateSort === 'top' ? rateB - rateA : rateA - rateB;
              })
              .map((agent, index) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    openingRateSort === 'top' && index < 3
                      ? index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-700'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800 truncate w-24" title={agent.name}>{agent.name}</div>
                    <div className="text-xs text-slate-500 transform scale-90 origin-left">
                      进线: {agent.incoming} | 开口: {agent.opening}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">{agent.openingRate}</div>
                  <div className="text-xs text-slate-400">开口率</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Agent Performance Board */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">客服账号转化详情</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="搜索名称..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={agentAccountFilter}
                onChange={(e) => setAgentAccountFilter(e.target.value)}
                className="pl-9 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[140px]"
              >
                <option value="all">全部账号</option>
                {Array.from(new Set(AGENT_PERFORMANCE_BASE.map(i => i.name))).map(account => (
                  <option key={account} value={account}>{account}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">账号名称</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">进线量 (Incoming)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">开口量 (Opening)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">开口率</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资量 (Lead)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资转化率</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">进线留咨率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentPerformance
                .filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(agentSearch.toLowerCase());
                  const matchesAccount = agentAccountFilter === 'all' || item.name === agentAccountFilter;
                  return matchesSearch && matchesAccount;
                })
                .map((item) => {
                const openingRate = ((item.opening / item.incoming) * 100).toFixed(1) + '%';
                const leadConversionRate = ((item.leads / item.opening) * 100).toFixed(1) + '%';
                const incomingLeadRate = ((item.leads / item.incoming) * 100).toFixed(1) + '%';
                const isExpanded = expandedRows.has(item.id);
                
                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
                      onClick={() => toggleRow(item.id)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                        {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-right">{item.incoming.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">{item.opening.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-blue-600">{openingRate}</td>
                      <td className="px-6 py-4 text-right font-medium">{item.leads}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">{leadConversionRate}</td>
                      <td className="px-6 py-4 text-right text-purple-600 font-bold">{incomingLeadRate}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={7} className="px-6 py-0">
                          <div className="border-t border-slate-100 my-2">
                            <table className="w-full text-sm">
                              <tbody>
                                {item.details.map((detail, idx) => {
                                  const detailOpeningRate = ((detail.opening / detail.incoming) * 100).toFixed(1) + '%';
                                  const detailLeadConversionRate = ((detail.leads / detail.opening) * 100).toFixed(1) + '%';
                                  const detailIncomingLeadRate = ((detail.leads / detail.incoming) * 100).toFixed(1) + '%';
                                  
                                  return (
                                    <tr key={idx} className="border-b border-slate-100 last:border-0 text-slate-500">
                                      <td className="py-3 pl-8 flex items-center gap-2 w-[200px]">
                                        <div className={`w-2 h-2 rounded-full ${
                                            detail.source === 'live' ? 'bg-purple-400' :
                                            detail.source === 'organic' ? 'bg-green-400' : 'bg-blue-400'
                                        }`}></div>
                                        {getSourceLabel(detail.source)}
                                      </td>
                                      <td className="py-3 text-right w-[150px]">{detail.incoming.toLocaleString()}</td>
                                      <td className="py-3 text-right w-[150px]">{detail.opening.toLocaleString()}</td>
                                      <td className="py-3 text-right w-[120px]">{detailOpeningRate}</td>
                                      <td className="py-3 text-right w-[120px]">{detail.leads}</td>
                                      <td className="py-3 text-right w-[150px]">{detailLeadConversionRate}</td>
                                      <td className="py-3 text-right w-[150px]">{detailIncomingLeadRate}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Ad Performance Board */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">短视频转化详情</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="搜索名称..."
                value={adSearch}
                onChange={(e) => setAdSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={adAccountFilter}
                onChange={(e) => setAdAccountFilter(e.target.value)}
                className="pl-9 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[140px]"
              >
                <option value="all">全部账号</option>
                {Array.from(new Set(AD_PERFORMANCE_BASE.map(i => i.accountName))).map(account => (
                  <option key={account} value={account}>{account}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">短视频计划</th>
                <th className="px-6 py-4 font-semibold text-slate-800">抖音账号</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">进线量 (Incoming)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">开口量 (Opening)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">开口率</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资量 (Lead)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资转化率</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">进线留咨率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adPerformance
                .filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(adSearch.toLowerCase());
                  const matchesAccount = adAccountFilter === 'all' || item.accountName === adAccountFilter;
                  return matchesSearch && matchesAccount;
                })
                .map((item) => {
                const openingRate = ((item.opening / item.incoming) * 100).toFixed(1) + '%';
                const leadConversionRate = ((item.leads / item.opening) * 100).toFixed(1) + '%';
                const incomingLeadRate = ((item.leads / item.incoming) * 100).toFixed(1) + '%';
                const isExpanded = expandedRows.has(item.id);
                
                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
                      onClick={() => toggleRow(item.id)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                        {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                        {item.name}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{item.accountName}</td>
                      <td className="px-6 py-4 text-right">{item.incoming.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">{item.opening.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-blue-600">{openingRate}</td>
                      <td className="px-6 py-4 text-right font-medium">{item.leads}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-bold">{leadConversionRate}</td>
                      <td className="px-6 py-4 text-right text-purple-600 font-bold">{incomingLeadRate}</td>
                    </tr>
                    {isExpanded && item.materials && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={8} className="px-6 py-0">
                          <div className="border-t border-slate-100 my-2">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-100/50">
                                <tr className="text-slate-500">
                                  <th className="py-2 pl-8 text-left font-medium w-[200px]">短视频ID</th>
                                  <th className="py-2 text-right font-medium w-[150px]">进线量</th>
                                  <th className="py-2 text-right font-medium w-[150px]">开口量</th>
                                  <th className="py-2 text-right font-medium w-[120px]">开口率</th>
                                  <th className="py-2 text-right font-medium w-[120px]">留资量</th>
                                  <th className="py-2 text-right font-medium w-[150px]">留资转化率</th>
                                  <th className="py-2 text-right font-medium w-[150px]">进线留咨率</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.materials.map((material, idx) => {
                                  const materialOpeningRate = ((material.opening / material.incoming) * 100).toFixed(1) + '%';
                                  const materialLeadConversionRate = ((material.leads / material.opening) * 100).toFixed(1) + '%';
                                  const materialIncomingLeadRate = ((material.leads / material.incoming) * 100).toFixed(1) + '%';
                                  
                                  return (
                                    <tr key={idx} className="border-b border-slate-100 last:border-0 text-slate-500">
                                      <td className="py-3 pl-8 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                        {material.materialId}
                                      </td>
                                      <td className="py-3 text-right">{material.incoming.toLocaleString()}</td>
                                      <td className="py-3 text-right">{material.opening.toLocaleString()}</td>
                                      <td className="py-3 text-right">{materialOpeningRate}</td>
                                      <td className="py-3 text-right">{material.leads}</td>
                                      <td className="py-3 text-right">{materialLeadConversionRate}</td>
                                      <td className="py-3 text-right">{materialIncomingLeadRate}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Live Performance Board */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">直播转化详情</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="搜索名称..."
                value={liveSearch}
                onChange={(e) => setLiveSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={liveAccountFilter}
                onChange={(e) => setLiveAccountFilter(e.target.value)}
                className="pl-9 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[140px]"
              >
                <option value="all">全部账号</option>
                {Array.from(new Set(LIVE_PERFORMANCE_BASE.map(i => i.accountName))).map(account => (
                  <option key={account} value={account}>{account}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">抖音账号</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">进线量 (Incoming)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">开口量 (Opening)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">开口率</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资量 (Lead)</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资转化率</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">进线留咨率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {livePerformance
                .filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(liveSearch.toLowerCase());
                  const matchesAccount = liveAccountFilter === 'all' || item.accountName === liveAccountFilter;
                  return matchesSearch && matchesAccount;
                })
                .map((item) => {
                const openingRate = ((item.opening / item.incoming) * 100).toFixed(1) + '%';
                const leadConversionRate = ((item.leads / item.opening) * 100).toFixed(1) + '%';
                const incomingLeadRate = ((item.leads / item.incoming) * 100).toFixed(1) + '%';
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.accountName}</td>
                    <td className="px-6 py-4 text-right">{item.incoming.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{item.opening.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-blue-600">{openingRate}</td>
                    <td className="px-6 py-4 text-right font-medium">{item.leads}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-bold">{leadConversionRate}</td>
                    <td className="px-6 py-4 text-right text-purple-600 font-bold">{incomingLeadRate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
