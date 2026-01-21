import React from 'react';
import { NavLink } from 'react-router-dom';
import { UploadCloud, Image, Users, Settings, ShieldAlert, LayoutDashboard, Send, Repeat, MessageSquarePlus, Wallet } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: '批量上传', path: '/', icon: <UploadCloud size={20} /> },
    { name: '数据看板', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: '计费看板', path: '/billing', icon: <Wallet size={20} /> },
    { name: '用户触达', path: '/outreach', icon: <Send size={20} /> },
    { name: '回访规则配置', path: '/return-visit-rules', icon: <Repeat size={20} /> },
    { name: '开场配置', path: '/opening-config', icon: <MessageSquarePlus size={20} /> },
    { name: '素材管理', path: '/materials', icon: <Image size={20} /> },
    { name: '账户管理', path: '/accounts', icon: <Users size={20} /> },
    { name: 'AI审核配置', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <UploadCloud size={20} />
          </div>
          素材通
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-500 text-sm">
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
