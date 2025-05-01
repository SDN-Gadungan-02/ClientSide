import api from '../utils/api';

const TeacherService = {
    getTeachers: async (searchTerm = '') => {
        try {
            const response = await api.get(`/teachers?search=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createTeacher: async (formData) => {
        try {
            const response = await api.post('/teachers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateTeacher: async (id, formData) => {
        try {
            const response = await api.put(`/teachers/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteTeacher: async (id) => {
        try {
            await api.delete(`/teachers/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default TeacherService;