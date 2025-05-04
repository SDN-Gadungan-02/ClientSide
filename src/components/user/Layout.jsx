import React from 'react';
import HeaderUser from './HeaderUser';
import FooterUser from './FooterUser';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderUser />
            <main className="flex-1">
                <Outlet />
            </main>
            <FooterUser />
        </div>
    );
}

export default Layout;