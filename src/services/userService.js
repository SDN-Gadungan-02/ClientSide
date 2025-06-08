import api from '../utils/api';

const UserService = {
    getUsers: async (searchTerm = '') => {
        try {
            const response = await api.get(`/users`, {
                params: {
                    search: searchTerm,

                }
            });

            // Pastikan response memiliki struktur yang benar
            if (response.data && Array.isArray(response.data.data)) {
                return response;
            }

            throw new Error('Invalid response structure');
        } catch (error) {
            console.error('Error in UserService.getUsers:', error);
            throw error;
        }
    },

    createUser: async (data) => {
        try {
            const response = api.post('/users', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // services/userService.js
    updateUser: async (id, data) => {
        try {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            await api.delete(`/users/${id}`);
        } catch (error) {
            throw error;
        }
    },
};

export default UserService;