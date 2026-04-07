export const MOCK_USERS = {
  'admin@edueval.io': {
    uid: 'mock-admin-uid',
    email: 'admin@edueval.io',
    role: 'admin',
    displayName: 'System Administrator',
    status: 'active',
  },
  'faculty@edueval.io': {
    uid: 'mock-faculty-uid',
    email: 'faculty@edueval.io',
    role: 'faculty',
    displayName: 'Dr. Sarah Smith',
    status: 'active',
  },
  'student@edueval.io': {
    uid: 'mock-student-uid',
    email: 'student@edueval.io',
    role: 'student',
    displayName: 'John Doe',
    status: 'active',
  },
};

export const MOCK_COURSES = [
  { id: '1', name: 'Introduction to Computer Science', code: 'CS101', students: 120, status: 'Active' },
  { id: '2', name: 'Advanced Mathematics', code: 'MATH301', students: 45, status: 'Active' },
  { id: '3', name: 'Digital Marketing Essentials', code: 'MKT202', students: 85, status: 'Archived' },
];

export const MOCK_STATS = {
  totalStudents: 1240,
  activeExams: 12,
  avgScore: 78.5,
  passingRate: 92,
};
