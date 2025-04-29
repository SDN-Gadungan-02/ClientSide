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
                    user: result.user,  // Make sure this contains the full user object
                    loading: false,
                    error: null
                });
                return {
                    success: true,
                    user: result.user  // Explicitly return the user object
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

    // AuthContext.jsx
    const initializeAuth = async () => {
        try {
            console.log('Initializing auth...');
            const result = await verify();

            if (result.success) {
                console.log('Auth initialized with user:', result.user);
                setAuthState({
                    user: result.user,
                    loading: false,
                    error: null
                });
            } else {
                console.log('Auth initialization failed:', result.message);
                setAuthState({
                    user: null,
                    loading: false,
                    error: result.message
                });
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            setAuthState({
                user: null,
                loading: false,
                error: 'Failed to initialize authentication'
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