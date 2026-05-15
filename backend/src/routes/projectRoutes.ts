import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

export default router;
