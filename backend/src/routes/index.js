import express from 'express';
import { StatusCodes } from 'http-status-codes';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

router.get('/routes', (req, res) => {
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Available API routes',
        routes: {
            auth: {
                'POST /api/auth/register': 'Register new user',
                'POST /api/auth/login': 'Login',
                'GET /api/auth/me': 'Get current user (protected)',
            },
        },
    });
});
export default router;