import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    NewspaperIcon,
    UserGroupIcon,
    GlobeAltIcon,
    CogIcon,
    AcademicCapIcon,
    DocumentTextIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../auth/AuthContext';
import { logout } from '../../services/authService';


const SideBarAdmin = () => {
    const location = useLocation();
    // const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        } else {
            console.log('Token ditemukan:', token);
        }
    }, []);

    const handleLogout = async () => {
        logout();
        navigate('/login');
    };



    const navItems = [
        {
            name: 'Dashboard',
            icon: <CogIcon className="h-5 w-5" />,
            path: '/admin/dashboard',
            roles: ['superadmin']
        },
        {
            name: 'Kelola Postingan',
            icon: <NewspaperIcon className="h-5 w-5" />,
            path: '/admin/kelola-postingan',
            roles: ['admin', 'superadmin']
        },
        {
            name: 'Kelola Pengguna',
            icon: <UserGroupIcon className="h-5 w-5" />,
            path: '/admin/kelola-pengguna',
            roles: ['superadmin']
        },
        {
            name: 'Kelola Guru',
            icon: <AcademicCapIcon className="h-5 w-5" />,
            path: '/admin/kelola-guru',
            roles: ['superadmin']
        },
        {
            name: 'Kelola Panorama',
            icon: <GlobeAltIcon className="h-5 w-5" />,
            path: '/admin/kelola-virtual-tour',
            roles: ['superadmin']
        }
    ];



    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
            <div className="flex-grow">
                <div className="p-4 border-b border-gray-700 text-center">
                    <h2 className="text-xl font-semibold">SDN GADUNGAN 2</h2>
                </div>
                <nav className="mt-4">
                    {navItems.map((item) => {
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-6 py-3 ${location.pathname === item.path
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded"
                >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    <span className="ml-3">Keluar</span>
                </button>
            </div>
        </div>
    );
};

export default SideBarAdmin;