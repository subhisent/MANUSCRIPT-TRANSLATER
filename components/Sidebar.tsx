import React from 'react';
import { PageType } from '../types';

interface SidebarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
  onLogout: () => void;
  t: any;
  mobileOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange, onLogout, t, mobileOpen = false }) => {
  const menuItems = [
    {
      id: 'dashboard', label: t.sidebar.dashboard, icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'upload', label: t.sidebar.upload, icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    },
    {
      id: 'scan', label: t.sidebar.scan, icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      id: 'research', label: t.sidebar.research, icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'voice', label: t.sidebar.voice, icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      id: 'report', label: t.sidebar.report, icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m-9-3h12a2 2 0 012 2v11a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      )
    },
  ];

  return (
    <aside
      className={`w-72 glass h-screen border-r border-primary-10 flex flex-col transition-transform duration-300 z-50
        fixed inset-y-0 left-0 md:static md:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:flex`}
    >
      <div className="p-8 md:p-10 flex items-center space-x-4">
        <div className="bg-primary rounded-2xl p-2.5 shadow-lg primary-glow">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">CHRONICLE</span>
          <p className="text-[10px] font-bold text-primary tracking-[0.2em] -mt-1 uppercase">Archivist</p>
        </div>
      </div>

      <nav className="flex-1 px-6 mt-2 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPageChange(item.id as PageType)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
              activePage === item.id
                ? 'bg-primary-10 text-slate-900 border border-primary-20 shadow-inner'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            {activePage === item.id && (
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full"></div>
            )}
            <span className={`${activePage === item.id ? 'text-primary' : 'text-slate-600 group-hover:text-primary'}`}>
              {item.icon}
            </span>
            <span className="font-semibold text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-red-700 hover:bg-red-50 hover:text-red-800 transition-all duration-300 font-bold text-sm tracking-wide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{t.sidebar.logout || "Logout"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
