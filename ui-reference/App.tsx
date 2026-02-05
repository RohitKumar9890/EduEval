
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StudentDashboard from './pages/StudentDashboard';
import ExamInterface from './pages/ExamInterface';
import ResultsAnalysis from './pages/ResultsAnalysis';
import AdminDashboard from './pages/AdminDashboard';
import AdminAssessments from './pages/AdminAssessments';
import CodingExam from './pages/CodingExam';
import FacultyCourseView from './pages/FacultyCourseView';
import { Role, User } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('student');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const users: Record<Role, User> = {
    student: {
      id: '294021',
      name: 'Alex Johnson',
      role: 'student',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPyQD5dsjtFZ2SLGiOu5L14B4H83HvhqEJCnsfC8tLwsFVu0JFTpEAVG7tNMrxj6LXrEcHpgbe94b0YGAk2B0ff_tD-N0pptKLismNb2lKFt6Nd6i2hrpaWYWeaghoEEi6VtAvzJQUVR3-aY3jeYBiqsOvXID4t62ugrDcxexbSmdSIk6qOpJZbaqu7FZ8Yn4FESiLWePX8tqyj6FuNiHnGNk5Vque1fyc499fTJKmu4yEW0tTh9sOwBQwoRZiMr9bfhx7SNEJ4zo',
      studentId: '294021'
    },
    admin: {
      id: 'admin-1',
      name: 'Prof. Thompson',
      role: 'admin',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1VeipGFcCY49VuRtrCBq9rdQIK_1tHCHr3TUzALOIb67GWrRnOT9BGZl73ZFDOGxyKz-NYWNoS1jz7I1YljSXPxQ2wS38M1GW-v7vFrkXCt9Fdg9H6qxReBuleV--3Obp5KUu7sblZOrOUh5ffxb46eC1GJoHvVVTT1EkZxSJWoj1hHxPBfh9ObQUorROSw1lEMsK1BVkjKOgL-26uoBhTxZ7hoLBu47XGQ8YSJjla6M5Elx_Ve5jg98RaWA2XgfonWGIUpJ3KmI',
      department: 'Department Head'
    },
    faculty: {
      id: 'faculty-1',
      name: 'Dr. Sarah Chen',
      role: 'faculty',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPWpmljR0HPVwtyBl4Ob4BTae68Dfe_iAHWOe6Es_pHS4LWp1XP-6QVOEy-ShiE8OXjdxYaQQc7-o4Z0gkAdP_26fV9ZeKNJhPlq-D9umwzHl64uiUIrRvFroFkHvxh1_pumMUgpwR1YBhl8yS6m989G2rNvvvp807v23iOKwZ3zz4zd_ScD1Tlt4rMPxgriulANVhkZqp9roiGCf9XAdi3I4JyO4ILgcqAQQcdN7QGOE5Xc6nISa0dFThv20mpfmYPHfKzcRvaBs',
      department: 'Computer Science'
    }
  };

  const currentUser = users[role];

  return (
    <HashRouter>
      <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Sidebar user={currentUser} role={role} setRole={setRole} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            user={currentUser} 
            role={role} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
          
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Routes>
              {/* Student Routes */}
              {role === 'student' && (
                <>
                  <Route path="/" element={<StudentDashboard user={currentUser} />} />
                  <Route path="/exam" element={<ExamInterface user={currentUser} />} />
                  <Route path="/coding-exam" element={<CodingExam user={currentUser} />} />
                  <Route path="/results" element={<ResultsAnalysis />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
              
              {/* Admin Routes */}
              {role === 'admin' && (
                <>
                  <Route path="/" element={<AdminDashboard user={currentUser} />} />
                  <Route path="/assessments" element={<AdminAssessments />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}

              {/* Faculty Routes */}
              {role === 'faculty' && (
                <>
                  <Route path="/" element={<FacultyCourseView user={currentUser} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
