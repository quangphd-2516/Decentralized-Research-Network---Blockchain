import express from 'express';
import authRoutes from './auth.routes.js';
import researchRoutes from './research.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/research', researchRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API documentation
router.get('/routes', (req, res) => {
    res.json({
        success: true,
        message: 'Available API routes',
        routes: {
            auth: {
                'POST /api/auth/register': 'Register new user',
                'POST /api/auth/login': 'Login',
                'GET /api/auth/me': 'Get current user (protected)',
            },
            research: {
                'POST /api/research/upload': 'Upload research (protected)',
                'GET /api/research': 'Get list (public)',
                'GET /api/research/:id': 'Get detail (public)',
                'GET /api/research/my': 'My researches (protected)',
                'DELETE /api/research/:id': 'Delete (protected)',
                'POST /api/research/:id/grant': 'Grant access (protected)',
                'POST /api/research/:id/revoke': 'Revoke access (protected)',
                'GET /api/research/:id/download': 'Download file (protected)',
                'GET /api/research/:id/access-list': 'Get access list (protected)',
            },
        },
    });
});

export default router;