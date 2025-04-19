import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Ganti dengan endpoint Anda
                    const response = await axios.get('http://localhost:5000/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            // Ganti dengan endpoint login Anda
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);

            if (user.role === 'admin' || user.role === 'superadmin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login-admin');
    };

    // const value = {
    //     user,
    //     loading,
    //     login,
    //     logout,
    //     isAuthenticated: !!user,
    //     isAdmin: user?.role === 'admin',
    //     isSuperAdmin: user?.role === 'superadmin'
    // };

    // Di AuthContext.js (sementara)
    const value = {
        user: { role: 'superadmin' }, // Hapus ini setelah fix
        login: async () => true,
        logout: () => { },
        isAuthenticated: true,
        isAdmin: true,
        isSuperAdmin: true
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}