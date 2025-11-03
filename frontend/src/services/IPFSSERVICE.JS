export const ipfsService = {
    /**
     * Upload file lên IPFS
     * @param {File} file
     * @returns {Promise<string>} - IPFS hash
     */
    uploadToIPFS: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/ipfs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get file từ IPFS
     * @param {string} ipfsHash
     * @returns {Promise<Blob>}
     */
    getFromIPFS: async (ipfsHash) => {
        const response = await api.get(`/ipfs/${ipfsHash}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    /**
     * Get IPFS gateway URL
     * @param {string} ipfsHash
     * @returns {string}
     */
    getGatewayUrl: (ipfsHash) => {
        return `https://ipfs.io/ipfs/${ipfsHash}`;
    },
};