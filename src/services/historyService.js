import api from './api';

const HistoryService = {
    getSejarah: () => api.get('/sejarah'),
    updateSejarah: (data) => api.put('/sejarah', data),
};

export default HistoryService;