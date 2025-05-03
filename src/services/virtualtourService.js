import api from '../utils/api';

const VirtualTourService = {
    getPanoramas: async (search = '') => {
        try {
            const response = await api.get('/virtualtour', {
                params: { search }
            });
            return response.data.data || []; // Akses properti data yang benar
        } catch (error) {
            console.error('Error fetching panoramas:', error);
            return [];
        }
    },

    getHotspots: async (panoramaId) => {
        try {
            const response = await api.get(`/virtualtour/${panoramaId}/hotspots`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching hotspots:', error);
            return [];
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

    // services/virtualtourService.js
    createVirtualTour: async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await api.post('/virtualtour', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
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

    // services/virtualtourService.js
    createHotspot: async (panoramaId, hotspotData) => {
        try {
            const response = await api.post(`/virtualtour/${panoramaId}/hotspots`, hotspotData, {
                headers: {
                    'Content-Type': 'application/json'
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

export default VirtualTourService