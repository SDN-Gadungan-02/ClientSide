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
import VisiMisiService from '../../services/visiMisiService';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState("vision-mission");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // State untuk data statistik
    const stats = [
        { title: "Total Postingan", value: "24", icon: <DocumentTextIcon className="h-6 w-6" />, color: "bg-blue-500" },
        { title: "Total Guru", value: "12", icon: <AcademicCapIcon className="h-6 w-6" />, color: "bg-green-500" },
        { title: "Total Pengunjung", value: "1,234", icon: <UsersIcon className="h-6 w-6" />, color: "bg-amber-500" },
        { title: "Aktivitas Terbaru", value: "5", icon: <ChartBarIcon className="h-6 w-6" />, color: "bg-purple-500" }
    ];

    const [historyData, setHistoryData] = useState(null);
    const [visiMisiData, setVisiMisiData] = useState({
        id: null,
        visi: "Memuat visi sekolah...",
        misi: ["Memuat misi sekolah..."],
        tujuan: ["Memuat tujuan sekolah..."],
        author: null,
        createdAt: null,
        updatedAt: null
    });

    const [editForm, setEditForm] = useState({
        vision: "",
        newMission: "",
        missions: [],
        newGoal: "",
        goals: [],
        history: ""
    });

    const loadData = async () => {
        try {
            setIsLoading(true);

            const historyResponse = await HistoryService.getHistory();
            setHistoryData({
                id: historyResponse.data.id,
                text: historyResponse.data.text_history || "Sejarah sekolah belum tersedia",
                author: historyResponse.data.author,
                createdAt: historyResponse.data.created_at,
                updatedAt: historyResponse.data.updated_at
            });

            const visiMisiResponse = await VisiMisiService.getVisiMisi();
            setVisiMisiData({
                id: visiMisiResponse.data.id,
                visi: visiMisiResponse.data.text_visi || "Visi sekolah belum tersedia",
                misi: Array.isArray(visiMisiResponse.data.text_misi) ?
                    visiMisiResponse.data.text_misi :
                    [visiMisiResponse.data.text_misi || "Misi sekolah belum tersedia"],
                tujuan: Array.isArray(visiMisiResponse.data.text_tujuan) ?
                    visiMisiResponse.data.text_tujuan :
                    [visiMisiResponse.data.text_tujuan || "Tujuan sekolah belum tersedia"],
                author: visiMisiResponse.data.author,
                createdAt: visiMisiResponse.data.created_at,
                updatedAt: visiMisiResponse.data.updated_at
            });

            setEditForm({
                vision: visiMisiResponse.data.text_visi || "",
                newMission: "",
                missions: Array.isArray(visiMisiResponse.data.text_misi) ?
                    visiMisiResponse.data.text_misi :
                    [visiMisiResponse.data.text_misi || ""],
                newGoal: "",
                goals: Array.isArray(visiMisiResponse.data.text_tujuan) ?
                    visiMisiResponse.data.text_tujuan :
                    [visiMisiResponse.data.text_tujuan || ""],
                history: historyResponse.data.text_history || ""
            });

            setIsLoading(false);
        } catch (error) {
            console.error("Gagal memuat data:", error);
            toast.error("Gagal memuat data");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const startEditing = (section) => {
        setEditForm({
            vision: visiMisiData.visi,
            newMission: "",
            missions: Array.isArray(visiMisiData.misi) ? [...visiMisiData.misi] : [visiMisiData.misi],
            newGoal: "",
            goals: Array.isArray(visiMisiData.tujuan) ? [...visiMisiData.tujuan] : [visiMisiData.tujuan],
            history: historyData?.text || ""
        });
        setIsEditing(section);
    };

    const saveVisionMission = async () => {
        try {
            const response = await VisiMisiService.updateVisiMisi({
                text_visi: editForm.vision,
                text_misi: editForm.missions,
                text_tujuan: editForm.goals
            });

            setVisiMisiData({
                id: response.data.id,
                visi: response.data.text_visi,
                misi: Array.isArray(response.data.text_misi) ?
                    response.data.text_misi :
                    [response.data.text_misi],
                tujuan: Array.isArray(response.data.text_tujuan) ?
                    response.data.text_tujuan :
                    [response.data.text_tujuan],
                author: response.data.author,
                createdAt: response.data.created_at,
                updatedAt: response.data.updated_at
            });

            setIsEditing(false);
            toast.success("Visi, Misi & Tujuan berhasil diperbarui");
        } catch (error) {
            console.error("Gagal memperbarui visi misi:", error);
            toast.error("Gagal memperbarui visi dan misi");
        }
    };

    const saveHistoryEdit = async () => {
        try {
            const response = await HistoryService.updateHistory({
                text_history: editForm.history
            });

            setHistoryData({
                id: response.data.id,
                text: editForm.history,
                author: response.data.author,
                createdAt: response.data.created_at,
                updatedAt: response.data.updated_at
            });

            setIsEditing(false);
            toast.success("Sejarah sekolah berhasil diperbarui");
        } catch (error) {
            console.error("Gagal memperbarui sejarah sekolah:", error);
            toast.error("Gagal memperbarui sejarah sekolah");
        }
    };

    const addItem = (type) => {
        if (type === 'mission' && editForm.newMission.trim()) {
            setEditForm(prev => ({
                ...prev,
                missions: [...prev.missions, prev.newMission.trim()],
                newMission: ""
            }));
        } else if (type === 'goal' && editForm.newGoal.trim()) {
            setEditForm(prev => ({
                ...prev,
                goals: [...prev.goals, prev.newGoal.trim()],
                newGoal: ""
            }));
        }
    };

    const removeItem = (type, index) => {
        if (type === 'mission') {
            setEditForm(prev => {
                const updatedMissions = [...prev.missions];
                updatedMissions.splice(index, 1);
                return { ...prev, missions: updatedMissions };
            });
        } else if (type === 'goal') {
            setEditForm(prev => {
                const updatedGoals = [...prev.goals];
                updatedGoals.splice(index, 1);
                return { ...prev, goals: updatedGoals };
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
                <Typography variant="paragraph" className="ml-4">
                    Memuat data...
                </Typography>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <Typography variant="h2" className="text-2xl font-bold mb-6 text-gray-800">
                Profil Sekolah
            </Typography>

            {/* Statistik */}
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

            {/* Tab Navigasi */}
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
                                        <Typography>{visiMisiData.visi}</Typography>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Misi
                                    </Typography>
                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {Array.isArray(visiMisiData.misi) ?
                                                visiMisiData.misi.map((mission, index) => (
                                                    <li key={index}>{mission}</li>
                                                )) :
                                                <li>{visiMisiData.misi || "Tidak ada misi"}</li>
                                            }
                                        </ul>
                                    </div>
                                </div>

                                {/* Bagian Tujuan */}
                                <div className="mb-4">
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Tujuan
                                    </Typography>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {Array.isArray(visiMisiData.tujuan) ?
                                                visiMisiData.tujuan.map((goal, index) => (
                                                    <li key={index}>{goal}</li>
                                                )) :
                                                <li>{visiMisiData.tujuan || "Tidak ada tujuan"}</li>
                                            }
                                        </ul>
                                    </div>
                                </div>

                                {/* Informasi Pembaruan Terakhir */}
                                {visiMisiData.author && (
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
                                        <UserCircleIcon className="h-4 w-4" />
                                        <span>
                                            Terakhir diperbarui oleh: {visiMisiData.author} •
                                            {new Date(visiMisiData.updatedAt || visiMisiData.createdAt).toLocaleDateString('id-ID', {
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
                            /* Mode Edit */
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

                                {/* Edit Visi */}
                                <div className="mb-6">
                                    <Typography variant="h5" className="mb-2 font-semibold">
                                        Visi
                                    </Typography>
                                    <Textarea
                                        label="Visi Sekolah"
                                        value={editForm.vision}
                                        onChange={(e) => setEditForm({ ...editForm, vision: e.target.value })}
                                        className="mb-2"
                                    />
                                    <Typography variant="small" className="text-gray-500">
                                        Tuliskan visi sekolah dengan jelas dan inspiratif
                                    </Typography>
                                </div>

                                {/* Edit Misi */}
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
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            label="Tambah Misi Baru"
                                            value={editForm.newMission}
                                            onChange={(e) => setEditForm({ ...editForm, newMission: e.target.value })}
                                            className="flex-grow"
                                        />
                                        <Button
                                            onClick={() => addItem('mission')}
                                            disabled={!editForm.newMission.trim()}
                                        >
                                            Tambah
                                        </Button>
                                    </div>
                                    <Typography variant="small" className="text-gray-500">
                                        Tambahkan misi sekolah satu per satu
                                    </Typography>
                                </div>

                                {/* Edit Tujuan */}
                                <div className="mb-4">
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
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            label="Tambah Tujuan Baru"
                                            value={editForm.newGoal}
                                            onChange={(e) => setEditForm({ ...editForm, newGoal: e.target.value })}
                                            className="flex-grow"
                                        />
                                        <Button
                                            onClick={() => addItem('goal')}
                                            disabled={!editForm.newGoal.trim()}
                                        >
                                            Tambah
                                        </Button>
                                    </div>
                                    <Typography variant="small" className="text-gray-500">
                                        Tambahkan tujuan yang ingin dicapai sekolah
                                    </Typography>
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>
            )}

            {/* Konten Tab Sejarah Sekolah */}
            {activeTab === "history" && (
                <Card>
                    <CardBody>
                        {isEditing !== "history" ? (
                            /* Mode Tampilan */
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
                                            Terakhir diperbarui oleh: {historyData.author} •
                                            {new Date(historyData.updatedAt || historyData.createdAt).toLocaleDateString('id-ID', {
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
                            /* Mode Edit */
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
                                    Tips:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Gunakan format paragraf yang jelas</li>
                                        <li>Ceritakan sejarah sekolah secara kronologis</li>
                                        <li>Sertakan pencapaian penting sekolah</li>
                                    </ul>
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