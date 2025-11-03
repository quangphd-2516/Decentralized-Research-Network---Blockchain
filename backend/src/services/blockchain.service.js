// src/services/blockchain.service.js
import { ethers } from 'ethers';

// Simple contract ABI (chỉ cần function registerResearch)
const CONTRACT_ABI = [
    'function registerResearch(string ipfsHash, string title, address author) public returns (uint256)',
    'function getResearch(uint256 id) public view returns (string, string, address, uint256)',
];

export const blockchainService = {
    /**
     * Get contract instance
     */
    getContract: () => {
        const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            CONTRACT_ABI,
            wallet
        );
        return contract;
    },

    /**
     * Register research on blockchain
     * @param {string} ipfsHash
     * @param {string} title
     * @param {string} authorAddress
     * @returns {Promise<string>} - Transaction hash
     */
    registerResearch: async (ipfsHash, title, authorAddress) => {
        try {
            const contract = blockchainService.getContract();
            const tx = await contract.registerResearch(ipfsHash, title, authorAddress);
            const receipt = await tx.wait();
            return receipt.hash;
        } catch (error) {
            console.error('Blockchain registration failed:', error);
            // Don't throw error, just return null
            // Vì blockchain không phải critical feature
            return null;
        }
    },

    /**
     * Verify research on blockchain
     * @param {uint256} researchId
     * @returns {Promise<object>}
     */
    verifyResearch: async (researchId) => {
        try {
            const contract = blockchainService.getContract();
            const research = await contract.getResearch(researchId);
            return {
                ipfsHash: research[0],
                title: research[1],
                author: research[2],
                timestamp: research[3],
            };
        } catch (error) {
            throw new Error('Verification failed: ' + error.message);
        }
    },
};
