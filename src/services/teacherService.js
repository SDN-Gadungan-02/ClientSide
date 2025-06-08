import api from '../utils/api';

const TeacherService = {
    // Di TeacherService.js
    getTeachers: async (searchTerm = '') => {
        try {
            const response = await api.get(`/teachers`, {
                params: {
                    search: searchTerm,

                }
            });
            console.log('Response from TeacherService.getTeachers:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in TeacherService.getTeachers:', error);
            throw error;
        }
    },

    createTeacher: async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Tambahkan ini
                },
                transformRequest: (data) => data
            };

            const response = await api.post('/teachers', formData, config);
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response?.data);
            throw error;
        }
    },

    updateTeacher: async (id, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Tambahkan ini
                },
                transformRequest: (data) => data
            };

            const response = await api.put(`/teachers/${id}`, formData, config);
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response?.data);
            throw error;
        }
    },

    deleteTeacher: async (id) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Tambahkan ini
                }
            };
            await api.delete(`/teachers/${id}`, config);
        } catch (error) {
            console.error('Error details:', error.response?.data);
            throw error;
        }
    }
};

export default TeacherService;