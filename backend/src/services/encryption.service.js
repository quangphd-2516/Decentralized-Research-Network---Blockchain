// src/services/encryption.service.js
import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import fs from 'fs';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export const encryptionService = {
    /**
     * Generate random AES key
     */
    generateAESKey: () => {
        return crypto.randomBytes(32).toString('hex');
    },

    /**
     * Encrypt file với AES-256
     * @param {string} filePath - Path to file
     * @param {string} aesKey - AES key
     * @returns {Buffer} - Encrypted file data
     */
    encryptFile: (filePath, aesKey) => {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const encrypted = CryptoJS.AES.encrypt(
                fileBuffer.toString('base64'),
                aesKey
            ).toString();
            return Buffer.from(encrypted);
        } catch (error) {
            throw new Error('Encryption failed: ' + error.message);
        }
    },

    /**
     * Decrypt file
     * @param {Buffer} encryptedData - Encrypted file data
     * @param {string} aesKey - AES key
     * @returns {Buffer} - Decrypted file data
     */
    decryptFile: (encryptedData, aesKey) => {
        try {
            const decrypted = CryptoJS.AES.decrypt(
                encryptedData.toString(),
                aesKey
            );
            const base64Data = decrypted.toString(CryptoJS.enc.Utf8);
            return Buffer.from(base64Data, 'base64');
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message);
        }
    },

    /**
     * Encrypt AES key với master key (simple approach)
     * Trong production nên dùng RSA public/private key của user
     * @param {string} aesKey
     * @returns {string}
     */
    encryptKey: (aesKey) => {
        return CryptoJS.AES.encrypt(aesKey, ENCRYPTION_KEY).toString();
    },

    /**
     * Decrypt AES key
     * @param {string} encryptedKey
     * @returns {string}
     */
    decryptKey: (encryptedKey) => {
        const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    },

    /**
     * Generate RSA key pair cho user (BONUS - for future)
     */
    generateRSAKeyPair: () => {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
        return { publicKey, privateKey };
    },
};