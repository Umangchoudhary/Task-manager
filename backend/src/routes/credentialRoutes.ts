import express from 'express';
import {
  getCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
} from '../controllers/credentialController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getCredentials)
  .post(protect, createCredential);

router.route('/:id')
  .put(protect, updateCredential)
  .delete(protect, deleteCredential);

export default router;
