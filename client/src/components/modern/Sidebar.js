import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar({ user, onLogout }) {
  const router = useRouter();

  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { href: '/student/exams', label: 'Dashboard', icon: 'dashboard' },
          { href: '/student/exams', label: 'My Exams', icon: 'assignment' },
          { href: '/student/materials', label: 'Materials', icon: 'folder_open' },
          { href: '/student/progress', label: 'Progress', icon: 'analytics' },
          { href: '/student/announcements', label: 'Announcements', icon: 'campaign' },
        ];
      case 'admin':
        return [
          { href: '/admin/sections', label: 'Dashboard', icon: 'dashboard' },
          { href: '/admin/users', label: 'Users', icon: 'group' },
          { href: '/admin/subjects', label: 'Subjects', icon: 'book' },
          { href: '/admin/sections', label: 'Sections', icon: 'class' },
          { href: '/admin/semesters', label: 'Semesters', icon: 'calendar_month' },
          { href: '/admin/export', label: 'Export', icon: 'download' },
        ];
      case 'faculty':
        return [
          { href: '/faculty/exams', label: 'Exams', icon: 'assignment' },
          { href: '/faculty/materials', label: 'Materials', icon: 'folder_open' },
          { href: '/faculty/announcements', label: 'Announcements', icon: 'campaign' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/');

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="p-6 flex flex-col h-full">
        {/* Brand */}
        <Link href={links[0]?.href || '/'} className="flex items-center gap-3 mb-10">
          <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-lg font-black leading-tight">EduEval</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {user?.role === 'student' ? 'University Assessment' : 
               user?.role === 'admin' ? 'University Admin' : 
               'Faculty Portal'}
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-grow">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                <span className={`material-symbols-outlined ${active ? 'fill-1' : ''}`}>
                  {link.icon}
                </span>
                <p className="text-sm font-semibold">{link.label}</p>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            {user?.photoURL ? (
              <div 
                className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center border-2 border-slate-100 dark:border-slate-700"
                style={{ backgroundImage: `url('${user.photoURL}')` }}
              />
            ) : (
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-slate-100 dark:border-slate-700">
                <span className="text-primary text-lg font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {user?.role || 'Guest'}
              </p>
            </div>
          </div>
          
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="text-sm font-semibold">Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
