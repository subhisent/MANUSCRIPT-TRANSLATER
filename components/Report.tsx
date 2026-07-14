import React from 'react';
import { ScanRecord } from '../types';

interface ReportProps {
  records: ScanRecord[];
  t: any;
}

const Report: React.FC<ReportProps> = ({ records, t }) => {
  const exportLogs = () => {
    const content = records.map(r => (
      `ID: ${r.id}\nType: ${r.type}\nDate: ${r.timestamp}\nLanguage: ${r.language || 'N/A'}\nText: ${r.originalText}\n---`
    )).join('\n\n');
    const blob = new Blob([content || 'No records'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronicle-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-left duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">{t.report?.title || "Archival Intelligence"}</h2>
          <p className="text-teal-800 mt-2 font-bold uppercase tracking-[0.3em] text-[10px]">{t.report?.subtitle || "Full Metadata & Retrieval Logs"}</p>
        </div>
        <button
          type="button"
          onClick={exportLogs}
          className="bg-white hover:bg-teal-700/10 px-8 py-4 rounded-[1.5rem] border border-teal-700/25 flex items-center justify-center space-x-3 transition-all font-black text-xs uppercase tracking-widest text-teal-800 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>{t.report?.export || "Export Logs"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-teal-700/15 card-3d">
          <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">{t.report?.total || "Total Archives"}</h4>
          <p className="text-4xl md:text-5xl font-black mt-4 text-slate-900">{records.length}</p>
        </div>
        <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-teal-700/15 card-3d">
          <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">{t.report?.volume || "Storage Volume"}</h4>
          <p className="text-4xl md:text-5xl font-black mt-4 text-slate-900">{(records.length * 0.4).toFixed(1)} MB</p>
        </div>
        <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-teal-700/15 card-3d">
          <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">{t.report?.accuracy || "Index Accuracy"}</h4>
          <p className="text-4xl md:text-5xl font-black mt-4 text-teal-800">99.2%</p>
        </div>
      </div>

      <div className="glass rounded-[2rem] md:rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[720px]">
            <thead>
              <tr className="bg-teal-700/5 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                <th className="px-6 md:px-10 py-6">Timestamp</th>
                <th className="px-6 md:px-10 py-6">Archetype</th>
                <th className="px-6 md:px-10 py-6">Neural Tokens</th>
                <th className="px-6 md:px-10 py-6">Linguistic Target</th>
                <th className="px-6 md:px-10 py-6 text-right">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-teal-700/5 transition-colors group">
                  <td className="px-6 md:px-10 py-6">
                    <div className="text-sm font-black text-slate-900">{new Date(r.timestamp).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{new Date(r.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 md:px-10 py-6">
                    <span className="px-4 py-1.5 bg-teal-700/10 text-teal-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-700/20">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-6 text-xs font-bold text-slate-700">
                    {(r.originalText || '').split(/\s+/).filter(Boolean).length} Glyphs
                  </td>
                  <td className="px-6 md:px-10 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {r.language || 'Autodetect Script'}
                  </td>
                  <td className="px-6 md:px-10 py-6 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([r.originalText || ''], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${r.id}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-teal-800 hover:text-teal-950 text-[10px] font-black uppercase tracking-widest border-b border-teal-700/30 hover:border-teal-800 transition-all"
                    >
                      Pull Artifact
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-slate-600 italic font-medium">Archive history is currently empty. Initialize digitization to generate logs.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
