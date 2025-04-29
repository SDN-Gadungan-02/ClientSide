import React from 'react';
import { Typography } from '@material-tailwind/react';
import { HeartIcon } from '@heroicons/react/24/solid';

const FooterAdmin = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <Typography variant="small" className="text-gray-600 mb-2 md:mb-0">
                        &copy; {new Date().getFullYear()} SDN Gadungan 02. All rights reserved.
                    </Typography>

                    <div className="flex items-center">
                        <Typography variant="small" className="text-gray-600 mr-2">
                            Made with
                        </Typography>
                        <HeartIcon className="h-4 w-4 text-red-500" />
                        <Typography variant="small" className="text-gray-600 ml-2">
                            by Tim Pengembang SDN Gadungan 02
                        </Typography>
                    </div>

                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            <Typography variant="small">Kebijakan Privasi</Typography>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            <Typography variant="small">Syarat & Ketentuan</Typography>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            <Typography variant="small">Bantuan</Typography>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterAdmin;