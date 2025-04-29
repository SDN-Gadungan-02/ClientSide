import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, verify } from '../../services/authService';

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
                return { success: true };
            } else {
                setAuthState({
                    user: null,
                    loading: false,
                    error: result.message
                });
                return { success: false, message: result.message };
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
            const result = await verify();
            setAuthState({
                user: result.user || null,
                loading: false,
                error: null
            });
        } catch (error) {
            setAuthState({
                user: null,
                loading: false,
                error: error.message
            });
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