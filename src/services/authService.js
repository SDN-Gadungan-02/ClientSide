import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    timeout: 10000 // Tambahkan timeout
});

// Interceptor untuk handle token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor response dengan penanganan error lebih baik
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject({
                message: 'Request timeout',
                error: 'TIMEOUT'
            });
        }

        if (error.response?.status === 401) {
            console.log('Token invalid/expired, redirecting to login');
            localStorage.removeItem('token');
            // Hindari infinite loop
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return {
            success: true,
            user: response.data.user
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed'
        };
    }
};

export const verify = async () => {
    try {
        const response = await api.get('/auth/verify');
        return {
            success: true,
            user: response.data.user
        };
    } catch (error) {
        return {
            success: false,
            user: null
        };
    }
};
