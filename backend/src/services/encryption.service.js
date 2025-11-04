// src/services/encryption.service.js
import crypto from 'crypto';
import fs from 'fs';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8').slice(0, 32); // 32 bytes key cho AES-256
const IV_LENGTH = 16; // 16 bytes cho AES

export const encryptionService = {
    // Tạo AES key ngẫu nhiên
    generateAESKey: () => crypto.randomBytes(32).toString('hex'),

    // Mã hóa file nhị phân dùng AES-256-CBC
    encryptFile: (filePath, aesKey) => {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const iv = crypto.randomBytes(IV_LENGTH);
            const key = Buffer.from(aesKey, 'hex');
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
            return Buffer.concat([iv, encrypted]); // prepend IV để giải mã
        } catch (error) {
            throw new Error('Encryption failed: ' + error.message);
        }
    },

    // Giải mã file
    decryptFile: (encryptedData, aesKey) => {
        try {
            const key = Buffer.from(aesKey, 'hex');
            const iv = encryptedData.subarray(0, IV_LENGTH);
            const data = encryptedData.subarray(IV_LENGTH);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message);
        }
    },

    // Mã hóa AES key bằng master key
    encryptKey: (aesKey) => {
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            ENCRYPTION_KEY,
            Buffer.alloc(IV_LENGTH, 0)
        );
        const encrypted = Buffer.concat([
            cipher.update(aesKey, 'utf8'),
            cipher.final(),
        ]);
        return encrypted.toString('base64');
    },

    // Giải mã AES key
    decryptKey: (encryptedKey) => {
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            ENCRYPTION_KEY,
            Buffer.alloc(IV_LENGTH, 0)
        );
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encryptedKey, 'base64')),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    },
};
