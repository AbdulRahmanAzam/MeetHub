import express from 'express';
import {
  createDepartment,
  getDepartmentsBySociety,
  getDepartmentHierarchy,
  updateDepartment,
  addMemberToDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect, isAdmin, isExcomOrHigher } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, isExcomOrHigher, createDepartment);
router.get('/society/:societyId', protect, getDepartmentsBySociety);
router.get('/:id/hierarchy', protect, getDepartmentHierarchy);
router.put('/:id', protect, updateDepartment);
router.post('/:id/members', protect, addMemberToDepartment);
router.delete('/:id', protect, isAdmin, deleteDepartment);

export default router;
