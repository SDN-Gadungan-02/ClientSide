import React from "react";
import { Typography, Card, CardBody, Avatar, Button } from "@material-tailwind/react";
import { AcademicCapIcon, UserGroupIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/solid";

const HeadSpeechPage = () => {
    // Data guru contoh
    const teachers = [
        { name: "Dr. Siti Aminah, M.Pd", nik: "196512341982032001", position: "Kepala Sekolah", photo: "/teachers/principal.jpg" },
        { name: "Budi Santoso, S.Pd", nik: "197803121995021002", position: "Wakil Kepala Sekolah", photo: "/teachers/vice-principal.jpg" },
        { name: "Dewi Lestari, S.Pd", nik: "198204152000122003", position: "Guru Kelas 1", photo: "/teachers/teacher1.jpg" },
        { name: "Rudi Hermawan, S.Pd", nik: "198511102005011004", position: "Guru Kelas 2", photo: "/teachers/teacher2.jpg" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
                        <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-2">
                        Sambutan Kepala Sekolah
                    </Typography>
                    <Typography variant="lead" className="text-blue-600">
                        SD Negeri Gadungan 02
                    </Typography>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content - Sambutan */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg overflow-hidden">
                            <div className="relative h-64 bg-gray-800">
                                <img
                                    src="/images/school-building.jpg"
                                    alt="Gedung SDN Gadungan 02"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <Typography variant="h3" className="text-white text-2xl font-bold">
                                        Kata Sambutan
                                    </Typography>
                                </div>
                            </div>

                            <CardBody className="p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                                    <div className="relative">
                                        <Avatar
                                            src="/images/principal.jpg"
                                            alt="Kepala Sekolah"
                                            size="xxl"
                                            className="border-4 border-white shadow-lg"
                                        />
                                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full shadow-sm">
                                            <Typography variant="small" className="font-bold flex items-center gap-1">
                                                <UserGroupIcon className="h-4 w-4" />
                                                Kepala Sekolah
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <Typography variant="h3" className="text-2xl font-bold text-gray-900 mb-1">
                                            Dr. Siti Aminah, M.Pd
                                        </Typography>
                                        <Typography variant="paragraph" className="text-gray-600 mb-4">
                                            Kepala Sekolah SDN Gadungan 02
                                        </Typography>
                                        <Button variant="filled" color="blue" className="flex items-center gap-2">
                                            <BookOpenIcon className="h-5 w-5" />
                                            Profil Lengkap
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Typography variant="paragraph" className="text-gray-700 text-lg leading-relaxed">
                                        <span className="text-4xl font-bold text-blue-600 float-left mr-2 mt-1">S</span>
                                        elamat datang di SDN Gadungan 02, sekolah yang berkomitmen untuk mencetak generasi yang cerdas, berkarakter, dan mampu menghadapi tantangan global. Kami percaya bahwa pendidikan yang berkualitas adalah kunci untuk membangun masa depan yang cerah.
                                    </Typography>

                                    <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600 flex items-start gap-4">
                                        <AcademicCapIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                                        <Typography variant="paragraph" className="text-blue-800 italic font-medium">
                                            "Dengan memanfaatkan teknologi sebagai alat bantu dalam proses pembelajaran, kami berusaha memberikan pengalaman belajar yang lebih interaktif dan menyenangkan bagi siswa."
                                        </Typography>
                                    </div>

                                    <Typography variant="paragraph" className="text-gray-700 text-lg leading-relaxed">
                                        Kami juga berkomitmen untuk menyediakan informasi yang transparan dan mudah diakses oleh seluruh warga sekolah dan masyarakat. Semoga dengan kerjasama yang baik di antara kita, kita bisa bersama-sama mendukung perkembangan pendidikan yang lebih baik dan meraih prestasi yang lebih gemilang.
                                    </Typography>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Sidebar - Guru dan Info */}
                    <div className="space-y-8">
                        {/* Daftar Guru */}
                        <Card className="shadow-lg">
                            <CardBody className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <UserGroupIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <Typography variant="h3" className="text-xl font-bold text-gray-900">
                                        Staf Pengajar
                                    </Typography>
                                </div>

                                <div className="space-y-4">
                                    {teachers.map((teacher, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <Avatar
                                                src={teacher.photo}
                                                alt={teacher.name}
                                                size="md"
                                                className="border-2 border-white shadow"
                                            />
                                            <div>
                                                <Typography variant="h6" className="font-bold text-gray-800">
                                                    {teacher.name}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600">
                                                    {teacher.position}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Visi Misi */}
                        <Card className="shadow-lg bg-blue-600 text-white">
                            <CardBody className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <AcademicCapIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <Typography variant="h3" className="text-xl font-bold">
                                        Visi Misi Sekolah
                                    </Typography>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Typography variant="h5" className="font-bold mb-2 flex items-center gap-2">
                                            <BookOpenIcon className="h-5 w-5" />
                                            Visi
                                        </Typography>
                                        <Typography variant="paragraph" className="italic">
                                            "Mencerdaskan kehidupan bangsa dengan pendidikan berkualitas"
                                        </Typography>
                                    </div>

                                    <div>
                                        <Typography variant="h5" className="font-bold mb-2 flex items-center gap-2">
                                            <BookOpenIcon className="h-5 w-5" />
                                            Misi
                                        </Typography>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1.5 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                                                <span>Membangun karakter siswa yang berakhlak mulia</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1.5 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                                                <span>Mengembangkan potensi akademik dan non-akademik</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1.5 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                                                <span>Menghasilkan lulusan yang kompetitif</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Prestasi */}
                        <Card className="shadow-lg">
                            <CardBody className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <TrophyIcon className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <Typography variant="h3" className="text-xl font-bold text-gray-900">
                                        Prestasi Terbaru
                                    </Typography>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <Typography variant="small" className="font-bold text-amber-800 flex items-center gap-2">
                                            <TrophyIcon className="h-4 w-4" />
                                            Juara 1 Lomba Sains
                                        </Typography>
                                        <Typography variant="small" className="text-gray-600">
                                            12 Mei 2023
                                        </Typography>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <Typography variant="small" className="font-bold text-amber-800 flex items-center gap-2">
                                            <TrophyIcon className="h-4 w-4" />
                                            Sekolah Adiwiyata
                                        </Typography>
                                        <Typography variant="small" className="text-gray-600">
                                            28 Agustus 2023
                                        </Typography>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadSpeechPage;