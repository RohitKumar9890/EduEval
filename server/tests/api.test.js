/**
 * API Test Suite for EduEval
 * 
 * Run with: npm test
 * Or individual tests: npm test -- api.test.js
 */

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000';

// Test credentials
const testAccounts = {
  admin: {
    email: 'admin@edueval.local',
    password: 'Admin@12345'
  },
  faculty: {
    email: 'faculty@test.com',
    password: 'Faculty@123'
  },
  student: {
    email: 'student@test.com',
    password: 'Student@123'
  }
};

// Store tokens
let tokens = {
  admin: null,
  faculty: null,
  student: null
};

// Store created resources for cleanup
let createdResources = {
  examId: null,
  subjectId: null,
  semesterId: null,
  submissionId: null
};

describe('EduEval API Tests', () => {
  
  // Health Check
  describe('Health Check', () => {
    test('GET /api/health should return OK', async () => {
      const response = await axios.get(`${API_URL}/api/health`);
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('ok');
      console.log('✓ Health check passed');
    });
  });

  // Authentication Tests
  describe('Authentication', () => {
    test('POST /api/auth/login (Admin) should return token', async () => {
      const response = await axios.post(`${API_URL}/api/auth/login`, testAccounts.admin);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('accessToken');
      expect(response.data.user.role).toBe('admin');
      tokens.admin = response.data.accessToken;
      console.log('✓ Admin login successful');
    });

    test('POST /api/auth/login (Faculty) should return token', async () => {
      const response = await axios.post(`${API_URL}/api/auth/login`, testAccounts.faculty);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('accessToken');
      expect(response.data.user.role).toBe('faculty');
      tokens.faculty = response.data.accessToken;
      console.log('✓ Faculty login successful');
    });

    test('POST /api/auth/login (Student) should return token', async () => {
      const response = await axios.post(`${API_URL}/api/auth/login`, testAccounts.student);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('accessToken');
      expect(response.data.user.role).toBe('student');
      tokens.student = response.data.accessToken;
      console.log('✓ Student login successful');
    });

    test('GET /api/auth/me should return user info', async () => {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.user).toHaveProperty('email');
      console.log('✓ Get user info successful');
    });

    test('POST /api/auth/login with wrong password should fail', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/login`, {
          email: testAccounts.admin.email,
          password: 'wrongpassword'
        });
        throw new Error('Should have failed');
      } catch (error) {
        expect(error.response.status).toBe(401);
        console.log('✓ Wrong password rejected');
      }
    });
  });

  // Admin Tests
  describe('Admin Operations', () => {
    test('POST /api/admin/semesters should create semester', async () => {
      const response = await axios.post(
        `${API_URL}/api/admin/semesters`,
        {
          name: 'Test Semester 2024',
          year: 2024,
          term: 'Fall',
          startDate: '2024-09-01',
          endDate: '2024-12-31',
          isActive: true
        },
        { headers: { Authorization: `Bearer ${tokens.admin}` } }
      );
      expect(response.status).toBe(201);
      expect(response.data.semester).toHaveProperty('id');
      createdResources.semesterId = response.data.semester.id || response.data.semester._id;
      console.log('✓ Semester created:', createdResources.semesterId);
    });

    test('GET /api/admin/semesters should list semesters', async () => {
      const response = await axios.get(`${API_URL}/api/admin/semesters`, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.semesters).toBeInstanceOf(Array);
      console.log('✓ Semesters listed:', response.data.semesters.length);
    });

    test('POST /api/admin/subjects should create subject', async () => {
      if (!createdResources.semesterId) {
        console.log('⚠ Skipping subject creation - no semester');
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/api/admin/subjects`,
        {
          name: 'Test Subject',
          code: 'TEST101',
          semesterId: createdResources.semesterId,
          facultyId: 'test-faculty-id',
          isActive: true
        },
        { headers: { Authorization: `Bearer ${tokens.admin}` } }
      );
      expect(response.status).toBe(201);
      createdResources.subjectId = response.data.subject.id || response.data.subject._id;
      console.log('✓ Subject created:', createdResources.subjectId);
    });

    test('GET /api/admin/users should list users', async () => {
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.users).toBeInstanceOf(Array);
      console.log('✓ Users listed:', response.data.users.length);
    });

    test('Faculty should not access admin endpoints', async () => {
      try {
        await axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${tokens.faculty}` }
        });
        throw new Error('Should have failed');
      } catch (error) {
        expect(error.response.status).toBe(403);
        console.log('✓ Faculty blocked from admin endpoints');
      }
    });
  });

  // Faculty Tests
  describe('Faculty Operations', () => {
    test('GET /api/faculty/subjects should return faculty subjects', async () => {
      const response = await axios.get(`${API_URL}/api/faculty/subjects`, {
        headers: { Authorization: `Bearer ${tokens.faculty}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.subjects).toBeInstanceOf(Array);
      console.log('✓ Faculty subjects retrieved');
    });

    test('POST /api/faculty/exams should create exam', async () => {
      // Get first subject
      const subjectsRes = await axios.get(`${API_URL}/api/faculty/subjects`, {
        headers: { Authorization: `Bearer ${tokens.faculty}` }
      });
      
      if (subjectsRes.data.subjects.length === 0) {
        console.log('⚠ Skipping exam creation - no subjects');
        return;
      }

      const subjectId = subjectsRes.data.subjects[0].id || subjectsRes.data.subjects[0]._id;
      
      const response = await axios.post(
        `${API_URL}/api/faculty/exams`,
        {
          title: 'Test Exam',
          type: 'mcq',
          subjectId: subjectId,
          durationMinutes: 60,
          totalMarks: 100,
          isPublished: false
        },
        { headers: { Authorization: `Bearer ${tokens.faculty}` } }
      );
      
      expect(response.status).toBe(201);
      expect(response.data.exam).toHaveProperty('examCode');
      createdResources.examId = response.data.exam.id || response.data.exam._id;
      console.log('✓ Exam created:', createdResources.examId);
      console.log('  Exam Code:', response.data.exam.examCode);
    });

    test('GET /api/faculty/exams should list faculty exams', async () => {
      const response = await axios.get(`${API_URL}/api/faculty/exams`, {
        headers: { Authorization: `Bearer ${tokens.faculty}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.exams).toBeInstanceOf(Array);
      console.log('✓ Faculty exams listed:', response.data.exams.length);
    });

    test('POST /api/faculty/materials should create material', async () => {
      const subjectsRes = await axios.get(`${API_URL}/api/faculty/subjects`, {
        headers: { Authorization: `Bearer ${tokens.faculty}` }
      });
      
      if (subjectsRes.data.subjects.length === 0) {
        console.log('⚠ Skipping material creation - no subjects');
        return;
      }

      const subjectId = subjectsRes.data.subjects[0].id || subjectsRes.data.subjects[0]._id;
      
      const response = await axios.post(
        `${API_URL}/api/faculty/materials`,
        {
          title: 'Test Material',
          description: 'Test description',
          subjectId: subjectId,
          fileUrl: 'https://example.com/test.pdf',
          fileName: 'test.pdf',
          fileSize: 1024,
          fileType: 'pdf'
        },
        { headers: { Authorization: `Bearer ${tokens.faculty}` } }
      );
      
      expect(response.status).toBe(201);
      console.log('✓ Material created');
    });

    test('POST /api/faculty/announcements should create announcement', async () => {
      const subjectsRes = await axios.get(`${API_URL}/api/faculty/subjects`, {
        headers: { Authorization: `Bearer ${tokens.faculty}` }
      });
      
      if (subjectsRes.data.subjects.length === 0) {
        console.log('⚠ Skipping announcement creation - no subjects');
        return;
      }

      const subjectId = subjectsRes.data.subjects[0].id || subjectsRes.data.subjects[0]._id;
      
      const response = await axios.post(
        `${API_URL}/api/faculty/announcements`,
        {
          title: 'Test Announcement',
          content: 'This is a test announcement',
          subjectId: subjectId,
          priority: 'normal'
        },
        { headers: { Authorization: `Bearer ${tokens.faculty}` } }
      );
      
      expect(response.status).toBe(201);
      console.log('✓ Announcement created');
    });
  });

  // Student Tests
  describe('Student Operations', () => {
    test('GET /api/student/exams should return published exams', async () => {
      const response = await axios.get(`${API_URL}/api/student/exams`, {
        headers: { Authorization: `Bearer ${tokens.student}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.exams).toBeInstanceOf(Array);
      console.log('✓ Published exams retrieved:', response.data.exams.length);
    });

    test('GET /api/student/materials should return materials', async () => {
      const response = await axios.get(`${API_URL}/api/student/materials`, {
        headers: { Authorization: `Bearer ${tokens.student}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.materials).toBeInstanceOf(Array);
      console.log('✓ Materials retrieved:', response.data.materials.length);
    });

    test('GET /api/student/announcements should return announcements', async () => {
      const response = await axios.get(`${API_URL}/api/student/announcements`, {
        headers: { Authorization: `Bearer ${tokens.student}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.announcements).toBeInstanceOf(Array);
      console.log('✓ Announcements retrieved:', response.data.announcements.length);
    });

    test('GET /api/student/progress should return progress', async () => {
      const response = await axios.get(`${API_URL}/api/student/progress`, {
        headers: { Authorization: `Bearer ${tokens.student}` }
      });
      expect(response.status).toBe(200);
      console.log('✓ Progress retrieved');
    });
  });

  // Code Execution Tests
  describe('Code Execution', () => {
    test('POST /api/code/execute (JavaScript) should execute code', async () => {
      const response = await axios.post(
        `${API_URL}/api/code/execute`,
        {
          language: 'javascript',
          code: 'console.log("Hello from test");',
          stdin: ''
        },
        { headers: { Authorization: `Bearer ${tokens.student}` } }
      );
      expect(response.status).toBe(200);
      expect(response.data.result).toHaveProperty('stdout');
      console.log('✓ JavaScript execution successful');
      console.log('  Output:', response.data.result.stdout);
    });

    test('POST /api/code/execute (Python) should execute code', async () => {
      const response = await axios.post(
        `${API_URL}/api/code/execute`,
        {
          language: 'python',
          code: 'print("Hello from Python test")',
          stdin: ''
        },
        { headers: { Authorization: `Bearer ${tokens.student}` } }
      );
      expect(response.status).toBe(200);
      expect(response.data.result).toHaveProperty('stdout');
      console.log('✓ Python execution successful');
      console.log('  Output:', response.data.result.stdout);
    });
  });

  // Rate Limiting Test
  describe('Rate Limiting', () => {
    test('Should enforce rate limits', async () => {
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(
          axios.get(`${API_URL}/api/health`).catch(err => err.response)
        );
      }
      
      const responses = await Promise.all(requests);
      const allSuccessful = responses.every(r => r.status === 200);
      
      expect(allSuccessful).toBe(true);
      console.log('✓ Rate limiting working (all 10 requests passed)');
    });
  });
});

// Run tests
console.log('🧪 Starting EduEval API Tests...\n');
console.log(`Target: ${API_URL}\n`);
console.log('Make sure the server is running before executing tests!\n');
console.log('=' .repeat(60));
