import api from './api';

export const authService = {
    /**
     * Đăng ký user mới
     * @param {object} userData - { username, email, password }
     * @returns {Promise}
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Đăng nhập
     * @param {object} credentials - { email, password }
     * @returns {Promise}
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Logout
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Get current user
     * @returns {Promise}
     */
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};