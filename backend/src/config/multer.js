// src/config/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo uploads folder nếu chưa có
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        '.pdf', '.doc', '.docx', '.txt', '.zip', '.rar',
    ];
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed',
        'application/vnd.rar',
        'application/x-rar-compressed',
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    const hasAllowedExt = allowedExtensions.includes(ext);
    const hasAllowedMime = allowedMimes.includes(file.mimetype);

    if (hasAllowedExt && hasAllowedMime) {
        return cb(null, true);
    }
    return cb(new Error('Chỉ chấp nhận file: PDF, DOC, DOCX, TXT, ZIP, RAR'));
};

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter,
});

export default upload;