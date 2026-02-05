
export type Role = 'student' | 'admin' | 'faculty';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  studentId?: string;
  department?: string;
}

export interface Assessment {
  id: string;
  title: string;
  course: string;
  date: string;
  status: 'live' | 'completed' | 'upcoming' | 'draft' | 'scheduled' | 'grading';
  score?: string;
  grade?: string;
  submissions?: string;
  avgScore?: string;
}

export interface Question {
  id: number;
  status: 'answered' | 'not-answered' | 'marked' | 'not-visited' | 'current';
}
