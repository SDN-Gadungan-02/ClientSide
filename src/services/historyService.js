import api from '../utils/api';

const HistoryService = {
    getHistory: async () => {
        try {
            const response = await api.get('/history')
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateHistory: async (formData) => {
        try {
            const response = await api.put(`/history`, formData)
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}
export default HistoryService;