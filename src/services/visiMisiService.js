import api from '../utils/api';

const VisiMisiService = {
    getVisiMisi: async () => {
        try {
            const response = await api.get('/visimisi');
            const data = response.data;

            // Ensure we always have valid arrays
            const processText = (text) => {
                if (Array.isArray(text)) return text;
                if (!text) return [];
                const items = text.split('|')
                    .map(item => item.trim())
                    .filter(item => item && !item.toLowerCase().includes("belum tersedia"));
                return items.length > 0 ? items : ["Belum tersedia"];
            };

            console.log('Visi Misi Data:', data);

            return {
                ...data,
                text_visi: data.text_visi || "Visi sekolah belum tersedia",
                text_misi: processText(data.text_misi),
                text_tujuan: processText(data.text_tujuan)
            };
        } catch (error) {
            console.error('Error fetching visi misi:', error);
            return {
                text_visi: "Visi sekolah belum tersedia",
                text_misi: ["Misi sekolah belum tersedia"],
                text_tujuan: ["Tujuan sekolah belum tersedia"]
            };
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