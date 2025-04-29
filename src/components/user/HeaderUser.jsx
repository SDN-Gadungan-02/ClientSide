import React, { useState, useEffect } from "react";
import {
    Navbar,
    Typography,
    IconButton,
    Input
} from "@material-tailwind/react";
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon
} from "@heroicons/react/24/solid";
import logo from "../../assets/react.svg";

export default function Header() {
    const [openNav, setOpenNav] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Beranda", href: "#" },
        { name: "Visi dan Misi", href: "#visi" },
        { name: "Virtual Tour 360", href: "#virtual" },
        { name: "Profil Sekolah", href: "#profil" },
        { name: "Postingan", href: "#postingan" },
    ];

    return (
        <div className="sticky top-0 z-50 w-full">
            {/* Top Header */}
            <div className={`bg-blue-800 text-white transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden py-0' : 'py-2'}`}>
                <div className="container mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">Jl. Veteran No. 45, Kebumen</span>
                    </div>
                    <div className="hidden sm:flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">(0287) 381407</span>
                    </div>
                    <div className="hidden md:flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">sdngadungan02@gmail.com</span>
                    </div>
                </div>
            </div>

            {/* Main Header - Full Width */}
            <Navbar className="w-full max-w-full rounded-none px-4 py-3 shadow-none border-b">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="h-10 w-10" />
                        <Typography variant="h5" className="cursor-pointer">
                            <span className="block text-gray-900 text-medium">SDN GADUNGAN 02</span>
                        </Typography>
                    </div>

                    {/* Desktop Nav + Search */}
                    <div className="hidden lg:flex items-center gap-8">
                        <ul className="flex gap-8"> {/* Increased gap */}
                            {navItems.map((item) => (
                                <Typography
                                    as="li"
                                    key={item.name}
                                    variant="paragraph"
                                    className="font-medium"
                                >
                                    <a
                                        href={item.href}
                                        className="flex items-center py-2 px-3 text-blackColor hover:text-blue-600 transition-colors text-lg" /* Larger text and padding */
                                    >
                                        {item.name}
                                    </a>
                                </Typography>
                            ))}
                        </ul>

                        {/* Search Button - Desktop */}

                    </div>

                    {/* Mobile Controls */}
                    <div className="flex lg:hidden items-center gap-4">

                        <IconButton
                            variant="text"
                            onClick={() => setOpenNav(!openNav)}
                        >
                            {openNav ? (
                                <XMarkIcon className="h-5 w-5" />
                            ) : (
                                <Bars3Icon className="h-5 w-5" />
                            )}
                        </IconButton>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {openNav && (
                    <div className="lg:hidden mt-4 pb-4 space-y-3 container mx-auto">
                        {navItems.map((item) => (
                            <a
                                key={`mobile-${item.name}`}
                                href={item.href}
                                className="block p-3 text-lg text-blackColor hover:bg-gray-100 rounded-lg text-center"
                            >
                                {item.name}
                            </a>
                        ))}

                    </div>
                )}
            </Navbar>
        </div>
    );
}