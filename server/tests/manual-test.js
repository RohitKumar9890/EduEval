#!/usr/bin/env node

/**
 * Manual Test Runner for EduEval
 * 
 * This script tests critical user flows without needing Jest
 * Run with: node tests/manual-test.js
 */

import axios from 'axios';
import chalk from 'chalk';

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

let tokens = {};
let testData = {
  semesterId: null,
  subjectId: null,
  examId: null,
  examCode: null,
  materialId: null,
  announcementId: null
};

// Helper functions
const log = {
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  section: (msg) => console.log('\n' + chalk.yellow.bold('═'.repeat(60)) + '\n' + chalk.yellow.bold(msg) + '\n' + chalk.yellow.bold('═'.repeat(60)))
};

const handleError = (error, testName) => {
  log.error(`${testName} failed`);
  if (error.response) {
    console.log(chalk.red(`  Status: ${error.response.status}`));
    console.log(chalk.red(`  Message: ${error.response.data?.message || JSON.stringify(error.response.data)}`));
  } else {
    console.log(chalk.red(`  Error: ${error.message}`));
  }
  return false;
};

// Test functions
async function testHealthCheck() {
  log.section('HEALTH CHECK');
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    log.success(`Server is healthy (Status: ${response.data.status})`);
    return true;
  } catch (error) {
    return handleError(error, 'Health check');
  }
}

async function testAuthentication() {
  log.section('AUTHENTICATION');
  
  // Test Admin Login
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, testAccounts.admin);
    tokens.admin = response.data.accessToken;
    log.success('Admin logged in successfully');
    log.info(`  User: ${response.data.user.name} (${response.data.user.email})`);
  } catch (error) {
    return handleError(error, 'Admin login');
  }

  // Test Faculty Login
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, testAccounts.faculty);
    tokens.faculty = response.data.accessToken;
    log.success('Faculty logged in successfully');
    log.info(`  User: ${response.data.user.name} (${response.data.user.email})`);
  } catch (error) {
    return handleError(error, 'Faculty login');
  }

  // Test Student Login
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, testAccounts.student);
    tokens.student = response.data.accessToken;
    log.success('Student logged in successfully');
    log.info(`  User: ${response.data.user.name} (${response.data.user.email})`);
  } catch (error) {
    return handleError(error, 'Student login');
  }

  // Test Invalid Login
  try {
    await axios.post(`${API_URL}/api/auth/login`, {
      email: testAccounts.admin.email,
      password: 'wrongpassword'
    });
    log.error('Invalid login should have failed but succeeded!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Invalid login correctly rejected');
    } else {
      return handleError(error, 'Invalid login test');
    }
  }

  return true;
}

