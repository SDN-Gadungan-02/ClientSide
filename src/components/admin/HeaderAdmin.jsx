import React from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../auth/AuthContext';
import { useLocation } from 'react-router-dom';

const pageTitles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/kelola-postingan': 'Kelola Postingan',
    '/admin/kelola-pengguna': 'Kelola Pengguna',
    '/admin/kelola-guru': 'Kelola Guru',
    '/admin/kelola-virtual-tour': 'Kelola Panorama'
};

const HeaderAdmin = () => {
    const { user } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Judul Halaman */}
                    <div className="flex items-center">
                        <Typography variant="h5" className="text-gray-800 font-medium">
                            {pageTitles[currentPath] || Object.values(pageTitles).find(title => currentPath.startsWith(Object.keys(pageTitles).find(path => currentPath.startsWith(path))))}
                        </Typography>
                    </div>

                    {/* Info Pengguna */}
                    <div className="flex items-center space-x-2">
                        <UserIcon className='w-4 h-4' />
                        <Typography variant="small" className="text-gray-700">
                            Hi, {user?.username || 'Admin'}
                        </Typography>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;