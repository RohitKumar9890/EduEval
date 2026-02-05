
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Student Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Welcome back, Alex! Here is your academic overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Average Accuracy', val: '88%', icon: 'target', color: 'text-primary' },
          { label: 'Tests Completed', val: '24', icon: 'fact_check', color: 'text-primary' },
          { label: 'Global Rank', val: '#152', icon: 'leaderboard', color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
              <span className={`material-symbols-outlined ${stat.color} text-2xl`}>{stat.icon}</span>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* In Progress Section */}
      <div>
        <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4 flex items-center gap-2">
          In Progress
          <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
        </h3>
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row transition-all hover:shadow-lg">
          <div 
            className="w-full md:w-[35%] aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1PK-Jo0BlUW1NpBtRAv6HyXWT9D8GQ6xEKp_Rqf3pAYZiRnRBK4pkXAXzN0gn3slpp-b92sjHizyAEbur5DWWygTSIqmNMaBa4yU-929G-eZFifxrxFM1dK6abEvCYtsuL-ZcxmQ600yS_3dHyyqP21Qf2j3Tde9w3dQPpItHo5wDyOdmrTjeq9Gq49efHW-6S0XV33QunSrUas_TOdQFmIRwUJVpAxot-IIO713Nr4bt944WKM3nW0gSTb-Saw62JDNLQCcO3as')` }}
          />
          <div className="p-6 flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Live Assessment</p>
                <h4 className="text-slate-900 dark:text-white text-xl font-black leading-tight">Advanced Mathematics Midterm</h4>
              </div>
              <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold whitespace-nowrap">
                45:12 REMAINING
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Started at 10:00 AM • Informatics Building, Room 402</p>
              <div className="flex flex-col md:flex-row items-end justify-between gap-4">
                <div className="w-full">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[65%] rounded-full transition-all duration-1000"></div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/exam')}
                  className="flex-shrink-0 min-w-[140px] px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/30 transition-all hover:opacity-90 active:scale-95"
                >
                  Resume Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Section */}
        <section>
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4">Upcoming Tests</h3>
          <div className="space-y-3">
            {[
              { title: 'Organic Chemistry Lab', date: 'Tomorrow • 09:30 AM', icon: 'science' },
              { title: 'Western Philosophy I', date: 'Oct 24, 2023 • 11:00 AM', icon: 'history_edu' },
              { title: 'Linguistics Intro', date: 'Oct 26, 2023 • 02:00 PM', icon: 'language', opacity: 'opacity-60' },
            ].map((test, i) => (
              <div key={i} className={`p-4 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-primary/30 ${test.opacity || ''}`}>
                <div className="bg-primary/10 rounded-xl p-3 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">{test.icon}</span>
                </div>
                <div className="flex-grow">
                  <p className="text-slate-900 dark:text-white font-bold text-sm">{test.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{test.date}</p>
                </div>
                <button className="text-primary font-bold text-xs hover:underline">Details</button>
              </div>
            ))}
          </div>
        </section>

        {/* Completed Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-900 dark:text-white text-xl font-bold">Completed Tests</h3>
            <button className="text-primary text-xs font-bold hover:underline" onClick={() => navigate('/results')}>View All</button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Introduction to Macroeconomics', date: 'Completed Oct 15', score: '92/100', grade: 'A-' },
              { title: 'Data Structures & Algorithms', date: 'Completed Oct 12', score: '85/100', grade: 'B+' },
            ].map((test, i) => (
              <div key={i} className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-1.5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-sm">{test.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{test.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold text-sm">{test.score}</p>
                  <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">{test.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
