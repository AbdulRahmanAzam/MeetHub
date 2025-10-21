import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, isExcomOrHigher } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, isExcomOrHigher, createAnnouncement);
router.get('/', protect, getAnnouncements);
router.get('/:id', protect, getAnnouncement);
router.put('/:id', protect, updateAnnouncement);
router.delete('/:id', protect, deleteAnnouncement);

export default router;
