// src/controllers/research.controller.js
import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { encryptionService } from '../services/encryption.service.js';
import { ipfsService } from '../services/ipfs.service.js';
import { blockchainService } from '../services/blockchain.service.js';
import { cleanupFile } from '../utils/fileCleanup.js';
import fs from 'fs';

export const uploadResearch = async (req, res) => {
    let tempFilePath = null;

    try {
        const { title, description, category, tags, isPublic } = req.body;
        const file = req.file;

        if (!file) {
            return errorResponse(res, 'Vui lòng chọn file', 400);
        }

        tempFilePath = file.path;

        // 1. Generate AES key
        const aesKey = encryptionService.generateAESKey();

        // 2. Encrypt file
        console.log('Encrypting file...');
        const encryptedBuffer = encryptionService.encryptFile(tempFilePath, aesKey);

        // 3. Upload encrypted file to IPFS
        console.log('Uploading to IPFS...');
        const ipfsHash = await ipfsService.uploadBuffer(encryptedBuffer);
        console.log('IPFS Hash:', ipfsHash);

        // 4. Encrypt AES key
        const encryptedKey = encryptionService.encryptKey(aesKey);

        // 5. Save to database
        const research = await prisma.research.create({
            data: {
                title,
                description,
                category,
                tags: tags ? tags.split(',').map((t) => t.trim()) : [],
                isPublic: isPublic === 'true',
                ipfsHash,
                encryptedKey,
                authorId: req.userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        // 6. Register on blockchain (non-blocking)
        blockchainService
            .registerResearch(ipfsHash, title, req.userId)
            .then((txHash) => {
                if (txHash) {
                    // Save transaction
                    prisma.transaction.create({
                        data: {
                            researchId: research.id,
                            txType: 'UPLOAD',
                            txHash,
                        },
                    });
                }
            })
            .catch((err) => console.error('Blockchain error:', err));

        // 7. Cleanup temp file
        cleanupFile(tempFilePath);

        return successResponse(
            res,
            { research },
            'Upload thành công',
            201
        );
    } catch (error) {
        console.error('Upload error:', error);
        if (tempFilePath) cleanupFile(tempFilePath);
        return errorResponse(res, 'Upload thất bại: ' + error.message, 500);
    }
};

export const getResearchList = async (req, res) => {
    try {
        const { page = 1, limit = 12, category, search } = req.query;

        const where = {};

        // Filter by category
        if (category) {
            where.category = category;
        }

        // Search in title and description
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Only show public researches or user's own researches
        if (!req.userId) {
            where.isPublic = true;
        } else {
            where.OR = [
                { isPublic: true },
                { authorId: req.userId },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [researches, total] = await Promise.all([
            prisma.research.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            }),
            prisma.research.count({ where }),
        ]);

        return successResponse(res, {
            researches,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Get list error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};

export const getResearchById = async (req, res) => {
    try {
        const { id } = req.params;

        const research = await prisma.research.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                transactions: {
                    select: {
                        txHash: true,
                        txType: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!research) {
            return errorResponse(res, 'Không tìm thấy nghiên cứu', 404);
        }

        // Check access permission
        const hasAccess =
            research.isPublic ||
            research.authorId === req.userId ||
            (req.userId &&
                (await prisma.accessGrant.findFirst({
                    where: {
                        researchId: id,
                        userId: req.userId,
                    },
                })));

        // Add txHash to response
        const txHash = research.transactions[0]?.txHash || null;

        return successResponse(res, {
            research: {
                ...research,
                txHash,
                hasAccess,
            },
        });
    } catch (error) {
        console.error('Get detail error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};

export const getMyResearches = async (req, res) => {
    try {
        const researches = await prisma.research.findMany({
            where: { authorId: req.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return successResponse(res, { researches });
    } catch (error) {
        console.error('Get my researches error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};

export const deleteResearch = async (req, res) => {
    try {
        const { id } = req.params;

        const research = await prisma.research.findUnique({
            where: { id },
        });

        if (!research) {
            return errorResponse(res, 'Không tìm thấy nghiên cứu', 404);
        }

        if (research.authorId !== req.userId) {
            return errorResponse(res, 'Không có quyền xóa', 403);
        }

        await prisma.research.delete({
            where: { id },
        });

        return successResponse(res, null, 'Đã xóa nghiên cứu');
    } catch (error) {
        console.error('Delete error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};

export const downloadResearch = async (req, res) => {
    try {
        const { id } = req.params;

        const research = await prisma.research.findUnique({
            where: { id },
        });

        if (!research) {
            return errorResponse(res, 'Không tìm thấy nghiên cứu', 404);
        }

        // Check permission
        const hasAccess =
            research.isPublic ||
            research.authorId === req.userId ||
            (await prisma.accessGrant.findFirst({
                where: {
                    researchId: id,
                    userId: req.userId,
                },
            }));

        if (!hasAccess) {
            return errorResponse(res, 'Không có quyền truy cập', 403);
        }

        // 1. Get encrypted file từ IPFS
        console.log('Downloading from IPFS...');
        const encryptedBuffer = await ipfsService.getFile(research.ipfsHash);

        // 2. Decrypt AES key
        const aesKey = encryptionService.decryptKey(research.encryptedKey);

        // 3. Decrypt file
        console.log('Decrypting file...');
        const decryptedBuffer = encryptionService.decryptFile(encryptedBuffer, aesKey);

        // 4. Send file
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${research.title}.pdf"`);
        res.send(decryptedBuffer);
    } catch (error) {
        console.error('Download error:', error);
        return errorResponse(res, 'Không thể tải file: ' + error.message, 500);
    }
};

export const grantAccess = async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;

        const research = await prisma.research.findUnique({
            where: { id },
        });

        if (!research) {
            return errorResponse(res, 'Không tìm thấy nghiên cứu', 404);
        }

        if (research.authorId !== req.userId) {
            return errorResponse(res, 'Chỉ tác giả mới có thể cấp quyền', 403);
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return errorResponse(res, 'Không tìm thấy user', 404);
        }

        // Check if already granted
        const existing = await prisma.accessGrant.findUnique({
            where: {
                researchId_userId: {
                    researchId: id,
                    userId: user.id,
                },
            },
        });

        if (existing) {
            return errorResponse(res, 'User đã có quyền truy cập', 400);
        }

        // Create access grant
        const accessGrant = await prisma.accessGrant.create({
            data: {
                researchId: id,
                userId: user.id,
                decryptionKey: research.encryptedKey, // Same key for now
            },
        });

        return successResponse(res, { accessGrant }, 'Đã cấp quyền truy cập');
    } catch (error) {
        console.error('Grant access error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};

export const revokeAccess = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const research = await prisma.research.findUnique({
            where: { id },
        });

        if (!research) {
            return errorResponse(res, 'Không tìm thấy nghiên cứu', 404);
        }

        if (research.authorId !== req.userId) {
            return errorResponse(res, 'Chỉ tác giả mới có thể thu hồi quyền', 403);
        }

        await prisma.accessGrant.delete({
            where: {
                researchId_userId: {
                    researchId: id,
                    userId,
                },
            },
        });

        return successResponse(res, null, 'Đã thu hồi quyền truy cập');
    } catch (error) {
        console.error('Revoke access error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};

export const getAccessList = async (req, res) => {
    try {
        const { id } = req.params;

        const research = await prisma.research.findUnique({
            where: { id },
        });

        if (!research) {
            return errorResponse(res, 'Không tìm thấy nghiên cứu', 404);
        }

        if (research.authorId !== req.userId) {
            return errorResponse(res, 'Chỉ tác giả mới có thể xem danh sách', 403);
        }

        const accessList = await prisma.accessGrant.findMany({
            where: { researchId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        return successResponse(res, { accessList });
    } catch (error) {
        console.error('Get access list error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};

export const getAccessedResearches = async (req, res) => {
    try {
        // Lấy các research mà user được grant access
        const accessGrants = await prisma.accessGrant.findMany({
            where: { userId: req.userId },
            include: {
                research: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });

        const researches = accessGrants.map((grant) => grant.research);

        return successResponse(res, { researches });
    } catch (error) {
        console.error('Get accessed researches error:', error);
        return errorResponse(res, 'Lỗi server', 500);
    }
};