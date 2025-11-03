// src/utils/fileCleanup.js
import fs from 'fs';

export const cleanupFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('File cleanup error:', error);
    }
};