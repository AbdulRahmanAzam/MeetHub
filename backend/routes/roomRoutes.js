import express from 'express';
import {
  createRoom,
  getRooms,
  getRoomAvailability,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, isAdmin, createRoom);
router.get('/', protect, getRooms);
router.get('/:id/availability', protect, getRoomAvailability);
router.put('/:id', protect, isAdmin, updateRoom);
router.delete('/:id', protect, isAdmin, deleteRoom);

export default router;
