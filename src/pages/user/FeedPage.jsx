import React from "react";
import { Typography, Card, CardBody, Chip, Input, Select, Option, Button } from "@material-tailwind/react";
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";

const FeedPage = () => {
    // Data contoh postingan
    const categories = ["Semua", "Prestasi Akademik", "Prestasi Non-Akademik", "Pengumuman"];
    const posts = [
        {
            id: 1,
            title: "Juara 1 Lomba Sains Tingkat Kabupaten",
            thumbnail: "https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?cs=srgb&dl=clouds-country-daylight-371633.jpg&fm=jpg",
            excerpt: "Siswa SDN Gadungan 02 meraih juara 1 dalam lomba sains tingkat kabupaten...",
            date: "15 Agustus 2023",
            category: "Prestasi Akademik",
            tags: ["Sains", "Kompetisi"]
        },
        {
            id: 2,
            title: "Tim Voli Putra Juara Turnamen Sekolah Dasar",
            thumbnail: "https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?cs=srgb&dl=clouds-country-daylight-371633.jpg&fm=jpg",
            excerpt: "Tim voli putra SDN Gadungan 02 berhasil meraih juara 1 dalam turnamen antarsekolah...",
            date: "10 Agustus 2023",
            category: "Prestasi Non-Akademik",
            tags: ["Olahraga", "Voli"]
        },
        {
            id: 3,
            title: "Pengumuman Pembelajaran Tatap Muka",
            thumbnail: "https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?cs=srgb&dl=clouds-country-daylight-371633.jpg&fm=jpg",
            excerpt: "Berdasarkan surat edaran dinas pendidikan, pembelajaran tatap muka akan dimulai...",
            date: "5 Agustus 2023",
            category: "Pengumuman",
            tags: ["Info", "Sekolah"]
        },
        {
            id: 4,
            title: "Olimpiade Matematika Tingkat Kecamatan",
            thumbnail: "https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?cs=srgb&dl=clouds-country-daylight-371633.jpg&fm=jpg",
            excerpt: "Dua siswa kami berhasil masuk 10 besar dalam olimpiade matematika tingkat kecamatan...",
            date: "1 Agustus 2023",
            category: "Prestasi Akademik",
            tags: ["Matematika", "Olimpiade"]
        }
    ];

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
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            label="Cari postingan..."
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        />
                    </div>
                    <div className="">
                        <Select label="Kategori" className="w-full">
                            {categories.map((cat, index) => (
                                <Option key={index} value={cat}>
                                    {cat}
                                </Option>
                            ))}
                        </Select>

                    </div>
                </div>

                {/* Daftar Postingan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardBody className="flex flex-col flex-grow">
                                <div className="mb-3">
                                    <Chip
                                        value={post.category}
                                        color={
                                            post.category === "Prestasi Akademik" ? "green" :
                                                post.category === "Prestasi Non-Akademik" ? "blue" : "amber"
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
                                            {post.date}
                                        </Typography>
                                    </div>
                                    <Button variant="text" size="sm" className="p-0 text-blue-600">
                                        Baca Selengkapnya
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2">
                        <Button variant="text" className="rounded-full w-10 h-10 p-0">
                            1
                        </Button>
                        <Button variant="text" className="rounded-full w-10 h-10 p-0">
                            2
                        </Button>
                        <Button variant="text" className="rounded-full w-10 h-10 p-0">
                            3
                        </Button>
                        <Button variant="text" className="rounded-full w-10 h-10 p-0">
                            ...
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedPage;