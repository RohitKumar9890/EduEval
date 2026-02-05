
import React from 'react';
import { User, Question } from '../types';

interface ExamInterfaceProps {
  user: User;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ user }) => {
  const questions: Question[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    status: i + 1 < 5 ? 'answered' : i + 1 === 5 ? 'not-answered' : i + 1 === 6 ? 'marked' : i + 1 === 14 ? 'current' : 'not-visited'
  }));

  const stats = [
    { label: '10 Answered', color: 'bg-green-500' },
    { label: '3 Not Answered', color: 'bg-red-500' },
    { label: '1 Marked for Review', color: 'bg-purple-500' },
    { label: '36 Not Visited', color: 'bg-slate-200 dark:bg-slate-800' },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
      {/* Left Column: Question Area */}
      <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="p-8 flex-grow overflow-y-auto">
          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-6">
            <span className="bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">Part A: Calculus</span>
            <span className="text-slate-300">•</span>
            <span>Question 14 of 50</span>
          </div>
          
          <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-black leading-tight mb-6">
            Solve the following differential equation:
          </h3>
          
          <div className="text-slate-900 dark:text-slate-200 text-lg font-medium bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-10 italic border-l-4 border-primary shadow-sm">
            dy/dx + 2xy = x, given that y(0) = 0.
          </div>

          <div className="flex flex-col gap-4">
            {[
              { id: 'a', math: 'y = 0.5 - 0.5e', sup: '-x²', checked: true },
              { id: 'b', math: 'y = 1 - e', sup: '-x²' },
              { id: 'c', math: 'y = 0.5 + 0.5e', sup: '-x²' },
              { id: 'd', math: 'y = e', sup: '-x²' },
            ].map((opt) => (
              <label 
                key={opt.id} 
                className={`flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 group
                  ${opt.checked 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'
                  }`}
              >
                <input 
                  type="radio" 
                  name="q14" 
                  defaultChecked={opt.checked}
                  className="h-6 w-6 border-2 border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-primary focus:ring-offset-0" 
                />
                <div className="flex grow flex-col">
                  <p className="text-slate-900 dark:text-white text-base font-semibold">
                    {opt.math}<sup>{opt.sup}</sup>
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-6 flex flex-wrap items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-100 transition-all shadow-sm">
              <span className="material-symbols-outlined">chevron_left</span>
              Previous
            </button>
            <button className="flex items-center gap-2 px-6 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-bold hover:bg-purple-100 transition-all">
              <span className="material-symbols-outlined text-lg">bookmark</span>
              Mark for Review
            </button>
          </div>
          <button className="flex items-center gap-2 px-10 h-12 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30">
            Save & Next
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Right Column: Palette */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Question Palette</h4>
            <div className="bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-1.5 font-bold text-sm">
              <span className="material-symbols-outlined text-base">timer</span>
              45:12
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q) => (
              <button
                key={q.id}
                className={`size-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm
                  ${q.status === 'answered' ? 'bg-green-500 text-white' : ''}
                  ${q.status === 'not-answered' ? 'bg-red-500 text-white' : ''}
                  ${q.status === 'marked' ? 'bg-purple-500 text-white' : ''}
                  ${q.status === 'current' ? 'border-2 border-primary text-primary bg-white dark:bg-slate-800 shadow-md ring-2 ring-primary/20 scale-110' : ''}
                  ${q.status === 'not-visited' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : ''}
                `}
              >
                {q.id}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <span className={`size-3 rounded ${s.color}`}></span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6">
          <h4 className="text-xs font-black text-primary mb-3 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            Quick Instructions
          </h4>
          <p className="text-xs text-primary/80 leading-relaxed font-semibold">
            Ensure all steps of the differential equation are considered. You can change your answer anytime before the final submission.
          </p>
        </div>

        <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2">
          Finish & Submit
        </button>
      </aside>
    </div>
  );
};

export default ExamInterface;
