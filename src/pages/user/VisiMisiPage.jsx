import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import VisiMisiService from '../../services/visiMisiService';

const VisiMisiPage = () => {
    const [visiMisi, setVisiMisi] = useState({
        text_visi: "Memuat...",
        text_misi: ["Memuat..."],
        text_tujuan: ["Memuat..."]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSection, setExpandedSection] = useState({
        visi: true,
        misi: true,
        tujuan: true
    });

    const processTextArray = (text) => {
        if (!text) return [];
        if (Array.isArray(text)) return text.filter(item => item.trim());
        return text.split('|')
            .map(item => item.trim())
            .filter(item => item && !item.toLowerCase().includes("belum tersedia"));
    };

    useEffect(() => {
        const fetchVisiMisi = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await VisiMisiService.getVisiMisi();
                const data = response?.data || response;

                setVisiMisi({
                    text_visi: data.text_visi || "Visi sekolah belum tersedia",
                    text_misi: processTextArray(data.text_misi).length > 0
                        ? processTextArray(data.text_misi)
                        : ["Misi sekolah belum tersedia"],
                    text_tujuan: processTextArray(data.text_tujuan).length > 0
                        ? processTextArray(data.text_tujuan)
                        : ["Tujuan sekolah belum tersedia"]
                });

                setLoading(false);
            } catch (err) {
                console.error("Error loading visi misi:", err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
                setVisiMisi({
                    text_visi: "Visi sekolah belum tersedia",
                    text_misi: ["Misi sekolah belum tersedia"],
                    text_tujuan: ["Tujuan sekolah belum tersedia"]
                });
            }
        };

        fetchVisiMisi();
    }, []);

    const toggleSection = (section) => {
        setExpandedSection(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-normalGreenColor h-12 w-12"></div>
                </div>
                <Typography variant="h5" className="mt-4 text-gray-600">Memuat data...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <Typography color="red" variant="h5" className="text-center max-w-md">
                    Gagal memuat data: {error}
                </Typography>
                <Button color="blue" className="mt-4" onClick={() => window.location.reload()}>
                    Coba Lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
                <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="bg-mediumGreenColor py-6 px-8">
                        <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-center text-white">
                            Visi, Misi & Tujuan Sekolah
                        </Typography>
                    </div>

                    <CardBody className="p-0">
                        {/* Visi Section */}
                        <div className={`border-b border-gray-200 transition-all duration-300 ${expandedSection.visi ? 'bg-white' : 'bg-gray-50'}`}>
                            <div
                                className="flex justify-between items-center p-6 cursor-pointer hover:bg-blue-50"
                                onClick={() => toggleSection('visi')}
                            >
                                <Typography variant="h3" className="text-xl font-bold text-blue-gray-800 flex items-center">
                                    <div className="w-3 h-3 bg-darkGreenColor rounded-full mr-3"></div>
                                    Visi Sekolah
                                </Typography>
                                {expandedSection.visi ? (
                                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            {expandedSection.visi && (
                                <div className="px-6 pb-6 pt-2">
                                    <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-darkGreenColor">
                                        <Typography className="text-gray-700 text-lg italic">
                                            "{visiMisi.text_visi}"
                                        </Typography>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Misi Section */}
                        <div className={`border-b border-gray-200 transition-all duration-300 ${expandedSection.misi ? 'bg-white' : 'bg-gray-50'}`}>
                            <div
                                className="flex justify-between items-center p-6 cursor-pointer hover:bg-blue-50"
                                onClick={() => toggleSection('misi')}
                            >
                                <Typography variant="h3" className="text-xl font-bold text-blue-gray-800 flex items-center">
                                    <div className="w-3 h-3 bg-darkGreenColor rounded-full mr-3"></div>
                                    Misi Sekolah
                                </Typography>
                                {expandedSection.misi ? (
                                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            {expandedSection.misi && (
                                <div className="px-6 pb-6 pt-2">
                                    <ul className="space-y-3">
                                        {visiMisi.text_misi.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex-shrink-0 mt-1 mr-4">
                                                    <div className="w-8 h-8 rounded-full bg-normalGreenColor text-darkGreenColor flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <Typography className="text-gray-700">
                                                    {item}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Tujuan Section */}
                        <div className={`transition-all duration-300 ${expandedSection.tujuan ? 'bg-white' : 'bg-gray-50'}`}>
                            <div
                                className="flex justify-between items-center p-6 cursor-pointer hover:bg-blue-50"
                                onClick={() => toggleSection('tujuan')}
                            >
                                <Typography variant="h3" className="text-xl font-bold text-blue-gray-800 flex items-center">
                                    <div className="w-3 h-3 bg-darkGreenColor rounded-full mr-3"></div>
                                    Tujuan Sekolah
                                </Typography>
                                {expandedSection.tujuan ? (
                                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            {expandedSection.tujuan && (
                                <div className="px-6 pb-6 pt-2">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {visiMisi.text_tujuan.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-4 rounded-lg border-l-4 border-mediumGreenColor shadow-sm hover:shadow-md transition-all"
                                            >
                                                <Typography variant="h6" className="text-darkGreenColor mb-2">
                                                    Tujuan {index + 1}
                                                </Typography>
                                                <Typography className="text-gray-700">
                                                    {item}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VisiMisiPage;