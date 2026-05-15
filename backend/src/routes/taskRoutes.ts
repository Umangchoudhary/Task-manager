import express from 'express';
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask, getTaskStats } from '../controllers/taskController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/stats', protect, getTaskStats);

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.route('/:id')
  .put(protect, admin, updateTask)
  .delete(protect, admin, deleteTask);

router.route('/:id/status')
  .patch(protect, updateTaskStatus); // Any member can update status

export default router;
