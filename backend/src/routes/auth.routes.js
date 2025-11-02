import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRegister, validateLogin } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);

export default router;