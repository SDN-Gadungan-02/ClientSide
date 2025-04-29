import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";

const VisiMisiPage = () => {
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
                            <Typography variant="h3" className="text-2xl font-bold mb-4 text-blue-700">
                                Visi
                            </Typography>
                            <Typography className="text-gray-700 text-lg">
                                Membangun pendidikan yang terintegrasi teknologi digital, mengembangkan karakter bangsa,
                                berbudaya lingkungan, dan berwawasan global.
                            </Typography>
                        </div>

                        {/* Misi Section */}
                        <div className="mb-10">
                            <Typography variant="h3" className="text-2xl font-bold mb-4 text-blue-700">
                                Misi
                            </Typography>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li className="text-gray-700">
                                    Menerapkan teknologi terkini dalam proses pembelajaran untuk meningkatkan kualitas pendidikan.
                                </li>
                                <li className="text-gray-700">
                                    Menciptakan lingkungan sekolah yang mendukung pengembangan karakter, kreativitas, dan kepemimpinan.
                                </li>
                                <li className="text-gray-700">
                                    Menjunjung tinggi nilai-nilai kebangsaan dalam setiap aspek pendidikan untuk membangun generasi yang berkarakter.
                                </li>
                                <li className="text-gray-700">
                                    Meningkatkan kompetensi guru dan tenaga kependidikan melalui pelatihan teknologi digital secara berkelanjutan.
                                </li>
                                <li className="text-gray-700">
                                    Membangun sistem manajemen yang inklusif dan akses informasi yang transparan melalui platform digital.
                                </li>
                            </ol>
                        </div>

                        {/* Tujuan Section */}
                        <div>
                            <Typography variant="h3" className="text-2xl font-bold mb-4 text-blue-700">
                                Tujuan
                            </Typography>
                            <ol className="list-decimal pl-6 space-y-3">
                                <li className="text-gray-700">
                                    Membekali siswa dengan menguasai teknologi sebagai bekal menghadapi tantangan di era digital.
                                </li>
                                <li className="text-gray-700">
                                    Meningkatkan efektivitas pembelajaran berbasis parameter teknologi informasi, seperti e-learning dan virtual test.
                                </li>
                                <li className="text-gray-700">
                                    Menyediakan pendidikan yang transparan dan mudah diakses oleh siswa, guru, orang tua, dan masyarakat umum.
                                </li>
                                <li className="text-gray-700">
                                    Menyelenggarakan program-program pendidikan yang selaras dengan perkembangan zaman dan kebutuhan industri.
                                </li>
                                <li className="text-gray-700">
                                    Menumbuhkan sikap kebersamaan dan toleransi melalui kegiatan yang mendukung persatuan dalam kebinekaan.
                                </li>
                            </ol>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VisiMisiPage;