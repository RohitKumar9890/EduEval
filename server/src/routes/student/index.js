import { Router } from 'express';
import examRoutes from './examRoutes.js';
import { getMyProgress } from '../../controllers/student/progressController.js';
import { joinExamByCode, getMyEnrolledExams } from '../../controllers/student/enrollmentController.js';
import { getMyMaterials, getSubjectById } from '../../controllers/student/materialController.js';
import { getMyAnnouncements } from '../../controllers/student/announcementController.js';

const router = Router();

router.get('/progress', getMyProgress);
router.post('/join-exam', joinExamByCode);
router.get('/my-exams', getMyEnrolledExams);
router.get('/materials', getMyMaterials);
router.get('/subjects/:id', getSubjectById);
router.get('/announcements', getMyAnnouncements);
router.use('/exams', examRoutes);

export default router;
