import express from 'express';
import {
  createSociety,
  getSociety,
  updateSociety,
  joinSociety,
  assignRole,
  getSocietyMembers
} from '../controllers/societyController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createSociety);
router.post('/join', protect, joinSociety);
router.get('/:id', protect, getSociety);
router.put('/:id', protect, isAdmin, updateSociety);
router.put('/:id/members/:userId/role', protect, isAdmin, assignRole);
router.get('/:id/members', protect, getSocietyMembers);

export default router;
