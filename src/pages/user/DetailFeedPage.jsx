import React from "react";
import { Typography, Card, CardBody, Button, Chip } from "@material-tailwind/react";
import { CalendarDaysIcon, UserCircleIcon, ArrowLeftIcon, ShareIcon, BookmarkIcon } from "@heroicons/react/24/outline";

const DetailFeedPage = () => {
    const postData = {
        title: "Prestasi Siswa SDN Gadungan 02 di Kompetisi Sains Nasional",
        thumbnail: "https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?cs=srgb&dl=clouds-country-daylight-371633.jpg&fm=jpg",
        content: `
            Selamat datang di SDN Gadungan 02, sekolah yang berkomitmen untuk mencetak generasi yang cerdas, berkarakter, dan siap menghadapi tantangan global. Kami percaya bahwa pendidikan yang berkualitas adalah kunci untuk membangun masa depan yang cerah.
            
            Dengan menggunakan teknologi sebagai alat bantu dalam proses pembelajaran, kami berusaha menciptakan pengalaman belajar yang lebih interaktif dan menyenangkan bagi siswa. Kami juga berkomitmen untuk menyediakan informasi yang transparan dan mudah diakses oleh seluruh warga sekolah dan masyarakat.
            
            Semoga dengan kehadiran Anda di sini, kita bisa bersama-sama mendukung perkembangan pendidikan yang lebih baik dan mendorong prestasi yang lebih gemilang. Terima kasih.
        `,
        date: "15 Agustus 2023",
        author: "Admin SDN Gadungan 02",
        category: "Prestasi Akademik",
        tags: ["Sains", "Kompetisi", "Prestasi", "2023"]
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Tombol Kembali */}
                <Button variant="text" className="flex items-center gap-2 mb-6 px-0">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Kembali ke Beranda
                </Button>

                {/* Card Utama */}
                <Card className="shadow-lg overflow-hidden">
                    {/* Thumbnail */}
                    <div className="h-64 w-full relative overflow-hidden">
                        <img
                            src={postData.thumbnail}
                            alt={postData.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
                            <Chip
                                value={postData.category}
                                color="amber"
                                className="rounded-full font-medium"
                            />
                            <Typography variant="h1" className="mt-2 text-white text-2xl sm:text-3xl font-bold">
                                {postData.title}
                            </Typography>
                        </div>
                    </div>

                    <CardBody className="p-6 sm:p-8">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                                <Typography variant="small" className="text-gray-600">
                                    {postData.date}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                                <Typography variant="small" className="text-gray-600">
                                    {postData.author}
                                </Typography>
                            </div>
                        </div>

                        {/* Konten */}
                        <div className="prose max-w-none">
                            {postData.content.split('\n').map((paragraph, index) => (
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
                        <div className="mt-8 flex flex-wrap gap-2">
                            {postData.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    value={tag}
                                    variant="outlined"
                                    className="rounded-full border-gray-300 text-gray-700"
                                />
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
                            <Button variant="outlined" className="flex items-center gap-2">
                                <ShareIcon className="h-5 w-5" />
                                Bagikan
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Related Posts */}
                <div className="mt-12">
                    <Typography variant="h3" className="text-xl font-bold mb-6">
                        Postingan Terkait
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((item) => (
                            <Card key={item} className="shadow-md hover:shadow-lg transition-shadow">
                                <CardBody className="p-4">
                                    <Typography variant="h5" className="text-lg font-semibold mb-2">
                                        Contoh Postingan Terkait {item}
                                    </Typography>
                                    <Typography variant="small" className="text-gray-600 mb-3">
                                        Deskripsi singkat tentang postingan terkait yang mungkin menarik...
                                    </Typography>
                                    <Button variant="text" size="sm" className="p-0">
                                        Baca Selengkapnya
                                    </Button>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailFeedPage;