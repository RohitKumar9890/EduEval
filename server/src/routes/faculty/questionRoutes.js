import { Router } from 'express';
import { body } from 'express-validator';
import {
  parseQuestions,
  generateQuestions,
  getTemplates,
  validateQuestionsEndpoint
} from '../../controllers/faculty/questionImportController.js';

const router = Router();

// Parse questions from text
router.post(
  '/parse',
  [body('text').isString().isLength({ min: 10 })],
  parseQuestions
);

// Generate questions using AI
router.post(
  '/generate',
  [
    body('syllabus').isString().isLength({ min: 10 }),
    body('type').optional().isIn(['mcq', 'coding', 'theory', 'mixed']),
    body('count').optional().isInt({ min: 1, max: 50 }),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard'])
  ],
  generateQuestions
);

// Get template examples
router.get('/templates', getTemplates);

// Validate questions
router.post(
  '/validate',
  [body('questions').isArray()],
  validateQuestionsEndpoint
);

export default router;
