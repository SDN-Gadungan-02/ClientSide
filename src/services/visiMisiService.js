import api from '../utils/api';

const VisiMisiService = {
    getVisiMisi: async () => {
        try {
            const response = await api.get('/visimisi');
            // Pastikan response.data memiliki struktur yang benar
            return {
                ...response.data,
                text_misi: Array.isArray(response.data.text_misi) ?
                    response.data.text_misi :
                    (response.data.text_misi || "").split('|').filter(Boolean),
                text_tujuan: Array.isArray(response.data.text_tujuan) ?
                    response.data.text_tujuan :
                    (response.data.text_tujuan || "").split('|').filter(Boolean)
            };
        } catch (error) {
            console.error('Error fetching visi misi:', error);
            throw error;
        }
    },
    updateVisiMisi: async (data) => {
        try {
            const response = await api.put('/visimisi', {
                ...data,
                text_misi: Array.isArray(data.text_misi) ? data.text_misi.join('|') : data.text_misi,
                text_tujuan: Array.isArray(data.text_tujuan) ? data.text_tujuan.join('|') : data.text_tujuan
            });
            return response.data;
        } catch (error) {
            console.error('Error updating visi misi:', error);
            throw error;
        }
    }
};

export default VisiMisiService;