import express from 'express';
import {
  createPoll,
  getPolls,
  getPoll,
  voteOnPoll,
  closePoll,
  deletePoll
} from '../controllers/pollController.js';
import { protect, isExcomOrHigher } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, isExcomOrHigher, createPoll);
router.get('/', protect, getPolls);
router.get('/:id', protect, getPoll);
router.post('/:id/vote', protect, voteOnPoll);
router.put('/:id/close', protect, closePoll);
router.delete('/:id', protect, deletePoll);

export default router;
