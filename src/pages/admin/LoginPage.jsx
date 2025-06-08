import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import logo from '../../assets/react.svg';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                if (result.user && result.user.role) {
                    const targetRoute = result.user.role === 'superadmin'
                        ? '/admin/dashboard'
                        : '/admin/posts';
                    navigate(targetRoute);
                } else {
                    setError('User data incomplete');
                }
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-row items-center justify-center bg-gray-50 p-4">
            {/* Logo Section */}
            <div className="mb-10">
                <div className="text-3xl font-bold">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-40 h-40 object-contain mb-4"
                    />

                </div>
            </div>
            <div className="w-36"></div>
            {/* Login Form Section */}
            <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-8 text-center">Login</h1>



                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-darkGreenColor text-white py-2 px-4 rounded  disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;