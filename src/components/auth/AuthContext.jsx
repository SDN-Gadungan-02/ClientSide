import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, verify, api } from '../../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        loading: true,
        error: null
    });

    const login = async (username, password) => {
        try {
            const result = await apiLogin(username, password);

            if (result.success) {
                setAuthState({
                    user: result.user,
                    loading: false,
                    error: null
                });
                return {
                    success: true,
                    user: result.user
                };
            } else {
                setAuthState({
                    user: null,
                    loading: false,
                    error: result.message
                });
                return {
                    success: false,
                    message: result.message
                };
            }
        } catch (error) {
            setAuthState({
                user: null,
                loading: false,
                error: error.message
            });
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    };

    const initializeAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setAuthState({ isAuthenticated: false, user: null });
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const { success, user } = await verify();
            if (success) {
                setAuthState({ isAuthenticated: true, user });
            } else {
                localStorage.removeItem('token');
                setAuthState({ isAuthenticated: false, user: null });
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            setAuthState({ isAuthenticated: false, user: null });
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            initializeAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};