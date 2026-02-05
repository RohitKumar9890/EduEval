
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ResultsAnalysis: React.FC = () => {
  const data = [
    { name: 'Q1', time: 42, avg: 45 },
    { name: 'Q2', time: 78, avg: 45 },
    { name: 'Q3', time: 92, avg: 45, current: true },
    { name: 'Q4', time: 55, avg: 45 },
    { name: 'Q5', time: 28, avg: 45 },
    { name: 'Q6', time: 45, avg: 45 },
    { name: 'Q7', time: 68, avg: 45 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Main Score Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Results & Analysis</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Mid-term Examination: Advanced Quantum Mechanics (PHYS401)</p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">Completed</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Oct 24, 2023</span>
          </div>
        </div>

        {/* Progress Circle (Simplified CSS implementation) */}
        <div className="relative size-44 flex items-center justify-center">
          <svg className="size-full" viewBox="0 0 100 100">
            <circle className="text-slate-100 dark:text-slate-800" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
            <circle className="text-primary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round" strokeWidth="8" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">85/100</span>
            <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mt-2">Grade A</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Correct', val: '42', diff: '+5% vs average', icon: 'check_circle', iconColor: 'text-green-500', diffColor: 'text-green-600' },
          { label: 'Incorrect', val: '6', diff: '-2% vs previous', icon: 'cancel', iconColor: 'text-red-500', diffColor: 'text-red-500' },
          { label: 'Skipped', val: '2', diff: 'Stable', icon: 'remove_circle', iconColor: 'text-slate-400', diffColor: 'text-slate-500' },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight">{stat.val}</p>
            <p className={`${stat.diffColor} text-[10px] font-bold uppercase tracking-wide`}>{stat.diff}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="mb-8">
          <p className="text-slate-900 dark:text-white text-base font-black uppercase tracking-widest mb-2">Time Spent per Question (seconds)</p>
          <div className="flex items-baseline gap-4">
            <p className="text-primary text-4xl font-black leading-tight">Avg: 45s</p>
            <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              <span>10% faster than class average</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 800 }}
              />
              <Bar dataKey="time" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.current ? '#137fec' : '#137fec33'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Review Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Detailed Question Review</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-4">No.</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Your Answer</th>
                <th className="px-8 py-4">Correct Answer</th>
                <th className="px-8 py-4">Time Taken</th>
                <th className="px-8 py-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
              {[
                { id: 1, status: 'correct', mine: "Schrödinger's Cat", correct: "Schrödinger's Cat", time: '42s' },
                { id: 2, status: 'incorrect', mine: "Heisenberg Principle", correct: "Quantum Entanglement", time: '78s', error: true },
                { id: 3, status: 'correct', mine: "Plancks Constant", correct: "Plancks Constant", time: '92s' },
                { id: 4, status: 'skipped', mine: "Skipped", correct: "Wave-Particle Duality", time: '5s', skip: true },
                { id: 5, status: 'correct', mine: "Superposition", correct: "Superposition", time: '28s' },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-4 font-bold text-slate-900 dark:text-white">{row.id}</td>
                  <td className="px-8 py-4">
                    <span className={`material-symbols-outlined text-base ${row.status === 'correct' ? 'text-green-500' : row.status === 'incorrect' ? 'text-red-500' : 'text-slate-300'}`}>
                      {row.status === 'correct' ? 'check_circle' : row.status === 'incorrect' ? 'cancel' : 'remove_circle'}
                    </span>
                  </td>
                  <td className={`px-8 py-4 ${row.error ? 'text-red-500' : row.skip ? 'italic text-slate-300' : 'text-slate-700 dark:text-slate-300'}`}>{row.mine}</td>
                  <td className="px-8 py-4 text-green-600 dark:text-green-400 font-bold">{row.correct}</td>
                  <td className="px-8 py-4 text-slate-500">{row.time}</td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-primary hover:underline font-black text-[10px] uppercase tracking-wider">View Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-xs text-slate-900 dark:text-white uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <span>Load More Questions</span>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsAnalysis;
