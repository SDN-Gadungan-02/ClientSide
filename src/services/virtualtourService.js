import api from '../utils/api';

const VirtualTourService = {
    getPanoramas: async (search = '') => {
        try {
            const response = await api.get(`/virtualtour?search=${encodeURIComponent(search)}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getVirtualTour: async (id) => {
        try {
            const response = await api.get(`/virtualtour/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createVirtualTour: async (formData) => {
        try {
            const response = await api.post('/virtualtour', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateVirtualTour: async (id, formData) => {
        try {
            const response = await api.put(`/virtualtour/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteVirtualTour: async (id) => {
        try {
            await api.delete(`/virtualtour/${id}`);
        } catch (error) {
            throw error;
        }
    },

    createVirtualTour: async (formData) => {
        try {
            const response = await api.post('/virtualtour', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateHotspot: async (panoramaId, hotspotId, hotspotData) => {
        try {
            const response = await api.put(`/virtualtour/${panoramaId}/hotspots/${hotspotId}`, hotspotData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteHotspot: async (panoramaId, hotspotId) => {
        try {
            await api.delete(`/virtualtour/${panoramaId}/hotspots/${hotspotId}`);
        } catch (error) {
            throw error;
        }
    }
};

export default VirtualTourService;