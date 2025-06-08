import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card, CardBody, Button, Chip } from "@material-tailwind/react";
import { CalendarDaysIcon, UserCircleIcon, ArrowLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import PostService from '../../services/postService';

const DetailFeedPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await PostService.getPostById(id);
                if (!response.data) {
                    navigate('/404');
                    return;
                }
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
                navigate('/404');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Typography variant="h4">Postingan tidak ditemukan</Typography>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Tombol Kembali */}
                <Button
                    variant="text"
                    className="flex items-center gap-2 mb-6 px-0"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Kembali ke Beranda
                </Button>

                {/* Card Utama */}
                <Card className="shadow-lg overflow-hidden">
                    {/* Thumbnail */}
                    {post.thumbnail_postingan && (
                        <div className="h-64 w-full relative overflow-hidden">
                            <img
                                src={post.thumbnail_postingan}
                                alt={post.title_postingan}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
                                <Chip
                                    value={post.kategori}
                                    color={
                                        post.kategori === "Prestasi" ? "green" :
                                            post.kategori === "Pengumuman" ? "blue" :
                                                post.kategori === "Kegiatan" ? "amber" : "gray"
                                    }
                                    className="rounded-full font-medium"
                                />
                                <Typography variant="h1" className="mt-2 text-white text-2xl sm:text-3xl font-bold">
                                    {post.title_postingan}
                                </Typography>
                            </div>
                        </div>
                    )}

                    <CardBody className="p-6 sm:p-8">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                                <Typography variant="small" className="text-gray-600">
                                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                                <Typography variant="small" className="text-gray-600">
                                    {post.author_name || 'Admin'}
                                </Typography>
                            </div>
                        </div>

                        {/* Konten */}
                        <div className="prose max-w-none">
                            {post.text_postingan.split('\n').map((paragraph, index) => (
                                <Typography
                                    key={index}
                                    variant="paragraph"
                                    className="mb-4 text-gray-700 leading-relaxed"
                                >
                                    {paragraph}
                                </Typography>
                            ))}
                        </div>

                        {/* Tags */}
                        {post.keyword && (
                            <div className="mt-8 flex flex-wrap gap-2">
                                {post.keyword.split(',').map((tag, index) => (
                                    <Chip
                                        key={index}
                                        value={tag.trim()}
                                        variant="outlined"
                                        className="rounded-full border-gray-300 text-gray-700"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
                            <Button variant="outlined" className="flex items-center gap-2">
                                <ShareIcon className="h-5 w-5" />
                                Bagikan
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default DetailFeedPage;