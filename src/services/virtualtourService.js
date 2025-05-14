import api from '../utils/api';

const VirtualTourService = {
    getPanoramas: async (search = '') => {
        try {
            const response = await api.get('/virtualtour', {
                params: { search }
            });

            // Transform data with proper image URLs
            const transformedData = response.data.data.map(panorama => ({
                ...panorama,
                gambar_panorama: panorama.gambar_panorama,
                hotspots: panorama.hotspots.map(hotspot => ({
                    id: hotspot.id,
                    pitch: hotspot.pitch,
                    yaw: hotspot.yaw,
                    text: hotspot.name_deskripsi,
                    description: hotspot.deskripsi,
                    targetPanoramaId: hotspot.targetpanoramald,
                    iconUrl: hotspot.iconUrl
                }))
            }));

            return {
                success: true,
                data: transformedData
            };
        } catch (error) {
            console.error('Error fetching panoramas:', error);
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || 'Failed to load panoramas'
            };
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
            console.error('Error details:', error);
            throw error;
        }
    },

    updateVirtualTour: async (id, formData) => {
        try {
            const response = await api.put(`/virtualtour/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Update Virtual Tour Error:', error);
            throw error;
        }
    },

    // virtualtourService.js
    deleteVirtualTour: async (id) => {
        try {
            const response = await api.delete(`/virtualtour/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting virtual tour:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete virtual tour');
        }
    },

    createHotspot: async (panoramaId, hotspotData) => {
        try {
            const response = await api.post(`/virtualtour/${panoramaId}/hotspots`, {
                pitch: hotspotData.pitch,
                yaw: hotspotData.yaw,
                text: hotspotData.text,
                description: hotspotData.description,
                targetPanoramaId: hotspotData.targetPanoramaId || null
            });
            return response.data;
        } catch (error) {
            console.error('Error creating hotspot:', error);
            throw new Error(error.response?.data?.message || 'Failed to create hotspot');
        }
    },

    updateHotspot: async (panoramaId, hotspotId, hotspotData) => {
        try {
            // Ensure pitch and yaw are numbers
            const pitch = parseFloat(hotspotData.pitch);
            const yaw = parseFloat(hotspotData.yaw);


            const response = await api.put(`/virtualtour/${panoramaId}/hotspots/${hotspotId}`, {
                pitch: pitch,
                yaw: yaw,
                text: hotspotData.text,
                description: hotspotData.description || '',
                targetPanoramaId: hotspotData.targetPanoramaId || null
            });

            return {
                ...response.data,
                pitch: parseFloat(response.data.pitch),
                yaw: parseFloat(response.data.yaw)
            };
        } catch (error) {
            console.error('Error updating hotspot:', error);
            throw new Error(error.response?.data?.message || 'Failed to update hotspot');
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