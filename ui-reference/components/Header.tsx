
import React from 'react';
import { User, Role } from '../types';

interface HeaderProps {
  user: User;
  role: Role;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, role, darkMode, toggleDarkMode }) => {
  return (
    <header className="h-16 flex items-center justify-between bg-white dark:bg-slate-900 px-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        {role !== 'student' && (
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
              placeholder="Search students, assessments, logs..."
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3 ml-2 lg:hidden">
          <div 
            className="size-8 rounded-full bg-slate-200 bg-cover bg-center"
            style={{ backgroundImage: `url('${user.avatar}')` }}
          />
        </div>

        {role === 'admin' && (
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Create New</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
