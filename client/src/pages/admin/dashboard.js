import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ModernLayout from '../../components/modern/ModernLayout';
import api from '../../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState({ admins: [], faculty: [], students: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.user.role !== 'admin') {
        router.push(`/${data.user.role}`);
        return;
      }
      setUser(data.user);

      // Fetch all users
      try {
        const usersRes = await api.get('/admin/users');
        const allUsers = usersRes.data.users || [];
        setUsers({
          admins: allUsers.filter(u => u.role === 'admin'),
          faculty: allUsers.filter(u => u.role === 'faculty'),
          students: allUsers.filter(u => u.role === 'student'),
        });
      } catch (e) {
        console.error('Failed to fetch users:', e);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const totalStudents = users.students.length;
  const activeExams = 8; // Mock data
  const pendingGradings = 156; // Mock data
  const avgScore = 74.2; // Mock data

  // Mock live monitoring data
  const liveStudents = [
    { 
      name: 'John Cooper', 
      status: 'Normal', 
      meta: '0.2s latency', 
      progress: 48, 
      avatar: 'https://i.pravatar.cc/150?img=12',
      color: 'green' 
    },
    { 
      name: 'Sarah Jenkins', 
      status: 'Lost Focus', 
      meta: '35s ago', 
      progress: 82, 
      avatar: 'https://i.pravatar.cc/150?img=45',
      color: 'orange' 
    },
    { 
      name: 'Marcus Webb', 
      status: 'Normal', 
      meta: 'Steady pace', 
      progress: 24, 
      avatar: 'https://i.pravatar.cc/150?img=33',
      color: 'green' 
    },
    { 
      name: 'Elena Gilbert', 
      status: 'Flagged', 
      meta: 'Multiple monitors', 
      progress: 66, 
      avatar: 'https://i.pravatar.cc/150?img=47',
      color: 'red' 
    },
  ];

  return (
    <ModernLayout user={user}>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Welcome back, {user?.name}. Here's what's happening across your platform today.
          </p>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Students', val: totalStudents.toString(), trend: '+12%', color: 'blue', icon: 'group' },
            { label: 'Active Exams', val: activeExams.toString(), trend: 'Active', color: 'green', icon: 'quiz' },
            { label: 'Pending Gradings', val: pendingGradings.toString(), trend: '42 due', color: 'orange', icon: 'pending_actions' },
            { label: 'Avg. Platform Score', val: `${avgScore}%`, trend: '+2.4%', color: 'purple', icon: 'insights' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-primary/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-xl`}>
                  <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                </div>
                <span className={`text-${stat.trend.includes('+') || stat.trend === 'Active' ? 'green' : 'orange'}-500 text-[10px] font-black uppercase tracking-widest`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                {stat.label}
              </p>
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
                  <button className="text-primary text-[10px] font-black uppercase px-3 py-1 hover:bg-primary/5 rounded-lg transition-colors">
                    View Wall
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
                {liveStudents.map((student, i) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:border-primary/20 group"
                  >
                    <div className="relative">
                      <div 
                        className="size-12 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 shadow-sm" 
                        style={{ backgroundImage: `url('${student.avatar}')` }} 
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 size-4 bg-${student.color}-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-black text-slate-900 dark:text-white truncate">{student.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Q. {student.progress}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mb-2 overflow-hidden">
                        <div 
                          className={`bg-${student.color}-500 h-full rounded-full transition-all duration-1000`} 
                          style={{ width: `${student.progress}%` }}
                        ></div>
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
                    <p className="text-[10px] text-red-700 dark:text-red-300 font-semibold mt-1 leading-relaxed">
                      3 students flagged for browser focus loss in CS-350.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20 transition-all hover:scale-[1.02]">
                  <span className="material-symbols-outlined text-orange-500 text-lg mt-0.5">assignment_late</span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-800 dark:text-orange-400">Grading Deadline</p>
                    <p className="text-[10px] text-orange-700 dark:text-orange-300 font-semibold mt-1 leading-relaxed">
                      PSY-101 Quiz 2 needs results published by 5:00 PM today.
                    </p>
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
              <button className="w-full mt-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700">
                Download System Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
