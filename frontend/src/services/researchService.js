import api from './api';

export const researchService = {
    /**
     * Upload research mới
     * @param {FormData} formData - File + metadata
     * @returns {Promise}
     */
    uploadResearch: async (formData) => {
        const response = await api.post('/research/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Lấy danh sách research (có filter)
     * @param {object} params - { page, limit, category, search }
     * @returns {Promise}
     */
    getResearchList: async (params = {}) => {
        const response = await api.get('/research', { params });
        return response.data;
    },

    /**
     * Lấy chi tiết research theo ID
     * @param {string} id
     * @returns {Promise}
     */
    getResearchById: async (id) => {
        const response = await api.get(`/research/${id}`);
        return response.data;
    },

    /**
     * Lấy research của user hiện tại
     * @returns {Promise}
     */
    getMyResearches: async () => {
        const response = await api.get('/research/my');
        return response.data;
    },

    /**
     * Xóa research
     * @param {string} id
     * @returns {Promise}
     */
    deleteResearch: async (id) => {
        const response = await api.delete(`/research/${id}`);
        return response.data;
    },

    /**
     * Grant access cho user khác
     * @param {string} researchId
     * @param {string} userEmail - Email của user được grant
     * @returns {Promise}
     */
    grantAccess: async (researchId, userEmail) => {
        const response = await api.post(`/research/${researchId}/grant`, {
            userEmail,
        });
        return response.data;
    },

    /**
     * Revoke access
     * @param {string} researchId
     * @param {string} userId
     * @returns {Promise}
     */
    revokeAccess: async (researchId, userId) => {
        const response = await api.post(`/research/${researchId}/revoke`, {
            userId,
        });
        return response.data;
    },

    /**
     * Download research file
     * @param {string} id
     * @returns {Promise} - Blob data
     */
    downloadResearch: async (id) => {
        const response = await api.get(`/research/${id}/download`, {
            responseType: 'blob',
        });

        // Extract filename from Content-Disposition
        const disposition = response.headers?.['content-disposition'] || '';
        let filename = `research-${id}`;
        const cdMatch = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
        if (cdMatch) {
            filename = decodeURIComponent(cdMatch[1] || cdMatch[2]);
        }

        // Preserve MIME from server
        const contentType = response.headers?.['content-type'] || 'application/octet-stream';
        const blob = new Blob([response.data], { type: contentType });

        return { blob, filename };
    },

    /**
     * Lấy access list của research
     * @param {string} id
     * @returns {Promise}
     */
    getAccessList: async (id) => {
        const response = await api.get(`/research/${id}/access-list`);
        return response.data;
    },
    /**
   * Lấy researches được share cho mình
   * @returns {Promise}
   */
    getAccessedResearches: async () => {
        const response = await api.get('/research/accessed');
        return response.data;
    },

};