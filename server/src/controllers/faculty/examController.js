import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Exam } from '../../models/Exam.js';
import { Subject } from '../../models/Subject.js';

const withQuestionCount = (exam) => {
  const mcqCount = Array.isArray(exam.mcqQuestions) ? exam.mcqQuestions.length : 0;
  const codingCount = Array.isArray(exam.codingQuestions) ? exam.codingQuestions.length : 0;
  const legacyCount = Array.isArray(exam.questions) ? exam.questions.length : 0;
  return {
    ...exam,
    totalQuestions: mcqCount + codingCount || legacyCount,
  };
};

export const listMyExams = asyncHandler(async (req, res) => {
  let exams = await Exam.find({ createdBy: req.user.id });
  
  // Sort by createdAt descending
  exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Manually populate subject info
  for (let i = 0; i < exams.length; i++) {
    exams[i] = withQuestionCount(exams[i]);
    if (exams[i].subjectId) {
      const subject = await Subject.findById(exams[i].subjectId);
      if (subject) {
        exams[i].subject = { id: subject.id, name: subject.name, code: subject.code };
      }
    }
  }
  
  res.json({ exams });
});

export const getExam = asyncHandler(async (req, res) => {
  let exam = await Exam.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  exam = withQuestionCount(exam);
  
  // Populate subject info
  if (exam.subjectId) {
    const subject = await Subject.findById(exam.subjectId);
    if (subject) {
      exam.subject = { id: subject.id, name: subject.name, code: subject.code };
    }
  }
  
  res.json({ exam });
});

export const createExam = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  // Ensure subject belongs to this faculty
  const subject = await Subject.findById(req.body.subjectId);
  if (!subject) return res.status(400).json({ message: 'Invalid subjectId' });
  if (subject.facultyId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can only create exams for your own subjects' });
  }

  const exam = await Exam.create({
    subjectId: req.body.subjectId,
    createdBy: req.user.id,
    title: req.body.title,
    type: req.body.type,
    durationMinutes: req.body.durationMinutes,
    totalMarks: req.body.totalMarks,
    startsAt: req.body.startsAt ? new Date(req.body.startsAt) : null,
    endsAt: req.body.endsAt ? new Date(req.body.endsAt) : null,
    mcqQuestions: req.body.mcqQuestions || [],
    codingQuestions: req.body.codingQuestions || [],
    instructions: req.body.instructions || '',
    passingMarks: req.body.passingMarks,
    randomizeQuestions: req.body.randomizeQuestions,
    showResultsImmediately: req.body.showResultsImmediately,
    allowReview: req.body.allowReview,
    isPublished: req.body.isPublished || false,
  });

  res.status(201).json({ exam });
});

export const updateExam = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const exam = await Exam.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const updates = {};
  for (const key of [
    'title',
    'type',
    'subjectId',
    'durationMinutes',
    'totalMarks',
    'startsAt',
    'endsAt',
    'mcqQuestions',
    'codingQuestions',
    'instructions',
    'passingMarks',
    'randomizeQuestions',
    'showResultsImmediately',
    'allowReview',
    'isPublished',
  ]) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }
  if (updates.startsAt) updates.startsAt = new Date(updates.startsAt);
  if (updates.endsAt) updates.endsAt = new Date(updates.endsAt);

  if (updates.subjectId) {
    const subject = await Subject.findById(updates.subjectId);
    if (!subject) return res.status(400).json({ message: 'Invalid subjectId' });
    if (subject.facultyId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only move exams to your own subjects' });
    }
  }

  const updatedExam = await Exam.updateById(req.params.id, updates);
  res.json({ exam: updatedExam });
});

export const publishExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  
  const updatedExam = await Exam.updateById(req.params.id, { isPublished: true });
  
  // Send email notifications to enrolled students
  if (exam.enrolledStudents && exam.enrolledStudents.length > 0) {
    const { sendBulkEmail } = await import('../../utils/emailService.js');
    const { User } = await import('../../models/User.js');
    const { Subject } = await import('../../models/Subject.js');
    
    // Get student and subject details
    const students = await Promise.all(
      exam.enrolledStudents.map(id => User.findById(id))
    );
    const subject = await Subject.findById(exam.subjectId);
    
    const validStudents = students.filter(s => s && s.email);
    
    // Send notifications
    sendBulkEmail(validStudents, 'examPublished', (student) => ({
      studentName: student.name,
      examTitle: exam.title,
      subjectName: subject?.name || 'Unknown',
      durationMinutes: exam.durationMinutes,
      totalMarks: exam.totalMarks,
      startsAt: exam.startsAt,
      endsAt: exam.endsAt,
      examCode: exam.examCode,
      examUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/exams`,
    })).catch(err => console.error('Email notification error:', err));
  }
  
  res.json({ exam: updatedExam });
});

export const unpublishExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  
  const updatedExam = await Exam.updateById(req.params.id, { isPublished: false });
  res.json({ exam: updatedExam });
});

export const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  
  await Exam.deleteById(req.params.id);
  res.json({ success: true });
});
