import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { setAccessToken } from '../lib/api';
import Logo from './Logo';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (e) {
      console.error('Failed to fetch user');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
    setMobileMenuOpen(false);
    router.push('/auth/login');
  };

  const navLinksByRole = {
    admin: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/admin/users', label: 'Users' },
      { href: '/admin/semesters', label: 'Semesters' },
      { href: '/admin/subjects', label: 'Subjects' },
      { href: '/admin/sections', label: 'Sections' },
      { href: '/admin/export', label: 'Export' },
    ],
    faculty: [
      { href: '/faculty/dashboard', label: 'Dashboard' },
      { href: '/faculty/exams', label: 'Exams' },
      { href: '/faculty/materials', label: 'Materials' },
      { href: '/faculty/announcements', label: 'Announcements' },
    ],
    student: [
      { href: '/student/dashboard', label: 'Dashboard' },
      { href: '/student/exams', label: 'Exams' },
      { href: '/student/materials', label: 'Materials' },
      { href: '/student/announcements', label: 'Announcements' },
      { href: '/student/progress', label: 'Progress' },
    ],
  };

  const links = user?.role ? (navLinksByRole[user.role] || []) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0">
              <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
                <Logo size="md" showText={true} />
              </Link>

              {user && links.length > 0 && (
                <div className="ml-6 hidden md:flex md:space-x-1 lg:space-x-3">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-2 lg:px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-gray-700">
                    {user.name} <span className="text-xs text-gray-500">({user.role})</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="md:hidden px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded"
                  >
                    Menu
                  </button>
                </>
              ) : (
                <a
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded"
                >
                  Login
                </a>
              )}
            </div>
          </div>

          {user && mobileMenuOpen && (
            <div className="md:hidden pb-3 border-t border-gray-100">
              <div className="pt-3 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">{children}</main>
    </div>
  );
}
