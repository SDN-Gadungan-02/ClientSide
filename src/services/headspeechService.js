import api from "../utils/api";

const HeadSpeechService = {
    getHeadSpeech: async () => {
        try {
            const response = await api.get("/head-speech");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateHeadSpeech: async (text_speech) => {  // Ubah parameter menjadi text_speech
        try {
            const response = await api.put("/head-speech", { text_speech }); // Sesuaikan dengan nama field yang diharapkan backend
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default HeadSpeechService;