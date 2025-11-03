export const blockchainService = {
    /**
     * Gọi smart contract để lưu research hash
     * @param {string} ipfsHash
     * @param {object} metadata
     * @returns {Promise}
     */
    registerResearch: async (ipfsHash, metadata) => {
        const response = await api.post('/blockchain/register', {
            ipfsHash,
            metadata,
        });
        return response.data;
    },

    /**
     * Get transaction info
     * @param {string} txHash
     * @returns {Promise}
     */
    getTransaction: async (txHash) => {
        const response = await api.get(`/blockchain/tx/${txHash}`);
        return response.data;
    },

    /**
     * Verify research on blockchain
     * @param {string} researchId
     * @returns {Promise}
     */
    verifyResearch: async (researchId) => {
        const response = await api.get(`/blockchain/verify/${researchId}`);
        return response.data;
    },
};