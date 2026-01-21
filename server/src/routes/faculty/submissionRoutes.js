import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  getExamSubmissions,
  getSubmissionDetails,
  gradeSubmission,
} from '../../controllers/faculty/submissionController.js';

const router = Router();

// Get all submissions for a specific exam
router.get('/exam/:examId', [
  param('examId').isString().isLength({ min: 12 })
], getExamSubmissions);

// Get detailed view of a specific submission
router.get('/:submissionId', [
  param('submissionId').isString().isLength({ min: 12 })
], getSubmissionDetails);

// Grade a submission (manual grading)
router.post('/:submissionId/grade', [
  param('submissionId').isString().isLength({ min: 12 }),
  body('score').optional().isNumeric(),
  body('feedback').optional().isString(),
], gradeSubmission);

export default router;
