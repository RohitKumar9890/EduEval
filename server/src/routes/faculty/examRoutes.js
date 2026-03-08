import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createExam,
  listMyExams,
  getExam,
  updateExam,
  publishExam,
  unpublishExam,
  deleteExam,
} from '../../controllers/faculty/examController.js';
import { cloneExam } from '../../controllers/faculty/examTemplateController.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.get('/', listMyExams);
router.post(
  '/',
  [
    body('title').isString().isLength({ min: 1 }),
    body('type').isIn(['mcq', 'quiz', 'coding']),
    body('subjectId').isString().isLength({ min: 6 }),
    body('durationMinutes').isInt({ min: 1 }),
    body('totalMarks').isInt({ min: 0 }),
    body('startsAt').optional().isISO8601(),
    body('endsAt').optional().isISO8601(),
    body('mcqQuestions').optional().isArray(),
    body('codingQuestions').optional().isArray(),
    body('instructions').optional().isString(),
    body('passingMarks').optional().isInt({ min: 0 }),
    body('randomizeQuestions').optional().isBoolean(),
    body('showResultsImmediately').optional().isBoolean(),
    body('allowReview').optional().isBoolean(),
    body('isPublished').optional().isBoolean(),
  ],
  createExam
);

router.get('/:id', [param('id').isString().isLength({ min: 6 })], getExam);

router.patch(
  '/:id',
  [
    param('id').isString().isLength({ min: 6 }),
    body('title').optional().isString().isLength({ min: 1 }),
    body('type').optional().isIn(['mcq', 'quiz', 'coding']),
    body('subjectId').optional().isString().isLength({ min: 6 }),
    body('durationMinutes').optional().isInt({ min: 1 }),
    body('totalMarks').optional().isInt({ min: 0 }),
    body('startsAt').optional().isISO8601(),
    body('endsAt').optional().isISO8601(),
    body('mcqQuestions').optional().isArray(),
    body('codingQuestions').optional().isArray(),
    body('instructions').optional().isString(),
    body('passingMarks').optional().isInt({ min: 0 }),
    body('randomizeQuestions').optional().isBoolean(),
    body('showResultsImmediately').optional().isBoolean(),
    body('allowReview').optional().isBoolean(),
    body('isPublished').optional().isBoolean(),
  ],
  updateExam
);

// Clone exam
router.post(
  '/:id/clone',
  [
    param('id').isString().isLength({ min: 6 }),
    body('title').optional().isString().isLength({ min: 3, max: 200 }),
    body('durationMinutes').optional().isInt({ min: 1, max: 480 }),
    body('totalMarks').optional().isInt({ min: 1 }),
    body('startsAt').optional().isISO8601().toDate(),
    body('endsAt').optional().isISO8601().toDate(),
  ],
  asyncHandler(cloneExam)
);

router.post('/:id/publish', [param('id').isString().isLength({ min: 6 })], publishExam);
router.post('/:id/unpublish', [param('id').isString().isLength({ min: 6 })], unpublishExam);
router.delete('/:id', [param('id').isString().isLength({ min: 6 })], deleteExam);

export default router;
