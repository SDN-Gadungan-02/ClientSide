import React from "react";
import { Typography } from "@material-tailwind/react";
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function FooterUser() {
    const footerLinks = [
        {
            title: "Tautan Cepat",
            links: [
                { name: "Beranda", href: "/" },
                { name: "Profil Sekolah", href: "/profil" },
                { name: "Visi & Misi", href: "/visi-misi" },
                { name: "Berita Terkini", href: "/berita" },
            ],
        },
    ];

    return (
        <footer className="relative z-50 bg-darkGreenColor text-white py-8">
            {/* Overlay untuk memastikan background tidak terlihat */}
            <div className="absolute inset-0 bg-darkGreenColor -z-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {/* Logo Sekolah */}
                    <div className="col-span-1">
                        <Typography variant="h5" className="mb-4">
                            <span className="block text-white">SDN GADUNGAN 2</span>
                        </Typography>
                        <Typography className="text-gray-300">
                            Sekolah Unggul Berbasis Teknologi Informasi dan Karakter Bangsa
                        </Typography>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section, index) => (
                        <div key={index} className="col-span-1">
                            <Typography variant="h6" className="mb-4 text-whiteColor">
                                {section.title}
                            </Typography>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Kontak */}
                    <div className="col-span-1">
                        <Typography variant="h6" className="mb-4 text-whiteColor">
                            Kontak Kami
                        </Typography>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300">
                                    Jl. Veteran No. 45, Kebumen 54312
                                </span>
                            </li>
                            <li className="flex items-center">
                                <PhoneIcon className="h-5 w-5 mr-2" />
                                <span className="text-gray-300">(0287) 381407</span>
                            </li>
                            <li className="flex items-center">
                                <EnvelopeIcon className="h-5 w-5 mr-2" />
                                <span className="text-gray-300">sdngadungan02@gmail.com</span>
                            </li>
                            <li className="flex items-center">
                                <ClockIcon className="h-5 w-5 mr-2" />
                                <span className="text-gray-300">Senin-Jumat: 07.00-15.00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-lightGreenColor mt-8 pt-6 text-center text-whiteColor">
                    <Typography variant="small">
                        © {new Date().getFullYear()} SDN GADUNGAN 2. All rights reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    );
}