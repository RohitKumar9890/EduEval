
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Role } from '../types';

interface SidebarProps {
  user: User;
  role: Role;
  setRole: (role: Role) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, role, setRole }) => {
  const getLinks = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/', label: 'Dashboard', icon: 'dashboard' },
          { to: '/exam', label: 'My Exams', icon: 'assignment' },
          { to: '/results', label: 'Results', icon: 'analytics' },
          { to: '/profile', label: 'Profile', icon: 'person' },
        ];
      case 'admin':
        return [
          { to: '/', label: 'Dashboard', icon: 'dashboard' },
          { to: '/question-bank', label: 'Question Bank', icon: 'database' },
          { to: '/assessments', label: 'Assessments', icon: 'description' },
          { to: '/students', label: 'Students', icon: 'group' },
          { to: '/analytics', label: 'Analytics', icon: 'bar_chart' },
        ];
      case 'faculty':
        return [
          { to: '/', label: 'Assessments', icon: 'assignment' },
          { to: '/gradebook', label: 'Gradebook', icon: 'school' },
          { to: '/resources', label: 'Resources', icon: 'folder_open' },
          { to: '/settings', label: 'Settings', icon: 'settings' },
        ];
    }
  };

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="p-6 flex flex-col h-full">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">EduEval</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {role === 'student' ? 'University Assessment' : role === 'admin' ? 'University Admin' : 'Faculty Portal'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-grow">
          {getLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                    {link.icon}
                  </span>
                  <p className="text-sm font-semibold">{link.label}</p>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Role Switcher (Mock for Demo) */}
        <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Switch View (Mock)</p>
          <div className="flex gap-2">
            {(['student', 'admin', 'faculty'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 text-[10px] py-1 rounded border capitalize font-bold transition-all ${
                  role === r ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* User Footer */}
        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center border-2 border-slate-100 dark:border-slate-700"
              style={{ backgroundImage: `url('${user.avatar}')` }}
            />
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">
                {user.studentId ? `ID: ${user.studentId}` : user.department}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
