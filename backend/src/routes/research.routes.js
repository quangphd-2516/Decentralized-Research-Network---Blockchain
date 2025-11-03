import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';
import {
    uploadResearch,
    getResearchList,
    getResearchById,
    getMyResearches,
    deleteResearch,
    grantAccess,
    revokeAccess,
    downloadResearch,
    getAccessList,
} from '../controllers/research.controller.js';

const router = express.Router();

// Public routes
router.get('/', getResearchList);
router.get('/:id', getResearchById);

// Protected routes
router.post('/upload', authenticate, upload.single('file'), uploadResearch);
router.get('/my', authenticate, getMyResearches);
router.delete('/:id', authenticate, deleteResearch);
router.post('/:id/grant', authenticate, grantAccess);
router.post('/:id/revoke', authenticate, revokeAccess);
router.get('/:id/download', authenticate, downloadResearch);
router.get('/:id/access-list', authenticate, getAccessList);

export default router;