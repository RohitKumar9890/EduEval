
import React from 'react';
import { User } from '../types';

const FacultyCourseView: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 pb-10">
      {/* Left Main Content */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">CS101: Introduction to Programming</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Manage your course assessments and student evaluations.</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-xl">add</span>
            Create Assessment
          </button>
        </div>

        {/* Tabs and List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800 px-8 flex gap-10 overflow-x-auto no-scrollbar">
            {[
              { label: 'Published', count: 12 },
              { label: 'Drafts', count: 3 },
              { label: 'Evaluation Required', count: 4, active: true },
            ].map((t) => (
              <button
                key={t.label}
                className={`flex items-center justify-center pb-5 pt-6 border-b-[3px] transition-all whitespace-nowrap
                  ${t.active 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'}
                `}
              >
                <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                <span className={`ml-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                  t.active ? 'bg-primary/10 text-primary' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { title: 'Midterm Coding Project: Sorting Algorithms', due: 'Oct 15, 2023', sub: '48/52', icon: 'terminal', iconColor: 'text-amber-500', iconBg: 'bg-amber-50 dark:bg-amber-900/20', priority: 'High Priority', count: 14, avatars: true },
              { title: 'Quiz 4: Control Flow & Loops', due: 'Oct 20, 2023', sub: '52/52', icon: 'description', iconColor: 'text-blue-500', iconBg: 'bg-blue-50 dark:bg-blue-900/20', count: 8 },
              { title: 'Weekly Lab: Recursion Basics', due: 'Oct 22, 2023', sub: '30/52', icon: 'code_blocks', iconColor: 'text-purple-500', iconBg: 'bg-purple-50 dark:bg-purple-900/20', count: 3 },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 px-8 py-6 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-5 min-w-0">
                  <div className={`${item.iconColor} ${item.iconBg} flex items-center justify-center rounded-2xl shrink-0 size-14 border border-white dark:border-slate-800 shadow-sm`}>
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-slate-900 dark:text-white text-base font-black truncate">{item.title}</p>
                      {item.priority && (
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                          {item.priority}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-5">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        Due: {item.due}
                      </p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">group</span>
                        {item.sub} Submitted
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  {item.avatars && (
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(a => (
                        <div 
                          key={a} 
                          className="size-9 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 bg-cover bg-center shadow-sm" 
                          style={{ backgroundImage: `url('https://picsum.photos/40/40?random=${a}')` }} 
                        />
                      ))}
                      <div className="size-9 rounded-full border-2 border-white dark:border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-white font-black">+12</div>
                    </div>
                  )}
                  <button className="flex min-w-[130px] items-center justify-center rounded-xl h-11 px-5 bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-95 group">
                    <span className="truncate">Grade Now</span>
                    <span className="ml-3 bg-white text-primary text-[10px] size-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">{item.count}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Student Inquiries */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest">Student Inquiries</h3>
            <span className="flex size-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
          </div>
          
          <div className="space-y-5">
            {[
              { name: 'Mark Thompson', time: '10m ago', text: '"Having trouble understanding the edge cases for the sorting midterm..."', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_dHUw-0YnNfeh0gMhSXLY_uIYmuosofPK_uQRGhUjj46VJKB3PcPM9Hx8kEX2wxhZQgU0UmqxzGI4PBmLEZws0T-QMxx2p8JT2Iulkvh0TgytqYBqMQA1vsD5o-6M9XNjPK7PNhscCCn0YJr3teV-slEUM00FaAQfivsVP57M3kP6iMrbtIJEmdbl1td4_H6BUf6WOLd9PONe145uDjBz07Llere1bsvy5XoZVLi7x6NGTgFXDT6umLPZ2whuthV4F86K-ID4DP0' },
              { name: 'Sarah Chen', time: '2h ago', text: '"Is there a late submission penalty for the Quiz 4 if the system was down?"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnEODIsddyF3j-ru8t4LMxyb83ZwrKcju3jdrOaj8oZT19a4N5xWWJ2sneHImuDQ8KZa5qhYHvS8rNcUPYc2NWpBrkkBPJ65QJtEw7cyrFBB6v0Lxf2hwgICqQ9d0p-kXQ7FcONtt7BVyXQKSv7N5aeKCPF2GM-ww9g2NPLGTEw5UrbhpwYh1COVI5C0YrTSMt_BuTIDAC-DrDMpu95PffGiAaOlX2mktoQs44UmiNVDZ9h26Mgz3O6F_S9sSx8sCJe0Hm6U5H4X4' },
              { name: 'James Wilson', time: '4h ago', text: '"Can we use external libraries for the final recursion project?"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjvw1i_WuqX0vxtTujE-bRaY99wqIaTzCDNsSozVcAyahZy2aQN8wWWGjNqMoBVGJdqRFNNp9G1I8HkSXzThu6vUhWV-84xkY9ms8GS99dl1-JLq4kdcFn7AfFDlkbwvcmSNbqC7d9cdwZ-mWlCt2HznzpoOohhyYYGFWnXS1uEK3QHGDYyMfNcbCE7pnvEkUrHihzD3cVuEeez_Uj4-YWflHTs2rPUo_yAN347Da5HuO-Q3hvS1GwNF-D9EyHaItNmbbEbbrk00c' },
            ].map((q, i) => (
              <div key={i} className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 shrink-0" style={{ backgroundImage: `url('${q.avatar}')` }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-widest">{q.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{q.time}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed line-clamp-2">{q.text}</p>
                    <div className="mt-3 flex items-center text-primary text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      Reply <span className="material-symbols-outlined text-xs ml-1.5">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest mb-6">Quick Links</h3>
            <div className="flex flex-wrap gap-3">
              {['Syllabus', 'Class Roster', 'Office Hours'].map(link => (
                <button key={link} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-white transition-all shadow-sm">
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default FacultyCourseView;
