import express from 'express';
import {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  respondToMeeting,
  suggestMeetingSlots,
  cancelMeeting
} from '../controllers/meetingController.js';
import { protect, isExcomOrHigher } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, isExcomOrHigher, createMeeting);
router.post('/suggest-slots', protect, suggestMeetingSlots);
router.get('/', protect, getMeetings);
router.get('/:id', protect, getMeeting);
router.put('/:id', protect, updateMeeting);
router.put('/:id/respond', protect, respondToMeeting);
router.delete('/:id', protect, cancelMeeting);

export default router;
