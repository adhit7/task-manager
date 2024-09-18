import express from 'express';
import {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validation } from '../utils/validation.js';
import { taskSchema } from '../utils/taskSchema.js';

const router = express.Router();

// @desc  Register
router.route('/create').post(protect, validation(taskSchema), createTask);

// @desc  Login
router.route('/all').get(protect, getAllTask);

// @desc  Google Auth
router.route('/update').put(protect, updateTask);

// @desc  Google Callback
router.route('/:id').delete(protect, deleteTask);

export default router;
