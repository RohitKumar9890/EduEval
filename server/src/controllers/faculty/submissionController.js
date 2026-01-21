import { asyncHandler } from '../../utils/asyncHandler.js';
import { Exam } from '../../models/Exam.js';
import { Submission } from '../../models/Submission.js';
import { User } from '../../models/User.js';

export const getExamSubmissions = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  // Verify exam belongs to this faculty
  const exam = await Exam.findOne({ _id: examId, createdBy: req.user.id });
  if (!exam) {
    return res.status(404).json({ message: 'Exam not found or access denied' });
  }

  // Get all submissions for this exam
  const submissions = await Submission.find({ examId });

  // Populate student details for each submission
  const submissionsWithDetails = await Promise.all(
    submissions.map(async (sub) => {
      const student = await User.findById(sub.studentId);
      return {
        id: sub.id || sub._id,
        studentId: sub.studentId,
        studentName: student?.name || 'Unknown',
        studentEmail: student?.email || 'N/A',
        score: sub.score || 0,
        maxScore: sub.maxScore || exam.totalMarks || 0,
        status: sub.status,
        submittedAt: sub.submittedAt,
        startedAt: sub.startedAt,
      };
    })
  );

  res.json({ submissions: submissionsWithDetails });
});

export const getSubmissionDetails = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  const submission = await Submission.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  // Verify the exam belongs to this faculty
  const exam = await Exam.findOne({ _id: submission.examId, createdBy: req.user.id });
  if (!exam) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Get student details
  const student = await User.findById(submission.studentId);

  // Populate full submission with exam and student details
  const submissionDetails = {
    id: submission.id || submission._id,
    studentId: submission.studentId,
    studentName: student?.name || 'Unknown',
    studentEmail: student?.email || 'N/A',
    examId: exam.id || exam._id,
    examTitle: exam.title,
    score: submission.score || 0,
    maxScore: submission.maxScore || exam.totalMarks || 0,
    status: submission.status,
    submittedAt: submission.submittedAt,
    startedAt: submission.startedAt,
    answers: submission.answers || [],
    // Include exam questions for comparison
    mcqQuestions: exam.mcqQuestions || [],
    codingQuestions: exam.codingQuestions || [],
  };

  res.json({ submission: submissionDetails });
});

export const gradeSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { score, feedback } = req.body;

  const submission = await Submission.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  // Verify the exam belongs to this faculty
  const exam = await Exam.findOne({ _id: submission.examId, createdBy: req.user.id });
  if (!exam) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Update submission with manual grade
  const updated = await Submission.updateById(submission._id || submission.id, {
    score: score !== undefined ? score : submission.score,
    feedback: feedback || submission.feedback,
    status: 'graded',
  });

  // Send email notification to student
  const student = await User.findById(submission.studentId);
  if (student && student.email) {
    const { sendEmail } = await import('../../utils/emailService.js');
    
    const finalScore = score !== undefined ? score : submission.score;
    const maxScore = submission.maxScore || exam.totalMarks || 0;
    const percentage = maxScore > 0 ? ((finalScore / maxScore) * 100).toFixed(1) : 0;
    
    sendEmail(student.email, 'submissionGraded', {
      studentName: student.name,
      examTitle: exam.title,
      score: finalScore,
      maxScore: maxScore,
      percentage: percentage,
      feedback: feedback || submission.feedback,
      submissionUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/progress`,
    }).catch(err => console.error('Email notification error:', err));
  }

  res.json({ 
    message: 'Submission graded successfully',
    submission: updated 
  });
});