async function testAdminOperations() {
  log.section('ADMIN OPERATIONS');

  // Create Semester
  try {
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
    testData.semesterId = response.data.semester.id || response.data.semester._id;
    log.success(`Semester created (ID: ${testData.semesterId})`);
  } catch (error) {
    return handleError(error, 'Create semester');
  }

  // List Semesters
  try {
    const response = await axios.get(`${API_URL}/api/admin/semesters`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    log.success(`Semesters listed (Count: ${response.data.semesters.length})`);
  } catch (error) {
    return handleError(error, 'List semesters');
  }

  // Create Subject
  try {
    // Get faculty user ID first
    const usersRes = await axios.get(`${API_URL}/api/admin/users?role=faculty`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    
    const facultyUser = usersRes.data.users[0];
    
    const response = await axios.post(
      `${API_URL}/api/admin/subjects`,
      {
        name: 'Test Subject - Automated Testing',
        code: 'TEST101',
        semesterId: testData.semesterId,
        facultyId: facultyUser.id,
        isActive: true
      },
      { headers: { Authorization: `Bearer ${tokens.admin}` } }
    );
    testData.subjectId = response.data.subject.id || response.data.subject._id;
    log.success(`Subject created (ID: ${testData.subjectId})`);
  } catch (error) {
    return handleError(error, 'Create subject');
  }

  // List Users
  try {
    const response = await axios.get(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    log.success(`Users listed (Count: ${response.data.users.length})`);
  } catch (error) {
    return handleError(error, 'List users');
  }

  return true;
}

async function testFacultyExamWorkflow() {
  log.section('FACULTY EXAM WORKFLOW');

  // Get faculty subjects
  let subjectId;
  try {
    const response = await axios.get(`${API_URL}/api/faculty/subjects`, {
      headers: { Authorization: `Bearer ${tokens.faculty}` }
    });
    
    if (response.data.subjects.length === 0) {
      log.error('No subjects available for faculty');
      return false;
    }
    
    subjectId = response.data.subjects[0].id || response.data.subjects[0]._id;
    log.success(`Faculty has ${response.data.subjects.length} subject(s)`);
  } catch (error) {
    return handleError(error, 'Get faculty subjects');
  }

  // Create Exam
  try {
    const response = await axios.post(
      `${API_URL}/api/faculty/exams`,
      {
        title: 'Automated Test Exam',
        type: 'mcq',
        subjectId: subjectId,
        durationMinutes: 60,
        totalMarks: 100,
        isPublished: false
      },
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    testData.examId = response.data.exam.id || response.data.exam._id;
    testData.examCode = response.data.exam.examCode;
    log.success(`Exam created (ID: ${testData.examId})`);
    log.info(`  Exam Code: ${testData.examCode}`);
  } catch (error) {
    return handleError(error, 'Create exam');
  }

  // Add MCQ Question
  try {
    const response = await axios.patch(
      `${API_URL}/api/faculty/exams/${testData.examId}`,
      {
        mcqQuestions: [
          {
            prompt: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctOptionIndex: 1,
            marks: 10,
            difficulty: 'easy'
          }
        ]
      },
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    log.success('MCQ question added to exam');
  } catch (error) {
    return handleError(error, 'Add MCQ question');
  }

  // Add Coding Question
  try {
    const response = await axios.patch(
      `${API_URL}/api/faculty/exams/${testData.examId}`,
      {
        codingQuestions: [
          {
            prompt: 'Write a function to add two numbers',
            starterCode: 'function add(a, b) {\n  // Your code here\n}',
            language: 'javascript',
            marks: 20,
            difficulty: 'easy',
            testCases: [
              { input: 'add(2, 3)', expectedOutput: '5', isHidden: false }
            ]
          }
        ]
      },
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    log.success('Coding question added to exam');
  } catch (error) {
    return handleError(error, 'Add coding question');
  }

  // Publish Exam
  try {
    await axios.post(
      `${API_URL}/api/faculty/exams/${testData.examId}/publish`,
      {},
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    log.success('Exam published successfully');
  } catch (error) {
    return handleError(error, 'Publish exam');
  }

  return true;
}

async function testStudentExamWorkflow() {
  log.section('STUDENT EXAM WORKFLOW');

  if (!testData.examCode) {
    log.error('No exam code available - skipping student workflow');
    return false;
  }

  // Join Exam
  try {
    const response = await axios.post(
      `${API_URL}/api/student/join-exam`,
      { examCode: testData.examCode },
      { headers: { Authorization: `Bearer ${tokens.student}` } }
    );
    log.success(`Student joined exam: ${response.data.exam.title}`);
  } catch (error) {
    // Student might already be enrolled
    if (error.response?.status === 400) {
      log.info('Student already enrolled in exam');
    } else {
      return handleError(error, 'Join exam');
    }
  }

  // Get Enrolled Exams
  try {
    const response = await axios.get(`${API_URL}/api/student/my-exams`, {
      headers: { Authorization: `Bearer ${tokens.student}` }
    });
    log.success(`Student has ${response.data.exams.length} enrolled exam(s)`);
  } catch (error) {
    return handleError(error, 'Get enrolled exams');
  }

  // Start Exam Attempt
  try {
    const response = await axios.post(
      `${API_URL}/api/student/exams/${testData.examId}/start`,
      {},
      { headers: { Authorization: `Bearer ${tokens.student}` } }
    );
    log.success('Exam attempt started');
  } catch (error) {
    return handleError(error, 'Start exam attempt');
  }

  // Submit Exam
  try {
    const response = await axios.post(
      `${API_URL}/api/student/exams/${testData.examId}/submit`,
      {
        mcqAnswers: [
          { questionIndex: 0, selectedOptionIndex: 1 }
        ],
        codingAnswers: [
          { questionIndex: 0, code: 'function add(a, b) { return a + b; }' }
        ]
      },
      { headers: { Authorization: `Bearer ${tokens.student}` } }
    );
    log.success('Exam submitted successfully');
    log.info(`  Score: ${response.data.submission.score}`);
  } catch (error) {
    // If already submitted, that's okay
    if (error.response?.data?.message?.includes('Already submitted')) {
      log.info('Exam already submitted');
    } else {
      return handleError(error, 'Submit exam');
    }
  }

  return true;
}

async function testMaterialsAndAnnouncements() {
  log.section('MATERIALS & ANNOUNCEMENTS');

  // Get faculty subjects
  let subjectId;
  try {
    const response = await axios.get(`${API_URL}/api/faculty/subjects`, {
      headers: { Authorization: `Bearer ${tokens.faculty}` }
    });
    subjectId = response.data.subjects[0]?.id || response.data.subjects[0]?._id;
  } catch (error) {
    return handleError(error, 'Get faculty subjects');
  }

  // Create Material
  try {
    const response = await axios.post(
      `${API_URL}/api/faculty/materials`,
      {
        title: 'Test Material - Automated',
        description: 'This is a test material',
        subjectId: subjectId,
        fileUrl: 'https://example.com/test.pdf',
        fileName: 'test.pdf',
        fileSize: 1024000,
        fileType: 'pdf'
      },
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    testData.materialId = response.data.material.id || response.data.material._id;
    log.success('Material created');
  } catch (error) {
    return handleError(error, 'Create material');
  }

  // Student View Materials
  try {
    const response = await axios.get(`${API_URL}/api/student/materials`, {
      headers: { Authorization: `Bearer ${tokens.student}` }
    });
    log.success(`Student can view ${response.data.materials.length} material(s)`);
  } catch (error) {
    return handleError(error, 'Student view materials');
  }

  // Create Announcement
  try {
    const response = await axios.post(
      `${API_URL}/api/faculty/announcements`,
      {
        title: 'Test Announcement - Automated',
        content: 'This is a test announcement from automated testing',
        subjectId: subjectId,
        priority: 'normal'
      },
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    testData.announcementId = response.data.announcement.id || response.data.announcement._id;
    log.success('Announcement created');
  } catch (error) {
    return handleError(error, 'Create announcement');
  }

  // Student View Announcements
  try {
    const response = await axios.get(`${API_URL}/api/student/announcements`, {
      headers: { Authorization: `Bearer ${tokens.student}` }
    });
    log.success(`Student can view ${response.data.announcements.length} announcement(s)`);
  } catch (error) {
    return handleError(error, 'Student view announcements');
  }

  return true;
}

async function testCodeExecution() {
  log.section('CODE EXECUTION');

  // Test JavaScript
  try {
    const response = await axios.post(
      `${API_URL}/api/code/execute`,
      {
        language: 'javascript',
        code: 'console.log("Hello from automated test");',
        stdin: ''
      },
      { headers: { Authorization: `Bearer ${tokens.student}` } }
    );
    log.success('JavaScript code executed');
    log.info(`  Output: ${response.data.result.stdout}`);
  } catch (error) {
    return handleError(error, 'Execute JavaScript');
  }

  // Test Python
  try {
    const response = await axios.post(
      `${API_URL}/api/code/execute`,
      {
        language: 'python',
        code: 'print("Hello from Python test")',
        stdin: ''
      },
      { headers: { Authorization: `Bearer ${tokens.student}` } }
    );
    log.success('Python code executed');
    log.info(`  Output: ${response.data.result.stdout}`);
  } catch (error) {
    return handleError(error, 'Execute Python');
  }

  return true;
}

async function testGradingWorkflow() {
  log.section('GRADING WORKFLOW');

  if (!testData.examId) {
    log.error('No exam ID available - skipping grading workflow');
    return false;
  }

  // Get Exam Submissions
  let submissionId;
  try {
    const response = await axios.get(
      `${API_URL}/api/faculty/submissions/exam/${testData.examId}`,
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    
    if (response.data.submissions.length === 0) {
      log.info('No submissions available for grading');
      return true;
    }
    
    submissionId = response.data.submissions[0].id;
    log.success(`Found ${response.data.submissions.length} submission(s)`);
  } catch (error) {
    return handleError(error, 'Get exam submissions');
  }

  // View Submission Details
  try {
    const response = await axios.get(
      `${API_URL}/api/faculty/submissions/${submissionId}`,
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    log.success('Submission details retrieved');
    log.info(`  Student: ${response.data.submission.studentName}`);
    log.info(`  Score: ${response.data.submission.score}/${response.data.submission.maxScore}`);
  } catch (error) {
    return handleError(error, 'Get submission details');
  }

  // Grade Submission
  try {
    const response = await axios.post(
      `${API_URL}/api/faculty/submissions/${submissionId}/grade`,
      {
        score: 85,
        feedback: 'Good work! Keep it up.'
      },
      { headers: { Authorization: `Bearer ${tokens.faculty}` } }
    );
    log.success('Submission graded successfully');
    log.info(`  New Score: ${response.data.submission.score}`);
  } catch (error) {
    return handleError(error, 'Grade submission');
  }

  return true;
}

// Main test runner
async function runAllTests() {
  console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║         EduEval Manual Test Suite - Starting...          ║'));
  console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════════╝\n'));
  
  log.info(`Testing server at: ${API_URL}`);
  console.log('');

  const results = {
    passed: 0,
    failed: 0
  };

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Authentication', fn: testAuthentication },
    { name: 'Admin Operations', fn: testAdminOperations },
    { name: 'Faculty Exam Workflow', fn: testFacultyExamWorkflow },
    { name: 'Student Exam Workflow', fn: testStudentExamWorkflow },
    { name: 'Materials & Announcements', fn: testMaterialsAndAnnouncements },
    { name: 'Code Execution', fn: testCodeExecution },
    { name: 'Grading Workflow', fn: testGradingWorkflow }
  ];

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.error(chalk.red(`Unexpected error in ${test.name}:`), error.message);
      results.failed++;
    }
  }

  // Print summary
  console.log('\n' + chalk.cyan.bold('═'.repeat(60)));
  console.log(chalk.cyan.bold('TEST SUMMARY'));
  console.log(chalk.cyan.bold('═'.repeat(60)));
  console.log(chalk.green(`✓ Passed: ${results.passed}`));
  console.log(chalk.red(`✗ Failed: ${results.failed}`));
  console.log(chalk.cyan(`Total: ${results.passed + results.failed}`));
  console.log(chalk.cyan.bold('═'.repeat(60) + '\n'));

  if (results.failed === 0) {
    console.log(chalk.green.bold('🎉 All tests passed! Your EduEval instance is working correctly.\n'));
    process.exit(0);
  } else {
    console.log(chalk.red.bold('⚠️  Some tests failed. Please review the errors above.\n'));
    process.exit(1);
  }
}

// Check if server is reachable before running tests
async function checkServer() {
  try {
    await axios.get(`${API_URL}/api/health`, { timeout: 3000 });
    return true;
  } catch (error) {
    console.log(chalk.red.bold('\n✗ Cannot reach server at ' + API_URL));
    console.log(chalk.yellow('\nPlease make sure:'));
    console.log(chalk.yellow('  1. The server is running (npm run dev in server directory)'));
    console.log(chalk.yellow('  2. The server is accessible at ' + API_URL));
    console.log(chalk.yellow('  3. You have run the seed scripts (npm run seed:admin && npm run seed:test)\n'));
    return false;
  }
}

// Run tests
(async () => {
  const serverReachable = await checkServer();
  if (serverReachable) {
    await runAllTests();
  } else {
    process.exit(1);
  }
})();
