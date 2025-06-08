import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import VisiMisiService from '../../services/visiMisiService';

const VisiMisiPage = () => {
    const [visiMisi, setVisiMisi] = useState({
        text_visi: "Memuat...",
        text_misi: ["Memuat..."],
        text_tujuan: ["Memuat..."]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Same processing function as HomePage
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

                // Same API call pattern as HomePage
                const response = await VisiMisiService.getVisiMisi();
                const data = response?.data || response;

                // Same data processing as HomePage
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

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <Typography variant="h5">Memuat data...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <Typography color="red" variant="h5">
                    Error: {error}
                </Typography>
            </div>
        );
    }

    // Render method similar to HomePage but with different layout
    return (
        <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
                <Card className="shadow-lg rounded-xl overflow-hidden">
                    <CardBody className="p-6 md:p-8">
                        <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-800">
                            Visi Misi & Tujuan
                        </Typography>

                        {/* Visi Section */}
                        <div className="mb-10">
                            <Typography variant="h3" className="text-2xl font-bold mb-4 text-blue-grey">
                                Visi
                            </Typography>
                            <Typography className="text-gray-700 text-lg whitespace-pre-line">
                                {visiMisi.text_visi}
                            </Typography>
                        </div>

                        {/* Misi Section */}
                        <div className="mb-10">
                            <Typography variant="h3" className="text-2xl font-bold mb-4 text-blue-grey">
                                Misi
                            </Typography>
                            <ol className="list-decimal pl-6 space-y-2">
                                {visiMisi.text_misi.map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                        {item}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Tujuan Section */}
                        <div>
                            <Typography variant="h3" className="text-2xl font-bold mb-4 text-blue-grey">
                                Tujuan
                            </Typography>
                            <ol className="list-decimal pl-6 space-y-3">
                                {visiMisi.text_tujuan.map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                        {item}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VisiMisiPage;