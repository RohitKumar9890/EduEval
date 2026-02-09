import { Material } from '../../models/Material.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { uploadToFirebase, deleteFromFirebase } from '../../config/storage.js';

// Upload material with file
export const uploadMaterial = asyncHandler(async (req, res) => {
  const { title, description, subjectId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Upload to Firebase Storage
  const uploadResult = await uploadToFirebase(file, 'materials');

  // Create material record
  const material = new Material({
    title,
    description,
    subjectId,
    facultyId: req.user.id,
    fileName: uploadResult.fileName,
    fileUrl: uploadResult.fileUrl,
    filePath: uploadResult.filePath,
    fileSize: uploadResult.fileSize,
    fileType: uploadResult.fileType,
  });

  await material.save();

  res.status(201).json({
    message: 'Material uploaded successfully',
    material,
  });
});

// Delete material and file
export const deleteMaterialWithFile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const material = await Material.findById(id);
  if (!material) {
    return res.status(404).json({ message: 'Material not found' });
  }

  // Check ownership
  if (material.facultyId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Delete file from Firebase if it exists
  if (material.filePath) {
    try {
      await deleteFromFirebase(material.filePath);
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      // Continue with deletion even if file delete fails
    }
  }

  await material.deleteOne();

  res.json({ message: 'Material deleted successfully' });
});

// Get download stats
export const trackDownload = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const material = await Material.findById(id);
  if (!material) {
    return res.status(404).json({ message: 'Material not found' });
  }

  // Increment download count
  material.downloadCount = (material.downloadCount || 0) + 1;
  material.lastDownloadedAt = new Date();
  
  // Track who downloaded
  if (!material.downloadedBy) {
    material.downloadedBy = [];
  }
  
  if (!material.downloadedBy.includes(req.user.id)) {
    material.downloadedBy.push(req.user.id);
  }

  await material.save();

  res.json({
    message: 'Download tracked',
    downloadCount: material.downloadCount,
  });
});
