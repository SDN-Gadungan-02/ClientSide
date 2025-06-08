import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import VisiMisiService from '../../services/visiMisiService';
import HistoryService from '../../services/HistoryService';

const HistoryPage = () => {
    const [history, setHistory] = useState({
        contentPart1: "",
        contentPart2: "",
        establishedYear: "2014",
        studentCount: "250+"
    });
    const [vision, setVision] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch history data
                const historyResponse = await HistoryService.getHistory();
                const historyData = historyResponse?.data || historyResponse;

                // Fetch vision data
                const visiMisiResponse = await VisiMisiService.getVisiMisi();
                const visiMisiData = visiMisiResponse?.data || visiMisiResponse;

                // Split the history content into two parts
                const fullHistory = historyData.text_history || "SDN Gadungan 02 berdiri pada tahun 2014 dengan tujuan memberikan layanan pendidikan yang berkualitas bagi masyarakat sekitar. Sekolah ini didirikan sebagai bentuk komitmen untuk mencerdaskan generasi muda yang beriman, bertakwa, dan berakhlak mulia. Dengan dukungan guru-guru yang profesional dan fasilitas yang terus ditingkatkan, SDN Gadungan 02 berkomitmen untuk terus memberikan yang terbaik bagi peserta didik dan masyarakat.";

                // Split at approximately the middle (you can adjust this)
                const splitIndex = Math.floor(fullHistory.length / 2);
                const splitPoint = fullHistory.indexOf('.', splitIndex) + 1;

                setHistory({
                    contentPart1: splitPoint > 0 ? fullHistory.substring(0, splitPoint) : fullHistory,
                    contentPart2: splitPoint > 0 ? fullHistory.substring(splitPoint) : "",
                    establishedYear: historyData.established_year || "2014",
                    studentCount: historyData.student_count || "250+"
                });

                setVision(visiMisiData.text_visi || "Mewujudkan generasi yang cerdas, berkarakter, dan berdaya saing global dengan berlandaskan iman dan takwa");

            } catch (error) {
                console.error("Error fetching data:", error);
                setHistory({
                    contentPart1: "SDN Gadungan 02 berdiri pada tahun 2014 dengan tujuan memberikan layanan pendidikan yang berkualitas bagi masyarakat sekitar. Sekolah ini didirikan sebagai bentuk komitmen untuk mencerdaskan generasi muda yang beriman, bertakwa, dan berakhlak mulia.",
                    contentPart2: "Dengan dukungan guru-guru yang profesional dan fasilitas yang terus ditingkatkan, SDN Gadungan 02 berkomitmen untuk terus memberikan yang terbaik bagi peserta didik dan masyarakat.",
                    establishedYear: "2014",
                    studentCount: "250+"
                });
                setVision("Mewujudkan generasi yang cerdas, berkarakter, dan berdaya saing global");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <Typography variant="h5">Memuat data...</Typography>
            </div>
        );
    }

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
                                className="mb-6 text-gray-700 text-lg leading-relaxed whitespace-pre-line"
                            >
                                {history.contentPart1}
                            </Typography>

                            {/* Vision box centered in the middle of history text */}
                            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 my-8">
                                <Typography
                                    variant="h4"
                                    className="text-xl font-semibold text-blue-800 mb-3"
                                >
                                    Visi Sekolah
                                </Typography>
                                <Typography className="text-blue-700 italic">
                                    "{vision}"
                                </Typography>
                            </div>

                            {history.contentPart2 && (
                                <Typography
                                    variant="paragraph"
                                    className="mb-6 text-gray-700 text-lg leading-relaxed whitespace-pre-line"
                                >
                                    {history.contentPart2}
                                </Typography>
                            )}

                        </div>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                                <CardBody>
                                    <Typography variant="h5" className="text-blue-800 mb-3">
                                        Tahun Berdiri
                                    </Typography>
                                    <Typography variant="h3" className="text-blue-600">
                                        {history.establishedYear}
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Card className="bg-gradient-to-r from-amber-50 to-amber-100">
                                <CardBody>
                                    <Typography variant="h5" className="text-amber-800 mb-3">
                                        Jumlah Siswa
                                    </Typography>
                                    <Typography variant="h3" className="text-amber-600">
                                        {history.studentCount}
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