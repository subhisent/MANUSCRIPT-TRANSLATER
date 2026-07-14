import React from 'react';
import { ScanRecord, PageType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  records: ScanRecord[];
  onNavigate: (page: PageType) => void;
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ records, onNavigate, t }) => {
  const stats = [
    { label: t.dashboard?.scanned || "Scanned", value: records.length, icon: '📄', color: 'bg-teal-600' },
    { label: t.dashboard?.storage || "Storage", value: `${(records.length * 0.4).toFixed(1)} MB`, icon: '💾', color: 'bg-teal-700' },
    { label: t.dashboard?.accuracy || "Accuracy", value: '98.4%', icon: '🎯', color: 'bg-teal-800' },
    { label: t.dashboard?.translations || "Translations", value: records.filter(r => r.translatedText).length, icon: '🌐', color: 'bg-emerald-800' },
  ];

  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 9 },
    { name: 'Sat', count: 15 },
    { name: 'Sun', count: 10 },
  ];

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t.dashboard?.title || "Vault Overview"}</h2>
          <p className="text-teal-700 mt-1 font-bold uppercase tracking-widest text-[10px]">{t.dashboard?.active || "Active Session"}</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('upload')}
          className="bg-teal-700 hover:bg-teal-600 px-8 py-4 rounded-2xl font-black text-white flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg shadow-teal-900/20 border border-teal-600/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span className="uppercase tracking-widest text-xs">{t.dashboard?.new || "New Digitization"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 md:p-8 rounded-[2rem] card-3d border border-primary-10">
            <div className="flex items-center justify-between mb-6">
              <span className={`p-3 rounded-2xl text-3xl ${stat.color} bg-opacity-15 border border-primary-10`}>{stat.icon}</span>
              <span className="text-teal-800 text-xs font-black uppercase tracking-tighter bg-primary-05 px-2 py-1 rounded-lg">+12% Gain</span>
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-3xl md:text-4xl font-black mt-2 text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 glass p-6 md:p-10 rounded-[2.5rem] border border-slate-200 min-h-[380px] md:min-h-[450px]">
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-8 md:mb-10 flex items-center space-x-3 uppercase tracking-widest">
            <span className="w-2 h-8 bg-teal-700 rounded-full"></span>
            <span>{t.dashboard?.velocity || "Archive Velocity"}</span>
          </h3>
          <div className="h-64 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,23,42,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700, fontSize: 10 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700, fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(15,118,110,0.3)', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#0f766e', fontWeight: 800 }}
                  labelStyle={{ color: '#0f172a', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="count" stroke="#0f766e" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-slate-200 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 group card-3d">
          <div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dashed border-teal-700/25 flex items-center justify-center bg-teal-700/5 group-hover:border-teal-700/50 transition-all duration-700 cursor-pointer p-4"
            onClick={() => onNavigate('upload')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('upload')}
          >
            <div className="w-full h-full rounded-full bg-teal-700/10 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform duration-700">
              <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">{t.dashboard?.rapid || "Rapid Indexing"}</h3>
            <p className="text-slate-600 mt-3 text-sm px-2 leading-relaxed font-medium">Inject historical assets directly into the neural recognition pipeline.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="w-full py-5 bg-slate-100 hover:bg-teal-700/10 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] border border-teal-700/20 text-teal-800"
          >
            {t.dashboard?.deploy || "Deploy Archivist"}
          </button>
        </div>
      </div>

      <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-8 md:mb-10 flex items-center space-x-3 uppercase tracking-widest">
          <span className="w-2 h-8 bg-teal-700 rounded-full"></span>
          <span>{t.dashboard?.expedition || "Expedition Records"}</span>
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                <th className="pb-6 pl-2">Asset ID</th>
                <th className="pb-6">Archetype</th>
                <th className="pb-6 text-center">Commit Date</th>
                <th className="pb-6 text-center">Index Status</th>
                <th className="pb-6 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.slice(0, 5).map((record) => (
                <tr key={record.id} className="group hover:bg-teal-700/5 transition-all">
                  <td className="py-6 pl-2 font-mono text-xs text-teal-800 font-black">{record.id}</td>
                  <td className="py-6 font-bold text-sm text-slate-900">{record.type}</td>
                  <td className="py-6 text-slate-600 text-xs font-bold text-center">{new Date(record.timestamp).toLocaleDateString()}</td>
                  <td className="py-6 text-center">
                    <span className="px-3 py-1 bg-teal-700/10 text-teal-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-700/20">Archived</span>
                  </td>
                  <td className="py-6 text-right pr-2">
                    <button type="button" className="text-slate-600 hover:text-teal-800 transition-colors p-2" aria-label="View record">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-600 italic font-medium">No historical assets discovered yet. Initializing discovery...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
