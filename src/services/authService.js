import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    timeout: 10000
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            return {
                success: true,
                user: response.data.user,
                token: response.data.token
            };
        }
        return {
            success: false,
            message: 'Login failed - no token received'
        };
    } catch (error) {
        console.error('Login error details:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed',
            error: error.response?.data?.error || 'LOGIN_FAILED'
        };
    }
};

const verify = async () => {
    try {
        const response = await api.get('/auth/verify');

        if (response.data.success) {
            console.log('Verify successful:', response.data.user);
            return {
                success: true,
                user: response.data.user
            };
        }

        console.log('Verify failed:', response.data.message);
        return {
            success: false,
            message: response.data.message
        };
    } catch (error) {
        console.error('Verify request failed:', error);
        return {
            success: false,
            message: 'Authentication service unavailable'
        };
    }
};

const logout = async () => {
    try {
        console.log('Attempting logout');
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout request failed:', error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        delete api.defaults.headers.common['Authorization'];
        console.log('Client-side auth cleaned up');
    }
};

export { login, verify, logout, api };