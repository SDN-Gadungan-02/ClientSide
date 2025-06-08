import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody, Chip, Button } from "@material-tailwind/react";
import { NewspaperIcon, CalendarIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

import JumbotronUser from "../../components/user/JumbotronUser";
import ContactUser from "../../components/user/ContactUser";
import VisiMisiService from "../../services/visiMisiService";
import PostService from "../../services/postService";

export default function HomePage() {
    const [visiMisi, setVisiMisi] = useState({
        text_visi: "Memuat...",
        text_misi: ["Memuat..."],
        text_tujuan: ["Memuat..."]
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState({
        visiMisi: true,
        posts: true
    });
    const [error, setError] = useState({
        visiMisi: null,
        posts: null
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Visi Misi
                const response = await VisiMisiService.getVisiMisi();
                const data = response?.data || response;

                const processTextArray = (text) => {
                    if (!text) return [];
                    if (Array.isArray(text)) return text.filter(item => item.trim());
                    return text.split('|')
                        .map(item => item.trim())
                        .filter(item => item && !item.toLowerCase().includes("belum tersedia"));
                };

                setVisiMisi({
                    text_visi: data.text_visi || "Visi sekolah belum tersedia",
                    text_misi: processTextArray(data.text_misi).length > 0
                        ? processTextArray(data.text_misi)
                        : ["Misi sekolah belum tersedia"],
                    text_tujuan: processTextArray(data.text_tujuan).length > 0
                        ? processTextArray(data.text_tujuan)
                        : ["Tujuan sekolah belum tersedia"]
                });

                setLoading(prev => ({ ...prev, visiMisi: false }));
            } catch (err) {
                console.error("Error loading visi misi:", err);
                setError(prev => ({
                    ...prev,
                    visiMisi: err.response?.data?.message || err.message
                }));
                setLoading(prev => ({ ...prev, visiMisi: false }));
                setVisiMisi({
                    text_visi: "Visi sekolah belum tersedia",
                    text_misi: ["Misi sekolah belum tersedia"],
                    text_tujuan: ["Tujuan sekolah belum tersedia"]
                });
            }

            try {
                // Load Posts
                const response = await PostService.getPosts();
                console.log('Full Posts Response:', response); // Debugging

                // Pastikan kita mengakses data dengan benar
                const postsData = response.data?.data || response?.data || response;
                console.log('Extracted Posts Data:', postsData); // Debugging

                // Pastikan postsData adalah array
                const postsArray = Array.isArray(postsData) ? postsData : [];
                console.log('Posts Array:', postsArray); // Debugging

                // Format data dengan pengecekan null/undefined
                const formattedPosts = postsArray.map(post => ({
                    id: post.id || Math.random().toString(36).substr(2, 9),
                    title: post.title_postingan || 'Judul tidak tersedia',
                    excerpt: post.deskripsi_postingan || 'Deskripsi tidak tersedia',
                    category: post.kategori || 'Umum',
                    created_at: post.created_at || new Date().toISOString(),
                    thumbnail: post.thumbnail_postingan || 'https://source.unsplash.com/random/600x400?sig=1&school'
                }));

                console.log('Formatted Posts:', formattedPosts); // Debugging

                setPosts(formattedPosts.slice(0, 4));
                setLoading(prev => ({ ...prev, posts: false }));
            } catch (err) {
                console.error("Error loading posts:", err);
                setError(prev => ({ ...prev, posts: err.message }));
                setLoading(prev => ({ ...prev, posts: false }));

                // Fallback data
                setPosts([
                    {
                        id: 1,
                        title: "Contoh Postingan 1",
                        excerpt: "Ini contoh postingan ketika API bermasalah",
                        category: "Informasi",
                        created_at: new Date().toISOString(),
                        thumbnail: "https://source.unsplash.com/random/600x400?sig=1&school"
                    },
                    {
                        id: 2,
                        title: "Contoh Postingan 2",
                        excerpt: "Ini contoh postingan kedua",
                        category: "Pengumuman",
                        created_at: new Date().toISOString(),
                        thumbnail: "https://source.unsplash.com/random/600x400?sig=2&classroom"
                    }
                ]);
            }
        };

        loadData();
    }, []);

    const renderVisiMisiCard = (title, content) => {
        return (
            <div className="relative group h-full">
                <Card className="hover:shadow-lg transition-all duration-300 w-full h-full border-t-4 border-mediumGreenColor overflow-hidden">
                    <CardBody className="h-full flex flex-col p-6">
                        <Typography variant="h5" className="text-darkGreenColor font-bold mb-4 flex items-center">
                            <div className="w-3 h-3 bg-darkGreenColor rounded-full mr-3"></div>
                            {title}
                        </Typography>

                        {Array.isArray(content) ? (
                            <ul className="space-y-3 pl-2">
                                {content.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start hover:bg-blue-50/50 transition-colors p-2 rounded-lg -ml-2"
                                    >
                                        <div className="flex-shrink-0 mt-1.5 mr-3">
                                            <svg className="w-3 h-3 text-darkGreenColor" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                        </div>
                                        <Typography variant="paragraph" className="text-gray-700">
                                            {item}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <Typography variant="lead" className="text-gray-600">
                                    {content}
                                </Typography>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        );
    };

    const renderPostCard = (post) => {
        return (
            <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = 'https://source.unsplash.com/random/600x400?sig=1&school';
                        }}
                    />
                </div>
                <CardBody className="flex flex-col flex-grow">
                    <div className="mb-3">
                        <Chip
                            value={post.category}
                            color={
                                post.category === "Prestasi" ? "green" :
                                    post.category === "Pengumuman" ? "blue" :
                                        post.category === "Kegiatan" ? "amber" : "gray"
                            }
                            className="rounded-full text-xs"
                        />
                    </div>
                    <Typography variant="h5" className="mb-2 text-lg font-bold line-clamp-2">
                        {post.title}
                    </Typography>
                    <Typography variant="paragraph" className="mb-4 text-gray-600 text-sm line-clamp-3">
                        {post.excerpt}
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
        );
    };

    return (
        <div className="relative">
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="bg-gray-50">
                    <JumbotronUser />
                </div>

                {/* Visi Misi */}
                <div className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-20 lg:px-72">
                        <Typography variant="h3" className="text-center mb-8 lg:mb-12">
                            Visi Misi & Tujuan Sekolah
                        </Typography>

                        {loading.visiMisi ? (
                            <div className="text-center">Memuat visi misi...</div>
                        ) : error.visiMisi ? (
                            <div className="text-center text-red-500">Error: {error.visiMisi}</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-6 lg:gap-3">
                                {renderVisiMisiCard("Visi", visiMisi.text_visi)}
                                {renderVisiMisiCard("Misi", visiMisi.text_misi)}
                                {renderVisiMisiCard("Tujuan", visiMisi.text_tujuan)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Postingan */}
                <div className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <Typography variant="h3" className="text-center mb-12">
                            Postingan Terbaru
                        </Typography>

                        {loading.posts ? (
                            <div className="text-center">Memuat postingan...</div>
                        ) : error.posts ? (
                            <div className="text-center text-red-500">Error: {error.posts}</div>
                        ) : posts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
                                {posts.map(renderPostCard)}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Typography variant="h5" className="text-gray-500">
                                    Tidak ada postingan tersedia
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact */}
                <ContactUser />
            </div>
        </div>
    );
}