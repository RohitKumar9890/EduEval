import express from 'express';
import { param } from 'express-validator';
import { 
  generateStudentProgressPDF, 
  generateStudentProgressExcel,
  generateClassReport,
  generateOfficialTranscript 
} from '../controllers/reportController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student routes
router.get(
  '/student/progress/pdf',
  requireAuth,
  requireRole(['student', 'faculty', 'admin']),
  generateStudentProgressPDF
);

router.get(
  '/student/progress/excel',
  requireAuth,
  requireRole(['student', 'faculty', 'admin']),
  generateStudentProgressExcel
);

router.get(
  '/student/:studentId/progress/pdf',
  requireAuth,
  requireRole(['faculty', 'admin']),
  [param('studentId').isString()],
  generateStudentProgressPDF
);

router.get(
  '/student/:studentId/progress/excel',
  requireAuth,
  requireRole(['faculty', 'admin']),
  [param('studentId').isString()],
  generateStudentProgressExcel
);

router.get(
  '/student/transcript',
  requireAuth,
  requireRole(['student', 'faculty', 'admin']),
  generateOfficialTranscript
);

router.get(
  '/student/:studentId/transcript',
  requireAuth,
  requireRole(['faculty', 'admin']),
  [param('studentId').isString()],
  generateOfficialTranscript
);

// Faculty/Admin routes
router.get(
  '/class/excel',
  requireAuth,
  requireRole(['faculty', 'admin']),
  generateClassReport
);

export default router;
