import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Tabs,
    TabsHeader,
    Tab,
    Textarea,
    Input,
    Spinner
} from "@material-tailwind/react";
import {
    LightBulbIcon,
    BookOpenIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    DocumentTextIcon,
    UsersIcon,
    AcademicCapIcon,
    ChartBarIcon,
    UserCircleIcon
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import HistoryService from '../../services/historyService';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState("vision-mission");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [historyData, setHistoryData] = useState(null);

    // Data statistik
    const stats = [
        { title: "Total Postingan", value: "24", icon: <DocumentTextIcon className="h-6 w-6" />, color: "bg-blue-500" },
        { title: "Total Guru", value: "12", icon: <AcademicCapIcon className="h-6 w-6" />, color: "bg-green-500" },
        { title: "Total Pengunjung", value: "1,234", icon: <UsersIcon className="h-6 w-6" />, color: "bg-amber-500" },
        { title: "Aktivitas Terbaru", value: "5", icon: <ChartBarIcon className="h-6 w-6" />, color: "bg-purple-500" }
    ];

    const [schoolData, setSchoolData] = useState({
        vision: "Menjadi sekolah unggulan yang menghasilkan generasi berkarakter, berprestasi, dan berdaya saing global",
        missions: [
            "Menyelenggarakan pendidikan berkualitas",
            "Mengembangkan potensi siswa secara holistik",
            "Menanamkan nilai-nilai karakter bangsa"
        ],
        goals: [
            "Mencapai rata-rata nilai UN di atas 85",
            "Memiliki 80% guru bersertifikasi",
            "Mengembangkan ekstrakurikuler unggulan"
        ]
    });

    // State untuk edit form
    const [editForm, setEditForm] = useState({
        vision: "",
        newMission: "",
        missions: [],
        newGoal: "",
        goals: [],
        history: ""
    });

    // Load data saat komponen mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                // Load history data
                const historyResponse = await HistoryService.getHistory();
                setHistoryData({
                    id: historyResponse.data.id,
                    text: historyResponse.data.text_history || "Sejarah sekolah belum tersedia",
                    author: historyResponse.data.author,
                    createdAt: historyResponse.data.created_at
                });

                // Set initial edit form
                setEditForm(prev => ({
                    ...prev,
                    history: historyResponse.data.text_history || ""
                }));

                setIsLoading(false);
            } catch (error) {
                console.error("Gagal memuat data:", error);
                toast.error("Gagal memuat data");
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Fungsi untuk memulai edit
    const startEditing = (section) => {
        setEditForm({
            vision: schoolData.vision,
            missions: [...schoolData.missions],
            goals: [...schoolData.goals],
            history: historyData?.text || ""
        });
        setIsEditing(section);
    };

    // Fungsi untuk menyimpan edit visi, misi, tujuan
    const saveVisionMission = () => {
        setSchoolData({
            ...schoolData,
            vision: editForm.vision,
            missions: editForm.missions,
            goals: editForm.goals
        });
        setIsEditing(false);
        toast.success("Visi, Misi & Tujuan berhasil diperbarui");
    };

    // Fungsi untuk menyimpan edit sejarah
    const saveHistoryEdit = async () => {
        try {
            const response = await HistoryService.updateHistory({
                text_history: editForm.history
            });

            setHistoryData({
                id: response.data.id,
                text: editForm.history,
                author: response.data.author,
                createdAt: response.data.created_at
            });

            setIsEditing(false);
            toast.success("Sejarah sekolah berhasil diperbarui");
        } catch (error) {
            console.error("Gagal memperbarui sejarah sekolah:", error);
            toast.error("Gagal memperbarui sejarah sekolah");
        }
    };

    // Fungsi untuk menambah item
    const addItem = (type) => {
        if (type === 'mission' && editForm.newMission) {
            setEditForm({
                ...editForm,
                missions: [...editForm.missions, editForm.newMission],
                newMission: ""
            });
        } else if (type === 'goal' && editForm.newGoal) {
            setEditForm({
                ...editForm,
                goals: [...editForm.goals, editForm.newGoal],
                newGoal: ""
            });
        }
    };

    // Fungsi untuk menghapus item
    const removeItem = (type, index) => {
        if (type === 'mission') {
            const updated = [...editForm.missions];
            updated.splice(index, 1);
            setEditForm({ ...editForm, missions: updated });
        } else if (type === 'goal') {
            const updated = [...editForm.goals];
            updated.splice(index, 1);
            setEditForm({ ...editForm, goals: updated });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Typography variant="h2" className="text-2xl font-bold mb-6 text-gray-800">
                Profil Sekolah
            </Typography>

            {/* Stats Cards - Bagian Count Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardBody className="flex items-center justify-between p-6">
                            <div>
                                <Typography variant="h6" className="text-gray-600 mb-2">
                                    {stat.title}
                                </Typography>
                                <Typography variant="h3" className="text-2xl font-bold">
                                    {stat.value}
                                </Typography>
                            </div>
                            <div className={`${stat.color} p-3 rounded-full text-white`}>
                                {stat.icon}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} className="mb-8">
                <TabsHeader>
                    <Tab value="vision-mission" onClick={() => setActiveTab("vision-mission")}>
                        <div className="flex items-center gap-2">
                            <LightBulbIcon className="h-5 w-5" />
                            Visi, Misi & Tujuan
                        </div>
                    </Tab>
                    <Tab value="history" onClick={() => setActiveTab("history")}>
                        <div className="flex items-center gap-2">
                            <BookOpenIcon className="h-5 w-5" />
                            Sejarah Sekolah
                        </div>
                    </Tab>
                </TabsHeader>
            </Tabs>

            {/* Visi Misi Tujuan Section */}
            {activeTab === "vision-mission" && (
                <Card className="mb-6">
                    <CardBody>
                        {isEditing !== "vision-mission" ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h4" className="font-bold">
                                        Visi, Misi & Tujuan
                                    </Typography>
                                    <Button
                                        size="sm"
                                        color="blue"
                                        onClick={() => startEditing("vision-mission")}
                                        className="flex items-center gap-2"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </div>

                                <div className="mb-8">
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Visi
                                    </Typography>
                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                        <Typography>{schoolData.vision}</Typography>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Misi
                                    </Typography>
                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {schoolData.missions.map((mission, index) => (
                                                <li key={index}>{mission}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Tujuan
                                    </Typography>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {schoolData.goals.map((goal, index) => (
                                                <li key={index}>{goal}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h4" className="font-bold">
                                        Edit Visi, Misi & Tujuan
                                    </Typography>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            color="green"
                                            onClick={saveVisionMission}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                            Simpan
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="red"
                                            variant="outlined"
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-2"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                            Batal
                                        </Button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Visi
                                    </Typography>
                                    <Textarea
                                        label="Visi Sekolah"
                                        value={editForm.vision}
                                        onChange={(e) => setEditForm({ ...editForm, vision: e.target.value })}
                                    />
                                </div>

                                <div className="mb-6">
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Misi
                                    </Typography>
                                    <div className="space-y-2 mb-4">
                                        {editForm.missions.map((mission, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="w-full p-2 bg-gray-100 rounded">
                                                    {mission}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    color="red"
                                                    variant="outlined"
                                                    onClick={() => removeItem('mission', index)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            label="Tambah Misi Baru"
                                            value={editForm.newMission}
                                            onChange={(e) => setEditForm({ ...editForm, newMission: e.target.value })}
                                        />
                                        <Button onClick={() => addItem('mission')}>Tambah</Button>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Tujuan
                                    </Typography>
                                    <div className="space-y-2 mb-4">
                                        {editForm.goals.map((goal, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="w-full p-2 bg-gray-100 rounded">
                                                    {goal}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    color="red"
                                                    variant="outlined"
                                                    onClick={() => removeItem('goal', index)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            label="Tambah Tujuan Baru"
                                            value={editForm.newGoal}
                                            onChange={(e) => setEditForm({ ...editForm, newGoal: e.target.value })}
                                        />
                                        <Button onClick={() => addItem('goal')}>Tambah</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>
            )}

            {/* Sejarah Sekolah Section */}
            {activeTab === "history" && (
                <Card>
                    <CardBody>
                        {isEditing !== "history" ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h4" className="font-bold">
                                        Sejarah Sekolah
                                    </Typography>
                                    <Button
                                        size="sm"
                                        color="blue"
                                        onClick={() => startEditing("history")}
                                        className="flex items-center gap-2"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <Typography className="whitespace-pre-line">
                                        {historyData?.text}
                                    </Typography>
                                </div>

                                {historyData?.author && (
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <UserCircleIcon className="h-4 w-4" />
                                        <span>
                                            Terakhir diperbarui pada tanggal : {new Date(historyData.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h4" className="font-bold">
                                        Edit Sejarah Sekolah
                                    </Typography>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            color="green"
                                            onClick={saveHistoryEdit}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                            Simpan
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="red"
                                            variant="outlined"
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-2"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                            Batal
                                        </Button>
                                    </div>
                                </div>

                                <Textarea
                                    label="Sejarah Sekolah"
                                    rows={8}
                                    value={editForm.history}
                                    onChange={(e) => setEditForm({ ...editForm, history: e.target.value })}
                                    className="mb-4"
                                />

                                <Typography variant="small" className="text-gray-500">
                                    Tips: Gunakan format paragraf yang jelas dengan jarak antar paragraf
                                </Typography>
                            </>
                        )}
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default DashboardPage;