import { asyncHandler } from '../utils/asyncHandler.js';
import { generateProgressReportPDF, generateExcelReport, generateTranscript } from '../utils/pdfGenerator.js';
import { ExamAttempt } from '../models/ExamAttempt.js';
import { User } from '../models/User.js';
import { Exam } from '../models/Exam.js';

/**
 * Generate student progress report (PDF)
 */
export const generateStudentProgressPDF = asyncHandler(async (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

  // Fetch student data
  const student = await User.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Fetch submissions
  const submissions = await ExamAttempt.find({ studentId })
    .populate('examId', 'title')
    .sort({ submittedAt: -1 });

  const completedSubmissions = submissions.filter(s => s.status === 'submitted' || s.status === 'graded');
  
  const scores = completedSubmissions
    .filter(s => s.maxScore > 0)
    .map(s => (s.score / s.maxScore) * 100);

  const studentData = {
    id: student.id,
    name: student.name,
    email: student.email,
    stats: {
      totalExams: submissions.length,
      completedExams: completedSubmissions.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
    },
    submissions: completedSubmissions.map(s => ({
      examTitle: s.examId?.title || 'Exam',
      submittedAt: s.submittedAt,
      score: s.score,
      maxScore: s.maxScore,
      status: s.status,
    })),
    achievements: req.body.achievements || {},
  };

  const pdfBuffer = await generateProgressReportPDF(studentData);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=progress-report-${student.name.replace(/\s/g, '-')}.pdf`);
  res.send(pdfBuffer);
});

/**
 * Generate student progress report (Excel)
 */
export const generateStudentProgressExcel = asyncHandler(async (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

  const student = await User.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const submissions = await ExamAttempt.find({ studentId })
    .populate('examId', 'title')
    .sort({ submittedAt: -1 });

  const completedSubmissions = submissions.filter(s => s.status === 'submitted' || s.status === 'graded');
  
  const scores = completedSubmissions
    .filter(s => s.maxScore > 0)
    .map(s => (s.score / s.maxScore) * 100);

  const studentData = {
    name: student.name,
    email: student.email,
    stats: {
      totalExams: submissions.length,
      completedExams: completedSubmissions.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
    },
    submissions: completedSubmissions.map(s => ({
      examTitle: s.examId?.title || 'Exam',
      submittedAt: s.submittedAt,
      score: s.score,
      maxScore: s.maxScore,
      status: s.status,
    })),
  };

  const excelBuffer = await generateExcelReport(studentData, 'student');

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=progress-report-${student.name.replace(/\s/g, '-')}.xlsx`);
  res.send(excelBuffer);
});

/**
 * Generate class report (Excel)
 */
export const generateClassReport = asyncHandler(async (req, res) => {
  // Faculty only
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { subjectId, examId } = req.query;

  let query = { role: 'student' };
  const students = await User.find(query);

  const studentsData = await Promise.all(
    students.map(async (student) => {
      const submissions = await ExamAttempt.find({ 
        studentId: student.id,
        ...(examId && { examId })
      });

      const completed = submissions.filter(s => s.status === 'submitted' || s.status === 'graded');
      const scores = completed
        .filter(s => s.maxScore > 0)
        .map(s => (s.score / s.maxScore) * 100);

      return {
        name: student.name,
        email: student.email,
        examsCompleted: completed.length,
        averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
        isActive: student.isActive,
      };
    })
  );

  const classData = { students: studentsData };
  const excelBuffer = await generateExcelReport(classData, 'class');

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=class-report.xlsx');
  res.send(excelBuffer);
});

/**
 * Generate official transcript
 */
export const generateOfficialTranscript = asyncHandler(async (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

  const student = await User.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const submissions = await ExamAttempt.find({ studentId })
    .populate('examId', 'title subjectId')
    .sort({ submittedAt: -1 });

  const completedSubmissions = submissions.filter(s => s.status === 'submitted' || s.status === 'graded');
  
  const scores = completedSubmissions
    .filter(s => s.maxScore > 0)
    .map(s => (s.score / s.maxScore) * 100);

  const studentData = {
    id: student.id,
    name: student.name,
    email: student.email,
    stats: {
      totalExams: submissions.length,
      completedExams: completedSubmissions.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
    },
    submissions: completedSubmissions.map(s => ({
      examTitle: s.examId?.title || 'Exam',
      subjectName: s.examId?.subjectId?.name || 'General',
      submittedAt: s.submittedAt,
      score: s.score,
      maxScore: s.maxScore,
    })),
  };

  const pdfBuffer = await generateTranscript(studentData);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=transcript-${student.name.replace(/\s/g, '-')}.pdf`);
  res.send(pdfBuffer);
});
