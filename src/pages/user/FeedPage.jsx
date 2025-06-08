import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody, Chip, Input, Select, Option, Button } from "@material-tailwind/react";
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";
import PostService from '../../services/postService';
import { Link } from "react-router-dom";

const FeedPage = () => {
    const [allPosts, setAllPosts] = useState([]); // Semua data dari API
    const [filteredPosts, setFilteredPosts] = useState([]); // Data yang sudah difilter
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedMonth, setSelectedMonth] = useState('Semua');

    const categories = ["Semua", "Pengumuman", "Prestasi", "Kegiatan"];
    const months = [
        "Semua",
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Fetch semua data awal
    useEffect(() => {
        fetchAllPosts();
    }, []);

    // Filter data ketika parameter berubah
    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedCategory, selectedMonth, allPosts]);

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            const response = await PostService.getPosts();
            setAllPosts(response.data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setAllPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let results = [...allPosts];

        // Filter berdasarkan search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            results = results.filter(post =>
                post.title_postingan.toLowerCase().includes(searchLower) ||
                post.deskripsi_postingan.toLowerCase().includes(searchLower)
            );
        }

        // Filter berdasarkan kategori
        if (selectedCategory !== 'Semua') {
            results = results.filter(post =>
                post.kategori === selectedCategory
            );
        }

        // Filter berdasarkan bulan
        if (selectedMonth !== 'Semua') {
            const monthIndex = months.indexOf(selectedMonth);
            results = results.filter(post => {
                const postDate = new Date(post.created_at);
                return postDate.getMonth() === monthIndex;
            });
        }

        setFilteredPosts(results);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Typography variant="h1" className="text-3xl font-bold text-gray-900 mb-2">
                        Semua Postingan
                    </Typography>
                    <Typography variant="lead" className="text-gray-600">
                        Informasi terbaru seputar SDN Gadungan 02
                    </Typography>
                </div>

                {/* Filter dan Pencarian */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            label="Cari postingan..."
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Cari berdasarkan judul atau deskripsi..."
                        />
                    </div>
                    <div>
                        <Select
                            label="Kategori"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            {categories.map((cat, index) => (
                                <Option key={index} value={cat}>
                                    {cat}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            label="Bulan"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {months.map((month, index) => (
                                <Option key={index} value={month}>
                                    {month}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            <Typography variant="h6">Memuat data...</Typography>
                        </div>
                    </div>
                )}

                {/* Daftar Postingan */}
                {!loading && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={post.thumbnail_postingan || "/default-thumbnail.jpg"}
                                            alt={post.title_postingan}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = "/default-thumbnail.jpg";
                                            }}
                                        />
                                    </div>
                                    <CardBody className="flex flex-col flex-grow">
                                        <div className="mb-3">
                                            <Chip
                                                value={post.kategori}
                                                color={
                                                    post.kategori === "Prestasi" ? "green" :
                                                        post.kategori === "Pengumuman" ? "blue" :
                                                            post.kategori === "Kegiatan" ? "amber" : "gray"
                                                }
                                                className="rounded-full text-xs"
                                            />
                                        </div>
                                        <Typography variant="h5" className="mb-2 text-lg font-bold line-clamp-2">
                                            {post.title_postingan}
                                        </Typography>
                                        <Typography variant="paragraph" className="mb-4 text-gray-600 text-sm line-clamp-3">
                                            {post.deskripsi_postingan}
                                        </Typography>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                                                <Typography variant="small" className="text-gray-600">
                                                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </Typography>
                                            </div>
                                            <Link
                                                to={`/postingan/${post.id}`}
                                                className="p-0 text-blue-600 text-sm hover:underline"
                                            >
                                                Baca Selengkapnya
                                            </Link>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredPosts.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="flex flex-col items-center justify-center">
                                    <FunnelIcon className="h-12 w-12 text-gray-400 mb-4" />
                                    <Typography variant="h5" className="text-gray-500 mb-2">
                                        Tidak ada postingan yang sesuai dengan filter
                                    </Typography>
                                    <Typography variant="small" className="text-gray-400">
                                        Coba ubah kriteria pencarian Anda
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedPage;