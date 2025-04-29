import api from './api';

const ProfileService = {
    getProfile: (search = '') => api.get(`/profil-sekolah?search=${search}`),
    createProfile: (data) => api.post('/profil-sekolah', data),
    updateProfile: (id, data) => api.put(`/profil-sekolah/${id}`, data),
    deleteProfile: (id) => api.delete(`/profil-sekolah/${id}`),
};

export default ProfileService;