import express from 'express';
import { registerUser, loginUser, getUserProfile, getUsers } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, getUsers);

export default router;
