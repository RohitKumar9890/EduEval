import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Exam } from '../../models/Exam.js';
import { Submission } from '../../models/Submission.js';

const sanitizeExamForStudent = (exam) => {
  if (!exam) return exam;
  const copy = { ...exam };

  // Remove correct answers / hidden testcases
  if (Array.isArray(copy.mcqQuestions)) {
    copy.mcqQuestions = copy.mcqQuestions.map((q) => ({
      prompt: q.prompt,
      marks: q.marks,
      difficulty: q.difficulty,
      options: q.options,
    }));
  }

  if (Array.isArray(copy.codingQuestions)) {
    copy.codingQuestions = copy.codingQuestions.map((q) => ({
      prompt: q.prompt,
      marks: q.marks,
      difficulty: q.difficulty,
      starterCode: q.starterCode,
      language: q.language,
      testCases: (q.testCases || []).filter((t) => !t.isHidden).map((t) => ({ input: t.input })),
    }));
  }

  return copy;
};

export const listPublishedExams = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.subjectId) filter.subjectId = req.query.subjectId;

  let exams = await Exam.find(filter);
  
  // Sort manually (Firestore compatible)
  exams.sort((a, b) => {
    const dateA = a.createdAt?._seconds || a.createdAt?.seconds || new Date(a.createdAt).getTime() / 1000;
    const dateB = b.createdAt?._seconds || b.createdAt?.seconds || new Date(b.createdAt).getTime() / 1000;
    return dateB - dateA;
  });
  
  // Manually populate subject info and sanitize for each exam
  for (let i = 0; i < exams.length; i++) {
    exams[i] = sanitizeExamForStudent(exams[i]);
    
    if (exams[i].subjectId) {
      const { Subject } = await import('../../models/Subject.js');
      const subject = await Subject.findById(exams[i].subjectId);
      if (subject) {
        exams[i].subject = { id: subject.id || subject._id, name: subject.name, code: subject.code };
      }
    }
  }

  res.json({ exams });
});

export const getPublishedExam = asyncHandler(async (req, res) => {
  let exam = await Exam.findOne({ _id: req.params.id, isPublished: true });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  // Manually populate subject
  if (exam.subjectId) {
    const { Subject } = await import('../../models/Subject.js');
    const subject = await Subject.findById(exam.subjectId);
    if (subject) {
      exam.subject = { id: subject.id || subject._id, name: subject.name, code: subject.code };
    }
  }

  res.json({ exam: sanitizeExamForStudent(exam) });
});

export const startAttempt = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, isPublished: true });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  // Check if submission already exists
  let submission = await Submission.findOne({ 
    examId: exam._id || exam.id, 
    studentId: req.user.id 
  });

  if (!submission) {
    // Create new submission
    submission = await Submission.create({
      examId: exam._id || exam.id,
      studentId: req.user.id,
      status: 'in_progress',
      answers: [],
      score: 0,
      maxScore: exam.totalMarks || 0
    });
  }

  res.status(201).json({ submission });
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const exam = await Exam.findOne({ _id: req.params.id, isPublished: true });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const submission = await Submission.findOne({ examId: exam._id || exam.id, studentId: req.user.id });
  if (!submission) return res.status(400).json({ message: 'Attempt not started' });
  if (submission.status === 'submitted') return res.status(400).json({ message: 'Already submitted' });

  // Auto-grade MCQ
  let score = 0;
  const mcqAnswers = req.body.mcqAnswers || [];
  for (const ans of mcqAnswers) {
    const q = exam.mcqQuestions?.[ans.questionIndex];
    if (!q) continue;
    if (q.correctOptionIndex === ans.selectedOptionIndex) score += q.marks || 0;
  }

  // Update submission using Firestore method
  const updated = await Submission.updateById(submission._id || submission.id, {
    answers: [...mcqAnswers, ...(req.body.codingAnswers || [])],
    score: score,
    status: 'submitted',
    submittedAt: new Date()
  });

  res.json({ submission: updated });
});

export const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findOne({ 
    examId: req.params.id, 
    studentId: req.user.id 
  });
  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  
  // Manually populate exam info
  if (submission.examId) {
    const exam = await Exam.findById(submission.examId);
    if (exam) {
      submission.exam = { 
        id: exam.id || exam._id, 
        title: exam.title, 
        type: exam.type, 
        totalMarks: exam.totalMarks 
      };
    }
  }
  
  res.json({ submission });
});
