
import React, { useState } from 'react';

const AdminAssessments: React.FC = () => {
  const [tab, setTab] = useState('live');

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Assessments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all online examinations</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-xl h-11 px-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">
            <span className="material-symbols-outlined mr-2 text-xl">download</span>
            Export CSV
          </button>
          <button className="flex items-center justify-center rounded-xl h-11 px-8 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
            <span className="material-symbols-outlined mr-2 text-xl">add</span>
            Create New Test
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-10 overflow-x-auto no-scrollbar">
        {[
          { id: 'live', label: 'Live', count: 12 },
          { id: 'draft', label: 'Draft', count: 4 },
          { id: 'archived', label: 'Archived' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center justify-center pb-4 px-2 border-b-[3px] transition-all whitespace-nowrap
              ${tab === t.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-500 hover:text-slate-700'}
            `}
          >
            <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
            {t.count && (
              <span className={`ml-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                tab === t.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">Date Created</th>
                <th className="px-8 py-5">Submissions</th>
                <th className="px-8 py-5">Avg. Score</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { title: 'Introduction to Psychology 101', sub: 'Midterm Exam • 50 Questions', date: 'Oct 12, 2023', submissions: '142/150', progress: 94, avg: '78.5%', status: 'Active', color: 'green' },
                { title: 'Advanced Macroeconomics', sub: 'Final Quiz • 20 Questions', date: 'Oct 14, 2023', submissions: '85/120', progress: 70, avg: '64.2%', status: 'Active', color: 'green' },
                { title: 'Ethics in AI - Seminar A', sub: 'Assignment • 3 Questions', date: 'Oct 15, 2023', submissions: '20/20', progress: 100, avg: '91.0%', status: 'Closing Soon', color: 'orange' },
                { title: 'Organic Chemistry Practicals', sub: 'Lab Assessment • 10 Questions', date: 'Oct 16, 2023', submissions: '0/45', progress: 0, avg: 'N/A', status: 'Scheduled', color: 'blue' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{row.title}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{row.sub}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-600 dark:text-slate-400">{row.date}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300 w-12">{row.submissions}</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${row.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-black text-slate-900 dark:text-white">{row.avg}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${row.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${row.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                      ${row.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    `}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 4 of 12 live assessments</span>
          <div className="flex gap-3">
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 disabled:opacity-30">Previous</button>
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400">Next</button>
          </div>
        </div>
      </div>
      
      {/* Footer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Completion Rate', val: '88.4%', trend: '+2.4%', trendColor: 'text-green-500', icon: 'trending_up' },
          { label: 'Avg. Time Taken', val: '42m', trend: '+5m', trendColor: 'text-red-500', icon: 'speed' },
          { label: 'Overall Success', val: '74.1%', trend: 'Standard', trendColor: 'text-slate-400', icon: 'star' },
        ].map((card, i) => (
          <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-all hover:border-primary/20">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-xl">{card.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{card.label}</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{card.val}</span>
              <span className={`${card.trendColor} text-[10px] font-black uppercase tracking-widest mb-1`}>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAssessments;
