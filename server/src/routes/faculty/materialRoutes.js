import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  listMaterials,
  createMaterial,
  deleteMaterial,
} from '../../controllers/faculty/materialController.js';
import { uploadMaterial, deleteMaterialWithFile, trackDownload } from '../../controllers/faculty/materialUploadController.js';
import { upload } from '../../config/storage.js';

const router = Router();

router.get('/', listMaterials);

// URL-based material creation (legacy)
router.post(
  '/',
  [
    body('subjectId').isString().isLength({ min: 12 }),
    body('title').isString().isLength({ min: 1 }),
    body('type').optional().isIn(['pdf', 'doc', 'link', 'video', 'other']),
    body('fileUrl').optional().isString(),
    body('linkUrl').optional().isString(),
  ],
  createMaterial
);

// File upload route (new)
router.post(
  '/upload',
  upload.single('file'),
  [
    body('title').isString().isLength({ min: 3 }),
    body('subjectId').isString().isLength({ min: 12 }),
  ],
  uploadMaterial
);

// Track download
router.post('/:id/download', [param('id').isString().isLength({ min: 12 })], trackDownload);

// Delete with file
router.delete('/:id/with-file', [param('id').isString().isLength({ min: 12 })], deleteMaterialWithFile);

router.delete('/:id', [param('id').isString().isLength({ min: 12 })], deleteMaterial);

export default router;
