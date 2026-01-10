import express from 'express';
import { googleLogin, login } from '../controllers/authController';

const router = express.Router();

// Google Login
router.post('/google-login', googleLogin);

// Regular Login
router.post('/login', login);

export default router;

