// src/pages/HomePage.jsx
import React from "react";
import { Typography, Card, CardBody, Carousel, CardHeader, CardFooter, Button } from "@material-tailwind/react";
import { NewspaperIcon, CalendarIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

import JumbotronUser from "../../components/user/JumbotronUser";
import ContactUser from "../../components/user/ContactUser";

export default function HomePage() {
    const news = [
        {
            category: "Visi",
            value: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
        },
        {
            category: "Misi",
            value: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites",
        },
        {
            category: "Tujuan",
            value: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure",
        },
    ];

    const features = [
        {
            icon: <AcademicCapIcon className="h-10 w-10 text-blue-600" />,
            title: "Akademik Unggul",
            description: "Kurikulum berbasis kompetensi dengan pengembangan karakter",
        },
        {
            icon: <UserGroupIcon className="h-10 w-10 text-blue-600" />,
            title: "Ekstrakurikuler",
            description: "Beragam kegiatan pengembangan minat dan bakat siswa",
        },
        {
            icon: <CalendarIcon className="h-10 w-10 text-blue-600" />,
            title: "Kalender Akademik",
            description: "Jadwal kegiatan pembelajaran selama tahun ajaran",
        },
        {
            icon: <NewspaperIcon className="h-10 w-10 text-blue-600" />,
            title: "Berita Terkini",
            description: "Informasi terbaru seputar kegiatan sekolah",
        },
    ];

    return (
        <div className="relative">

            {/* Konten Utama */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="bg-gray-50">
                    <JumbotronUser />
                </div>
                {/* Visi Misi */}
                <div className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-20 lg:px-72">
                        <Typography variant="h3" className="text-center mb-8 lg:mb-12 ">
                            Visi Misi & Tujuan Sekolah
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-6 lg:gap-3"> {/* Jarak lebih rapat di lg */}
                            {news.map((item, index) => (
                                <div key={index} className="relative group flex flex-col items-center h-full">
                                    {/* Kapsul Category - Lebar penuh dan mepet */}
                                    <div className="absolute -top-3 w-1/2 z-10 px-2"> {/* px-2 untuk sedikit spacing */}
                                        <div className="bg-white text-blackColor text-base font-semibold px-4 py-2 rounded-tr-lg rounded-tl-lg  border-gray-200 text-center mx-auto max-w-[90%]">
                                            {item.category}
                                        </div>
                                    </div>

                                    {/* Card dengan tinggi seragam */}
                                    <Card className="hover:shadow-md transition-all duration-300 w-full h-full pt-6"> {/* h-full untuk tinggi sama */}
                                        <CardBody className="h-full flex flex-col p-4">
                                            <Typography variant="medium" className="mb-2 text-center">
                                                {item.value}
                                            </Typography>
                                        </CardBody>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* overlay image */}

                {/* Postingan */}
                <div className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <Typography variant="h3" className="text-center mb-12">
                            Postingan Terbaru
                        </Typography>

                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
                            {[
                                {
                                    id: 1,
                                    title: "Penerimaan Peserta Didik Baru 2023",
                                    date: "15 Mei 2023",
                                    excerpt: "Pendaftaran PPDB  SDN GADUNGAN 2 Tahun Ajaran 2023/2024 telah dibuka.",
                                    image: "https://source.unsplash.com/random/1600x900?sig=3&library"
                                },
                                {
                                    id: 2,
                                    title: "Juara Olimpiade Matematika",
                                    date: "10 April 2023",
                                    excerpt: "Siswa kami meraih medali emas dalam Olimpiade Matematika Tingkat Nasional.",
                                    image: "https://source.unsplash.com/random/600x400?sig=2&math"
                                },
                                {
                                    id: 3,
                                    title: "Study Tour Kelas XI",
                                    date: "5 April 2023",
                                    excerpt: "Kunjungan edukatif ke Yogyakarta untuk pembelajaran sejarah dan budaya.",
                                    image: "https://source.unsplash.com/random/600x400?sig=3&travel"
                                },
                                {
                                    id: 4,
                                    title: "Study Tour Kelas XI",
                                    date: "5 April 2023",
                                    excerpt: "Kunjungan edukatif ke Yogyakarta untuk pembelajaran sejarah dan budaya.",
                                    image: "https://source.unsplash.com/random/600x400?sig=3&travel"
                                },
                            ].map((post) => (
                                <Card key={post.id} className="hover:shadow-lg transition-shadow h-full">
                                    <CardHeader color="blue-gray" className="relative h-48">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://4.bp.blogspot.com/-95BtXQn3Qxw/VtpltoZc18I/AAAAAAAAABQ/C-GxksuSTJU/s1600/gambar-wallpaper-alam-kartun-cute.jpg";
                                            }}
                                        />
                                    </CardHeader>
                                    <CardBody>
                                        <Typography variant="h5" className="mb-2">
                                            {post.title}
                                        </Typography>
                                        <Typography variant="ll" color="gray" className="mb-3">
                                            {post.date}
                                        </Typography>
                                        <Typography>
                                            {post.excerpt}
                                        </Typography>
                                    </CardBody>
                                    <CardFooter className="pt-0">
                                        <Button variant="text" className="flex items-center gap-2 bg-blackColor text-white">
                                            Baca Selengkapnya
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                                />
                                            </svg>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Contact */}
                <ContactUser />
            </div >
        </div>

    );
}