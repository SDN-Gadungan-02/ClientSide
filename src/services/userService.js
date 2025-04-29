import api from './api';

const UserService = {
    getUsers: (search = '') => api.get(`/users?search=${search}`),
    createUser: (data) => api.post('/users', data),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

export default UserService;