import { asyncHandler } from '../../utils/asyncHandler.js';
import { Material } from '../../models/Material.js';
import { Subject } from '../../models/Subject.js';

export const getMyMaterials = asyncHandler(async (req, res) => {
  // Get all materials (in a full implementation, this would be filtered by enrolled subjects)
  const materials = await Material.find({});
  
  res.json({ materials });
});

export const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }
  
  res.json({ subject });
});
