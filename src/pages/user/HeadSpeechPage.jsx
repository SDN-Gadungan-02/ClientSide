import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody, Avatar, Button, Spinner } from "@material-tailwind/react";
import { AcademicCapIcon, UserGroupIcon, TrophyIcon, BookOpenIcon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import TeacherService from "../../services/teacherService";
import HeadSpeechService from "../../services/headspeechService";
import VisiMisiService from "../../services/visiMisiService";
import PostService from "../../services/postService";
import { toast } from "react-toastify";
import back from "../../assets/jumbo2.jpg";

const HeadSpeechPage = () => {
    const [teachersData, setTeachersData] = useState([]);
    const [speech, setSpeech] = useState("");
    const [visiMisi, setVisiMisi] = useState({ visi: "", misi: [], tujuan: [] });
    const [prestasiPosts, setPrestasiPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHeadSpeech = async () => {
        try {
            const response = await HeadSpeechService.getHeadSpeech();
            setSpeech(response.data.text_speech || "");

            console.log('Head speech fetched:', response.data);
        } catch (error) {
            console.error("Error fetching head speech:", error);
            toast.error("Gagal memuat sambutan kepala sekolah");
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await TeacherService.getTeachers();
            console.log('Full API response:', response);

            // Handle the API response structure
            const teachersArray = response.success ? response.data : [];
            setTeachersData(Array.isArray(teachersArray) ? teachersArray : []);

            console.log('Processed teachers data:', teachersArray);


        } catch (err) {
            console.error('Error fetching teachers:', err);
            setError('Gagal memuat data guru');
            toast.error('Gagal memuat data guru');
        } finally {
            setLoading(false);
        }
    };

    const fetchVisiMisi = async () => {
        try {
            const response = await VisiMisiService.getVisiMisi();
            setVisiMisi(response.data);
            console.log('Visi Misi fetched:', response.data);
        } catch (error) {
            console.error("Error fetching visi misi:", error);
        }
    };

    const fetchPrestasiPosts = async () => {
        try {
            const response = await PostService.getPosts();
            // Filter hanya postingan dengan kategori "Prestasi" dan urutkan dari yang terbaru
            const filteredPosts = response.data
                .filter(post => post.kategori_postingan === "Prestasi")
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 4); // Ambil 3 terbaru saja

            setPrestasiPosts(filteredPosts);
        } catch (error) {
            console.error("Error fetching prestasi posts:", error);
            toast.error("Gagal memuat data prestasi");
        } finally {
            setLoadingPrestasi(false);
        }
    };

    useEffect(() => {
        fetchHeadSpeech();
        fetchTeachers();
        fetchVisiMisi();
        fetchPrestasiPosts();
    }, []);

    // Filter to find the principal (more flexible search)
    const principal = teachersData.find(teacher =>
        teacher?.keterangan_guru?.toLowerCase().match(/kepala|head|principal/)
    );

    // Filter other teachers (excluding principal)
    const otherTeachers = teachersData.filter(teacher =>
        !teacher?.keterangan_guru?.toLowerCase().match(/kepala|head|principal/)
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Typography variant="h4" color="red">
                    {error}
                </Typography>
            </div>
        );
    }

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
                                    src={back}
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
                                {principal ? (
                                    <>
                                        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                                            <div className="relative">
                                                <Avatar
                                                    src={principal.pas_foto || "/images/default-avatar.jpg"}
                                                    alt={principal.nama_guru || "Kepala Sekolah"}
                                                    size="xxl"
                                                    className="border-4 border-white shadow-lg"
                                                />
                                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full shadow-sm">
                                                    <Typography variant="small" className="font-bold flex items-center gap-1">
                                                        <BuildingOfficeIcon className="h-10 w-10" />
                                                        Kepala Sekolah
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <Typography variant="h3" className="text-2xl font-bold text-gray-900 mb-1">
                                                    {principal.nama_guru || "Nama Kepala Sekolah"}
                                                </Typography>
                                                <Typography variant="paragraph" className="text-gray-600 mb-1">
                                                    {principal.keterangan_guru || "Kepala Sekolah"}
                                                </Typography>
                                                <Typography variant="paragraph" className="text-gray-600 mb-4">
                                                    {principal.nip || "-"}
                                                </Typography>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {speech ? (
                                                <>
                                                    <Typography
                                                        variant="paragraph"
                                                        className="text-gray-700 text-lg leading-relaxed whitespace-pre-line"
                                                    >
                                                        {speech.split('\n\n')[0]}
                                                    </Typography>

                                                    {/* Improved Tujuan Section */}
                                                    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                                        <div className="flex items-start gap-4">
                                                            <div className="bg-blue-100 p-3 rounded-full">
                                                                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <Typography variant="h5" className="text-blue-800 font-bold mb-3 flex items-center gap-2">
                                                                    Tujuan Pendidikan Kami
                                                                </Typography>
                                                                <ul className="space-y-3">
                                                                    {visiMisi.text_tujuan && visiMisi.text_tujuan.length > 0 ? (
                                                                        visiMisi.text_tujuan.map((item, index) => (
                                                                            <li
                                                                                key={index}
                                                                                className="flex items-start gap-3 group"
                                                                            >
                                                                                <span className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 group-hover:bg-blue-800 transition-colors"></span>
                                                                                <Typography variant="paragraph" className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                                                                    {item}
                                                                                </Typography>
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <Typography variant="small" className="italic text-gray-500">
                                                                            Tujuan sekolah belum tersedia
                                                                        </Typography>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Typography
                                                        variant="paragraph"
                                                        className="text-gray-700 text-lg leading-relaxed whitespace-pre-line"
                                                    >
                                                        {speech.split('\n\n').slice(1).join('\n\n')}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography variant="paragraph" className="text-gray-700 text-lg leading-relaxed">
                                                    Sambutan kepala sekolah belum tersedia.
                                                </Typography>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Typography variant="paragraph" className="text-center py-8">
                                        Data kepala sekolah tidak ditemukan
                                    </Typography>
                                )}
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
                                    {otherTeachers.length > 0 ? (
                                        otherTeachers.map((teacher, index) => (
                                            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Avatar
                                                    src={teacher.pas_foto || "/images/default-avatar.jpg"}
                                                    alt={teacher.nama_guru || "Guru"}
                                                    size="md"
                                                    className="border-2 border-white shadow"
                                                />
                                                <div>
                                                    <Typography variant="h6" className="font-bold text-gray-800">
                                                        {teacher.nama_guru || "Nama Guru"}
                                                    </Typography>
                                                    <Typography variant="small" className="text-gray-600">
                                                        {teacher.keterangan_guru || "Guru"}
                                                    </Typography>

                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <Typography variant="small" className="text-gray-500 text-center py-4">
                                            Tidak ada data guru
                                        </Typography>
                                    )}
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
                                            {visiMisi.text_visi || "Visi sekolah belum tersedia"}
                                        </Typography>

                                    </div>

                                    <div>
                                        <Typography variant="h5" className="font-bold mb-2 flex items-center gap-2">
                                            <BookOpenIcon className="h-5 w-5" />
                                            Misi
                                        </Typography>
                                        <ul className="space-y-2">
                                            {visiMisi.text_misi && visiMisi.text_misi.length > 0 ? (
                                                visiMisi.text_misi.map((item, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="mt-1.5 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <Typography variant="small" className="italic">
                                                    Misi sekolah belum tersedia
                                                </Typography>
                                            )}
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

                                {loading ? (
                                    <div className="flex justify-center py-4">
                                        <Spinner className="h-6 w-6" />
                                    </div>
                                ) : prestasiPosts.length > 0 ? (
                                    <div className="space-y-3">
                                        {prestasiPosts.map((post, index) => (
                                            <div key={index} className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                                                <Typography variant="small" className="font-bold text-amber-800 flex items-center gap-2">
                                                    <TrophyIcon className="h-4 w-4" />
                                                    {post.title_postingan}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600">
                                                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Typography variant="small" className="text-gray-500 text-center py-4">
                                        Tidak ada data prestasi
                                    </Typography>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadSpeechPage;