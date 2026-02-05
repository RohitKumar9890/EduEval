
import React from 'react';

const AdminDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, {user.name}. Here's what's happening across your courses today.</p>
      </div>

      {/* Top Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', val: '1,284', trend: '+12%', color: 'blue' },
          { label: 'Active Exams', val: '8', trend: 'Active', color: 'green' },
          { label: 'Pending Gradings', val: '156', trend: '42 due', color: 'orange' },
          { label: 'Avg. Platform Score', val: '74.2%', trend: '+2.4%', color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-xl`}>
                <span className="material-symbols-outlined text-xl">{i === 0 ? 'group' : i === 1 ? 'quiz' : i === 2 ? 'pending_actions' : 'insights'}</span>
              </div>
              <span className={`text-${stat.trend.includes('+') || stat.trend === 'Active' ? 'green' : 'orange'}-500 text-[10px] font-black uppercase tracking-widest`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content: Live Monitoring */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[500px] transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Live Monitoring</h3>
              </div>
              <div className="flex gap-2">
                <select className="text-[10px] font-black uppercase bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-1 px-4 text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-primary/20">
                  <option>Psychology 101 Midterm</option>
                  <option>Adv. Macroeconomics</option>
                </select>
                <button className="text-primary text-[10px] font-black uppercase px-3 py-1 hover:bg-primary/5 rounded-lg transition-colors">View Wall</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'John Cooper', status: 'Normal', meta: '0.2s latency', progress: 48, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVU5AUdpMeoZCq-8N_SPKA-DbpqcS7W4PiZs9-VpBQMSWCtJNwwP37hZits4kFqwz_4ouss3xQ5itOvvWMxEDQpbrvC6tq0Kkn-z75rY6s42ymiBGwUgYT9y9Ky6z0PWhiLYdb-zt0FOmjCSOXl_GpFRu9aon7wS0mTbuwFS6tlrEJcPsP1sRBCudZyjeAkDgdWSBT-qYb7G6HlwL-0-99aH6wmA3fgX9SvokrHWiIefHUzCvB6WyYskvCLdzFpGS2nEJXr9ysU9w', color: 'green' },
                { name: 'Sarah Jenkins', status: 'Lost Focus', meta: '35s ago', progress: 82, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmUhnoW_WK093K24kwpKxwXZfd8UtLA2mPVlVpnk6Dma_44cKxeIB97eHQwlQcRodQdHTEVOqRTIPY_tZweiJTpXe_mJXt2MOX6p1HyjfgDP5kmLRV8OKK0ovkH5BjHcXlmHyMBVY9VpHvhJy4WJBopfwgnU26Te9zOwnjNNxU8XlG8-_aGatQ988zNTOxc5ioCoRd_MXw23IHnqB6R5rJ6EYS5ZScohObQXwyHEV4AaQhEyqVNa4bL6yFpgTqGqFZp1jV9-0ET2g', color: 'orange' },
                { name: 'Marcus Webb', status: 'Normal', meta: 'Steady pace', progress: 24, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdNcoN8N5DsLT7KEpYFQrBtHfh3EZ6xguu-Sm483fTua9FXxH11gx2BTElngHtZKDpW4ibNcXFHajLhJwoPfYLKnXKbEOHZuWXAgwrvIZyNEXfqMish3rQfcxOmctwS2wkfaYXraPaHqptLE1TVkDzloFmeNCU50WhkQXUBF9J4MXGKg-ps4sLHHSFHLSBMxPQn3gw9YY-ScXHA8E6TACpJLis3Ahd5zxroMMTNW0CWNoukgigiS25_zNTWOkTT7evAro3hzxs2Tc', color: 'green' },
                { name: 'Elena Gilbert', status: 'Flagged', meta: 'Multiple monitors', progress: 66, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpfJm6oLDEgj7QLN8aTj7VOur2Ma1-GGChHuvJa_GKb5si2iMM4dUfAIDMYiQQAg36Abc4eM3m9EymIYQTKLk2bhihbEPavMmfn9zsW7K9U3jnozLW3QpGcrgzM2Yaj-JkVrV4Hbd7hAQ30JFGuQhMNitj9Qx6a6dGTgi3N8gaeih5Yx8UGsDg4W20H_Td3P-GVgU3u2XvOZRnACfnoBkHgLFrXTnrEcj7h8fzoYQlE7BpmK1jS4KlKPUTwXN-LSmdhatQl98Oe1o', color: 'red' },
              ].map((student, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:border-primary/20 group">
                  <div className="relative">
                    <div className="size-12 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundImage: `url('${student.avatar}')` }} />
                    <div className={`absolute -bottom-0.5 -right-0.5 size-4 bg-${student.color}-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-slate-900 dark:text-white truncate">{student.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Q. {student.progress}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mb-2 overflow-hidden">
                      <div className={`bg-${student.color}-500 h-full rounded-full transition-all duration-1000`} style={{ width: `${student.progress}%` }}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest text-${student.color}-600 dark:text-${student.color}-400 flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-xs">
                          {student.status === 'Normal' ? 'check_circle' : student.status === 'Flagged' ? 'cancel' : 'warning'}
                        </span>
                        {student.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 truncate">{student.meta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Urgent Actions & Trends */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Urgent Actions</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 transition-all hover:scale-[1.02]">
                <span className="material-symbols-outlined text-red-500 text-lg mt-0.5">warning</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-800 dark:text-red-400">Flagged Activity</p>
                  <p className="text-[10px] text-red-700 dark:text-red-300 font-semibold mt-1 leading-relaxed">3 students flagged for browser focus loss in CS-350.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20 transition-all hover:scale-[1.02]">
                <span className="material-symbols-outlined text-orange-500 text-lg mt-0.5">assignment_late</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-800 dark:text-orange-400">Grading Deadline</p>
                  <p className="text-[10px] text-orange-700 dark:text-orange-300 font-semibold mt-1 leading-relaxed">PSY-101 Quiz 2 needs results published by 5:00 PM today.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Score Trends</h3>
              <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">more_horiz</button>
            </div>
            <div className="h-32 flex items-end justify-between gap-2 px-1">
              {[30, 45, 35, 65, 85, 55, 75].map((h, i) => (
                <div 
                  key={i} 
                  className={`w-full rounded-t-lg transition-all duration-700 hover:scale-110
                    ${i === 4 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/20 dark:bg-primary/10'}
                  `} 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Mon</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sun</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Quick Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Platform Uptime</span>
                <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Avg. Completion Time</span>
                <span className="text-[10px] text-slate-900 dark:text-white font-black uppercase tracking-widest">42m 12s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Latency</span>
                <span className="text-[10px] text-slate-900 dark:text-white font-black uppercase tracking-widest">14ms</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700">
              Download System Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
