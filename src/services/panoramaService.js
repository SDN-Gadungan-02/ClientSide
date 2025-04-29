import api from './api';

const PanoramaService = {
    getPanoramas: (search = '') => api.get(`/panorama?search=${search}`),
    createPanorama: (data) => api.post('/panorama', data),
    updatePanorama: (id, data) => api.put(`/panorama/${id}`, data),
    deletePanorama: (id) => api.delete(`/panorama/${id}`),
};

export default PanoramaService;