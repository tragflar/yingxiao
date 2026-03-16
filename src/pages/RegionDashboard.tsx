import React, { useState, useMemo } from 'react';
import { 
  Users, MessageSquare, Target, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, 
  Map, Building2, Store, ChevronRight, MonitorPlay, Video
} from 'lucide-react';

interface AdVideo {
  id: string;
  name: string;
  incoming: number;
  opening: number;
  leads: number;
  silentLeads?: number; // 静默线索量
}

interface AdAccount {
  id: string;
  name: string;
  platform: 'douyin' | 'kuaishou' | 'video_channel';
  incoming: number;
  opening: number;
  leads: number;
  silentLeads?: number; // 静默线索量
  videos: AdVideo[];
}

// Mock Data for Regions
const REGION_STATS = [
  { 
    id: '1', 
    name: '华东战区', 
    manager: '张三', 
    incoming: 12500, 
    opening: 11000, 
    leads: 1500, 
    silentLeads: 120, // 战区级静默线索
    prevIncoming: 11000, 
    prevOpening: 9500, 
    prevLeads: 1200,
    stores: [
      { 
        id: '101', 
        name: '上海旗舰店', 
        incoming: 5000, 
        opening: 4500, 
        leads: 600, 
        silentLeads: 50, // 门店级静默线索
        prevIncoming: 4200, 
        prevOpening: 3800, 
        prevLeads: 450, 
        accountCount: 12,
        accounts: [
          {
            id: 'acc-101-1',
            name: '上海旗舰店-主号',
            platform: 'douyin',
            incoming: 2500,
            opening: 2200,
            leads: 300,
            silentLeads: 30, // 账号级静默线索
            videos: [
              { id: 'vid-101-1-1', name: '双11预热视频A', incoming: 1000, opening: 900, leads: 120, silentLeads: 15 },
              { id: 'vid-101-1-2', name: '新车上市发布', incoming: 1500, opening: 1300, leads: 180, silentLeads: 15 },
            ]
          },
          {
            id: 'acc-101-2',
            name: '上海旗舰店-福利官',
            platform: 'douyin',
            incoming: 2500,
            opening: 2300,
            leads: 300,
            silentLeads: 20,
            videos: [
              { id: 'vid-101-2-1', name: '限时优惠讲解', incoming: 1200, opening: 1100, leads: 150, silentLeads: 10 },
              { id: 'vid-101-2-2', name: '门店探店Vlog', incoming: 1300, opening: 1200, leads: 150, silentLeads: 10 },
            ]
          }
        ]
      },
      { id: '102', name: '杭州直营店', incoming: 4500, opening: 4000, leads: 550, silentLeads: 40, prevIncoming: 4000, prevOpening: 3500, prevLeads: 450, accountCount: 8, accounts: [] },
      { id: '103', name: '南京体验店', incoming: 3000, opening: 2500, leads: 350, silentLeads: 30, prevIncoming: 2800, prevOpening: 2200, prevLeads: 300, accountCount: 5, accounts: [] },
    ]
  },
  { 
    id: '2', 
    name: '华南战区', 
    manager: '李四', 
    incoming: 9800, 
    opening: 8500, 
    leads: 980, 
    silentLeads: 100,
    prevIncoming: 10500, 
    prevOpening: 9000, 
    prevLeads: 1100,
    stores: [
      { id: '201', name: '广州总店', incoming: 4000, opening: 3500, leads: 400, silentLeads: 45, prevIncoming: 4500, prevOpening: 4000, prevLeads: 500, accountCount: 10, accounts: [] },
      { id: '202', name: '深圳旗舰店', incoming: 3500, opening: 3000, leads: 350, silentLeads: 35, prevIncoming: 3500, prevOpening: 3000, prevLeads: 350, accountCount: 8, accounts: [] },
      { id: '203', name: '厦门分店', incoming: 2300, opening: 2000, leads: 230, silentLeads: 20, prevIncoming: 2500, prevOpening: 2000, prevLeads: 250, accountCount: 4, accounts: [] },
    ]
  },
  { 
    id: '3', 
    name: '华北战区', 
    manager: '王五', 
    incoming: 8500, 
    opening: 7200, 
    leads: 850, 
    silentLeads: 80,
    prevIncoming: 7500, 
    prevOpening: 6500, 
    prevLeads: 700,
    stores: [
      { id: '301', name: '北京体验店', incoming: 4000, opening: 3500, leads: 400, silentLeads: 40, prevIncoming: 3500, prevOpening: 3000, prevLeads: 350, accountCount: 9, accounts: [] },
      { id: '302', name: '天津分店', incoming: 2500, opening: 2000, leads: 250, silentLeads: 25, prevIncoming: 2200, prevOpening: 1800, prevLeads: 200, accountCount: 5, accounts: [] },
      { id: '303', name: '石家庄店', incoming: 2000, opening: 1700, leads: 200, silentLeads: 15, prevIncoming: 1800, prevOpening: 1700, prevLeads: 150, accountCount: 3, accounts: [] },
    ]
  },
  { 
    id: '4', 
    name: '华西战区', 
    manager: '赵六', 
    incoming: 6200, 
    opening: 5400, 
    leads: 620, 
    silentLeads: 60,
    prevIncoming: 5800, 
    prevOpening: 5000, 
    prevLeads: 550,
    stores: [
      { id: '401', name: '成都旗舰店', incoming: 3000, opening: 2600, leads: 300, silentLeads: 30, prevIncoming: 2800, prevOpening: 2400, prevLeads: 280, accountCount: 7, accounts: [] },
      { id: '402', name: '重庆分店', incoming: 2000, opening: 1800, leads: 200, silentLeads: 20, prevIncoming: 1800, prevOpening: 1600, prevLeads: 170, accountCount: 5, accounts: [] },
      { id: '403', name: '西安店', incoming: 1200, opening: 1000, leads: 120, silentLeads: 10, prevIncoming: 1200, prevOpening: 1000, prevLeads: 100, accountCount: 3, accounts: [] },
    ]
  },
  { 
    id: '5', 
    name: '华中战区', 
    manager: '钱七', 
    incoming: 7800, 
    opening: 6800, 
    leads: 780, 
    silentLeads: 70,
    prevIncoming: 7600, 
    prevOpening: 6600, 
    prevLeads: 750,
    stores: [
      { id: '501', name: '武汉总店', incoming: 3500, opening: 3000, leads: 350, silentLeads: 35, prevIncoming: 3400, prevOpening: 2900, prevLeads: 330, accountCount: 8, accounts: [] },
      { id: '502', name: '长沙分店', incoming: 2500, opening: 2200, leads: 250, silentLeads: 25, prevIncoming: 2400, prevOpening: 2100, prevLeads: 240, accountCount: 6, accounts: [] },
      { id: '503', name: '郑州店', incoming: 1800, opening: 1600, leads: 180, silentLeads: 10, prevIncoming: 1800, prevOpening: 1600, prevLeads: 180, accountCount: 4, accounts: [] },
    ]
  },
];

const RegionDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('month'); // Default to month for MoM analysis
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Calculate aggregated stats
  const totalStats = useMemo(() => {
    return REGION_STATS.reduce((acc, curr) => ({
      incoming: acc.incoming + curr.incoming,
      opening: acc.opening + curr.opening,
      leads: acc.leads + curr.leads,
      silentLeads: acc.silentLeads + (curr.silentLeads || 0),
      accountCount: acc.accountCount + curr.stores.reduce((sum, store) => sum + (store.accountCount || 0), 0),
      prevIncoming: acc.prevIncoming + curr.prevIncoming,
      prevOpening: acc.prevOpening + curr.prevOpening,
      prevLeads: acc.prevLeads + curr.prevLeads,
    }), { incoming: 0, opening: 0, leads: 0, silentLeads: 0, accountCount: 0, prevIncoming: 0, prevOpening: 0, prevLeads: 0 });
  }, []);

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return '0.0';
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const overviewStats = {
    incoming: totalStats.incoming,
    incomingGrowth: getGrowthRate(totalStats.incoming, totalStats.prevIncoming),
    opening: totalStats.opening,
    openingGrowth: getGrowthRate(totalStats.opening, totalStats.prevOpening),
    leads: totalStats.leads,
    leadsGrowth: getGrowthRate(totalStats.leads, totalStats.prevLeads),
    conversionRate: ((totalStats.leads / totalStats.opening) * 100).toFixed(1) + '%',
    conversionGrowth: (
      ((totalStats.leads / totalStats.opening) * 100) - 
      ((totalStats.prevLeads / totalStats.prevOpening) * 100)
    ).toFixed(1)
  };

  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set());
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());

  // ... (previous code)

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleStore = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedStores);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedStores(newExpanded);
  };

  const toggleAccount = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAccounts(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">战区看板</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <Calendar size={16} />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none bg-transparent outline-none pr-6 cursor-pointer font-medium text-slate-600"
          >
            <option value="month">本月 (月度环比)</option>
            <option value="quarter">本季度</option>
            <option value="year">本年度</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 pointer-events-none" />
        </div>
      </div>

      {/* Overview Cards - Removed */}
      {/* 
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">总进线量</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.incoming.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-medium flex items-center ${parseFloat(overviewStats.incomingGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(overviewStats.incomingGrowth) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(parseFloat(overviewStats.incomingGrowth))}%
                </span>
                <span className="text-xs text-slate-400">较上月</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">总开口数</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.opening.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-medium flex items-center ${parseFloat(overviewStats.openingGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(overviewStats.openingGrowth) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(parseFloat(overviewStats.openingGrowth))}%
                </span>
                <span className="text-xs text-slate-400">较上月</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">总留资数</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.leads.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-medium flex items-center ${parseFloat(overviewStats.leadsGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(overviewStats.leadsGrowth) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(parseFloat(overviewStats.leadsGrowth))}%
                </span>
                <span className="text-xs text-slate-400">较上月</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Target size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">平均转化率</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{overviewStats.conversionRate}</h3>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-medium flex items-center ${parseFloat(overviewStats.conversionGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(overviewStats.conversionGrowth) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(parseFloat(overviewStats.conversionGrowth))}%
                </span>
                <span className="text-xs text-slate-400">较上月</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Region Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Map size={20} className="text-slate-500" />
            各战区月度数据环比
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">战区/门店</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">抖音账号数</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">进线量</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">环比增长</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">开口量</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">流量精准度</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">环比增长</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资量</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">静默线索</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">环比增长</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">留资转化率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {REGION_STATS.map((region) => {
                const incomingGrowth = getGrowthRate(region.incoming, region.prevIncoming);
                const openingGrowth = getGrowthRate(region.opening, region.prevOpening);
                const leadsGrowth = getGrowthRate(region.leads, region.prevLeads);
                const openingRate = ((region.opening / region.incoming) * 100).toFixed(1) + '%';
                const conversionRate = ((region.leads / region.opening) * 100).toFixed(1) + '%';
                const accountCount = region.stores.reduce((sum, store) => sum + (store.accountCount || 0), 0);
                const isExpanded = expandedRows.has(region.id);
                
                return (
                  <React.Fragment key={region.id}>
                    <tr 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
                      onClick={() => toggleRow(region.id)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                        {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Building2 size={16} />
                        </div>
                        {region.name}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{accountCount}</td>
                      <td className="px-6 py-4 text-right font-medium">{region.incoming.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-right ${parseFloat(incomingGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(incomingGrowth) > 0 ? '+' : ''}{incomingGrowth}%
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{region.opening.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-blue-600 font-medium">{openingRate}</td>
                      <td className={`px-6 py-4 text-right ${parseFloat(openingGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(openingGrowth) > 0 ? '+' : ''}{openingGrowth}%
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">{region.leads.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-orange-600 font-medium">{region.silentLeads || 0}</td>
                      <td className={`px-6 py-4 text-right font-medium ${parseFloat(leadsGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(leadsGrowth) > 0 ? '+' : ''}{leadsGrowth}%
                      </td>
                      <td className="px-6 py-4 text-right text-purple-600 font-bold">{conversionRate}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={9} className="px-6 py-0">
                          <div className="border-t border-slate-100 my-2">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-100/50">
                                <tr className="text-slate-500">
                                  <th className="py-2 pl-12 text-left font-medium">门店名称</th>
                                  <th className="py-2 text-right font-medium w-[100px]">抖音账号数</th>
                                  <th className="py-2 text-right font-medium w-[100px]">进线量</th>
                                  <th className="py-2 text-right font-medium w-[100px]">环比</th>
                                  <th className="py-2 text-right font-medium w-[100px]">开口量</th>
                                  <th className="py-2 text-right font-medium w-[100px]">精准度</th>
                                  <th className="py-2 text-right font-medium w-[100px]">环比</th>
                                  <th className="py-2 text-right font-medium w-[100px]">留资量</th>
                                  <th className="py-2 text-right font-medium w-[100px]">静默</th>
                                  <th className="py-2 text-right font-medium w-[100px]">环比</th>
                                  <th className="py-2 text-right font-medium w-[120px]">转化率</th>
                                </tr>
                              </thead>
                              <tbody>
                                {region.stores.map((store) => {
                                  const storeIncomingGrowth = getGrowthRate(store.incoming, store.prevIncoming);
                                  const storeOpeningGrowth = getGrowthRate(store.opening, store.prevOpening);
                                  const storeLeadsGrowth = getGrowthRate(store.leads, store.prevLeads);
                                  const storeOpeningRate = ((store.opening / store.incoming) * 100).toFixed(1) + '%';
                                  const storeConversionRate = ((store.leads / store.opening) * 100).toFixed(1) + '%';
                                  
                                  return (
                                    <React.Fragment key={store.id}>
                                      <tr 
                                        className={`border-b border-slate-100 last:border-0 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer`}
                                        onClick={(e) => toggleStore(e, store.id)}
                                      >
                                        <td className="py-3 pl-12 flex items-center gap-2 max-w-[200px] whitespace-normal">
                                          {store.accounts && store.accounts.length > 0 ? (
                                            expandedStores.has(store.id) ? 
                                              <ChevronDown size={14} className="text-slate-400 shrink-0" /> : 
                                              <ChevronRight size={14} className="text-slate-400 shrink-0" />
                                          ) : <span className="w-3.5 shrink-0"></span>}
                                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center scale-90 shrink-0">
                                            <Store size={14} />
                                          </div>
                                          <span>{store.name}</span>
                                        </td>
                                        <td className="py-3 text-right">{store.accountCount}</td>
                                        <td className="py-3 text-right">{store.incoming.toLocaleString()}</td>
                                        <td className={`py-3 text-right ${parseFloat(storeIncomingGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {parseFloat(storeIncomingGrowth) > 0 ? '+' : ''}{storeIncomingGrowth}%
                                        </td>
                                        <td className="py-3 text-right">{store.opening.toLocaleString()}</td>
                                        <td className="py-3 text-right text-blue-600">{storeOpeningRate}</td>
                                        <td className={`py-3 text-right ${parseFloat(storeOpeningGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {parseFloat(storeOpeningGrowth) > 0 ? '+' : ''}{storeOpeningGrowth}%
                                        </td>
                                        <td className="py-3 text-right font-medium">{store.leads.toLocaleString()}</td>
                                        <td className="py-3 text-right text-orange-600 font-medium">{store.silentLeads || 0}</td>
                                        <td className={`py-3 text-right font-medium ${parseFloat(storeLeadsGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {parseFloat(storeLeadsGrowth) > 0 ? '+' : ''}{storeLeadsGrowth}%
                                        </td>
                                        <td className="py-3 text-right">{storeConversionRate}</td>
                                      </tr>
                                      {expandedStores.has(store.id) && store.accounts && (
                                        <tr className="bg-slate-50/30">
                                          <td colSpan={9} className="px-6 py-0">
                                            <div className="border-l-2 border-slate-200 ml-16 my-2 pl-4">
                                              <table className="w-full text-sm">
                                                <tbody>
                                                  {store.accounts.map((account) => (
                                                    <React.Fragment key={account.id}>
                                                      <tr 
                                                        className="border-b border-slate-100 last:border-0 text-slate-500 hover:bg-slate-100/50 cursor-pointer"
                                                        onClick={(e) => toggleAccount(e, account.id)}
                                                      >
                                                        <td className="py-2 flex items-center gap-2">
                                                          {account.videos && account.videos.length > 0 ? (
                                                            expandedAccounts.has(account.id) ? 
                                                              <ChevronDown size={14} className="text-slate-400 shrink-0" /> : 
                                                              <ChevronRight size={14} className="text-slate-400 shrink-0" />
                                                          ) : <span className="w-3.5 shrink-0"></span>}
                                                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                                            <MonitorPlay size={12} />
                                                          </div>
                                                          <span className="text-sm">{account.name}</span>
                                                        </td>
                                                        <td className="py-2 text-right w-[100px]"></td>
                                                        <td className="py-2 text-right w-[100px]">{account.incoming.toLocaleString()}</td>
                                                        <td className="py-2 text-right w-[100px] text-slate-400">-</td>
                                                        <td className="py-2 text-right w-[100px]">{account.opening.toLocaleString()}</td>
                                                        <td className="py-2 text-right w-[100px] text-blue-600">{((account.opening / account.incoming) * 100).toFixed(1)}%</td>
                                                        <td className="py-2 text-right w-[100px] text-slate-400">-</td>
                                                        <td className="py-2 text-right w-[100px] font-medium">{account.leads.toLocaleString()}</td>
                                                        <td className="py-2 text-right w-[100px] text-orange-600 font-medium">{account.silentLeads || 0}</td>
                                                        <td className="py-2 text-right w-[100px] text-slate-400">-</td>
                                                        <td className="py-2 text-right w-[120px]">{((account.leads / account.opening) * 100).toFixed(1)}%</td>
                                                      </tr>
                                                      {expandedAccounts.has(account.id) && account.videos && (
                                                        <tr className="bg-slate-50/50">
                                                          <td colSpan={9} className="py-0">
                                                            <div className="border-l-2 border-slate-200 ml-8 my-1 pl-4">
                                                              <table className="w-full text-xs text-slate-400">
                                                                <tbody>
                                                                  {account.videos.map((video) => (
                                                                    <tr key={video.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-100/50">
                                                                      <td className="py-1.5 flex items-center gap-2">
                                                                        <Video size={12} className="shrink-0" />
                                                                        <span>{video.name}</span>
                                                                        <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-400">{video.id}</span>
                                                                      </td>
                                                                      <td className="py-1.5 text-right w-[100px]"></td>
                                                                      <td className="py-1.5 text-right w-[100px]">{video.incoming}</td>
                                                                      <td className="py-1.5 text-right w-[100px]"></td>
                                                                      <td className="py-1.5 text-right w-[100px]">{video.opening}</td>
                                                                      <td className="py-1.5 text-right w-[100px] text-blue-600">{((video.opening / video.incoming) * 100).toFixed(1)}%</td>
                                                                      <td className="py-1.5 text-right w-[100px]"></td>
                                                                      <td className="py-1.5 text-right w-[100px] font-medium">{video.leads}</td>
                                                                      <td className="py-1.5 text-right w-[100px] text-orange-600 font-medium">{video.silentLeads || 0}</td>
                                                                      <td className="py-1.5 text-right w-[100px]"></td>
                                                                      <td className="py-1.5 text-right w-[120px]">{((video.leads / video.opening) * 100).toFixed(1)}%</td>
                                                                    </tr>
                                                                  ))}
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      )}
                                                    </React.Fragment>
                                                  ))}
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
    </div>
  );
};

export default RegionDashboard;
