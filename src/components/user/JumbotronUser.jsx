import React, { useState, useEffect } from "react";
import {
    Typography,
    IconButton
} from "@material-tailwind/react";
import {
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon
} from "@heroicons/react/24/solid";

const JumbotronUser = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "https://source.unsplash.com/random/1600x900?sig=1&school",
            title: "Selamat Datang di SDN GADUNGAN 2",
            subtitle: "Sekolah Unggul Berbasis Teknologi Informasi dan Karakter Bangsa"
        },
        {
            image: "https://source.unsplash.com/random/1600x900?sig=2&classroom",
            title: "Pendidikan Berkualitas",
            subtitle: "Menyiapkan Generasi Unggul untuk Masa Depan"
        },
        {
            image: "https://source.unsplash.com/random/1600x900?sig=3&library",
            title: "Fasilitas Modern",
            subtitle: "Lingkungan Belajar yang Nyaman dan Berteknologi"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="relative h-[530px] overflow-hidden bg-inherit">
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-1000 ease-in-out"
                style={{
                    width: `${slides.length * 100}%`,
                    transform: `translateX(-${currentSlide * (100 / slides.length)}%)`
                }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex items-center justify-center bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            flex: `0 0 ${100 / slides.length}%`
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="container mx-auto px-4 z-10 text-center">
                            <Typography variant="h1" className="text-white mb-4">
                                {slide.title}
                            </Typography>
                            <Typography variant="lead" className="text-gray-300 mb-8">
                                {slide.subtitle}
                            </Typography>
                            <div className="flex gap-4 justify-center">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
                                    Profil Sekolah
                                </button>
                                <button className="bg-transparent hover:bg-white text-white hover:text-blue-800 font-bold py-2 px-6 border border-white rounded">
                                    Kontak Kami
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-1 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default JumbotronUser;