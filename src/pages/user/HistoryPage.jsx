import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";

const HistoryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-lg overflow-hidden">
                    <CardBody className="p-8">
                        <Typography
                            variant="h2"
                            color="blue-gray"
                            className="mb-8 text-3xl font-bold text-center"
                        >
                            Sejarah SDN Gadungan 02
                        </Typography>

                        <div className="prose max-w-none">
                            <Typography
                                variant="paragraph"
                                className="mb-6 text-gray-700 text-lg leading-relaxed"
                            >
                                SDN Gadungan 02 berdiri pada tahun 2014 dengan tujuan memberikan layanan pendidikan yang berkualitas bagi masyarakat sekitar. Sekolah ini didirikan sebagai bentuk komitmen untuk mencerdaskan generasi muda yang beriman, bertakwa, dan berakhlak mulia.
                            </Typography>

                            <Typography
                                variant="paragraph"
                                className="mb-6 text-gray-700 text-lg leading-relaxed"
                            >
                                Dalam perjalanannya, SDN Gadungan 02 terus berkembang dari segi fasilitas maupun kualitas pendidikan. Berbagai prestasi telah diraih baik dalam bidang akademik maupun non-akademik, menjadikan sekolah ini sebagai institusi pendidikan yang diperhitungkan di wilayahnya.
                            </Typography>

                            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 my-8">
                                <Typography
                                    variant="h4"
                                    className="text-xl font-semibold text-blue-800 mb-3"
                                >
                                    Visi Sekolah
                                </Typography>
                                <Typography className="text-blue-700">
                                    "Mewujudkan generasi yang cerdas, berkarakter, dan berdaya saing global dengan berlandaskan iman dan takwa"
                                </Typography>
                            </div>

                            <Typography
                                variant="paragraph"
                                className="mb-6 text-gray-700 text-lg leading-relaxed"
                            >
                                Dengan dukungan guru-guru yang profesional dan fasilitas yang terus ditingkatkan, SDN Gadungan 02 berkomitmen untuk terus memberikan yang terbaik bagi peserta didik dan masyarakat.
                            </Typography>
                        </div>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                                <CardBody>
                                    <Typography variant="h5" className="text-blue-800 mb-3">
                                        Tahun Berdiri
                                    </Typography>
                                    <Typography variant="h3" className="text-blue-600">
                                        2014
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Card className="bg-gradient-to-r from-amber-50 to-amber-100">
                                <CardBody>
                                    <Typography variant="h5" className="text-amber-800 mb-3">
                                        Jumlah Siswa
                                    </Typography>
                                    <Typography variant="h3" className="text-amber-600">
                                        250+
                                    </Typography>
                                </CardBody>
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default HistoryPage;