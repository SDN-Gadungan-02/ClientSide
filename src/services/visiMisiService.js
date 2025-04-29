import api from './api';

const VisiMisiService = {
    getVisiMisi: () => api.get('/visi-misi'),
    updateVisiMisi: (data) => api.put('/visi-misi', data),
};

export default VisiMisiService;