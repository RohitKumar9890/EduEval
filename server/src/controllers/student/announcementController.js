import { asyncHandler } from '../../utils/asyncHandler.js';
import { Announcement } from '../../models/Announcement.js';

export const getMyAnnouncements = asyncHandler(async (req, res) => {
  // Get all announcements (in a full implementation, this would be filtered by enrolled subjects)
  let announcements = await Announcement.find({});
  
  // Sort by creation date, newest first
  announcements.sort((a, b) => {
    const dateA = a.createdAt?._seconds || a.createdAt?.seconds || new Date(a.createdAt).getTime() / 1000;
    const dateB = b.createdAt?._seconds || b.createdAt?.seconds || new Date(b.createdAt).getTime() / 1000;
    return dateB - dateA;
  });
  
  res.json({ announcements });
});
