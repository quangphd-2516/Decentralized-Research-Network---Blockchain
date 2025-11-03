// VERSION 1: Dùng Pinata SDK
import pinata from '../config/pinata.js';
import { Readable } from 'stream';

export const ipfsService = {
    /**
     * Upload buffer lên Pinata
     * @param {Buffer} buffer - File data
     * @returns {Promise<string>} - IPFS hash
     */
    uploadBuffer: async (buffer) => {
        try {
            // Convert buffer to readable stream
            const stream = Readable.from(buffer);

            const result = await pinata.pinFileToIPFS(stream, {
                pinataMetadata: {
                    name: `research-${Date.now()}`,
                },
                pinataOptions: {
                    cidVersion: 0,
                },
            });

            console.log('✅ Uploaded to IPFS:', result.IpfsHash);
            return result.IpfsHash;
        } catch (error) {
            console.error('IPFS upload error:', error);
            throw new Error('IPFS upload failed: ' + error.message);
        }
    },

    /**
     * Upload file từ path
     * @param {string} filePath - Path to file
     * @returns {Promise<string>} - IPFS hash
     */
    uploadFile: async (filePath) => {
        try {
            const result = await pinata.pinFromFS(filePath, {
                pinataMetadata: {
                    name: `research-${Date.now()}`,
                },
            });

            return result.IpfsHash;
        } catch (error) {
            throw new Error('IPFS upload failed: ' + error.message);
        }
    },

    /**
     * Get file từ IPFS (Pinata Gateway)
     * @param {string} ipfsHash - IPFS hash
     * @returns {Promise<Buffer>} - File data
     */
    getFile: async (ipfsHash) => {
        try {
            const axios = (await import('axios')).default;
            const response = await axios.get(
                `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
                { responseType: 'arraybuffer' }
            );

            return Buffer.from(response.data);
        } catch (error) {
            throw new Error('IPFS download failed: ' + error.message);
        }
    },

    /**
     * Get gateway URL
     * @param {string} ipfsHash
     * @returns {string}
     */
    getGatewayUrl: (ipfsHash) => {
        return `${process.env.IPFS_GATEWAY}${ipfsHash}`;
    },

    /**
     * Unpin file (xóa khỏi Pinata)
     * @param {string} ipfsHash
     * @returns {Promise}
     */
    unpinFile: async (ipfsHash) => {
        try {
            await pinata.unpin(ipfsHash);
            console.log('✅ Unpinned from Pinata:', ipfsHash);
        } catch (error) {
            console.error('Unpin error:', error);
        }
    },
};
