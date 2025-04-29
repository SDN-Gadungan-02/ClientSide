import React, { useState, useRef } from "react";
import { Pannellum } from "pannellum-react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
    Textarea,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Avatar,
    Chip,
    Tooltip,
    IconButton
} from "@material-tailwind/react";
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckIcon,
    XMarkIcon,
    PhotoIcon,
    EyeIcon
} from "@heroicons/react/24/solid";

const ManagePanoramaPage = () => {
    // Data contoh
    const initialPanoramas = [
        {
            id: 1,
            name_ruangan: "Aula Sekolah",
            gambar_panorama: "https://example.com/panorama1.jpg",
            hotspots: [
                {
                    pitch: -2.1,
                    yaw: 42,
                    type: "info",
                    text: "Pintu Masuk",
                    sceneId: "aula"
                }
            ]
        }
    ];

    // State management
    const [panoramas, setPanoramas] = useState(initialPanoramas);
    const [openModal, setOpenModal] = useState(false);
    const [currentPanorama, setCurrentPanorama] = useState({
        name_ruangan: "",
        gambar_panorama: "",
        hotspots: []
    });
    const [previewConfig, setPreviewConfig] = useState(null);
    const pannellumRef = useRef(null);

    // Handler modal
    const handleOpenModal = (panorama = null) => {
        setCurrentPanorama(panorama || {
            name_ruangan: "",
            gambar_panorama: "",
            hotspots: []
        });
        setOpenModal(true);
    };

    // Handler preview
    const handlePreview = (panorama) => {
        setPreviewConfig({
            autoLoad: true,
            panorama: panorama.gambar_panorama,
            hotSpots: panorama.hotspots
        });
    };

    // Simpan panorama
    const handleSave = () => {
        if (currentPanorama.id) {
            setPanoramas(panoramas.map(p =>
                p.id === currentPanorama.id ? currentPanorama : p
            ));
        } else {
            setPanoramas([...panoramas, {
                ...currentPanorama,
                id: Math.max(...panoramas.map(p => p.id), 0) + 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                author: 1 // ID admin yang login
            }]);
        }
        setOpenModal(false);
    };

    // Tambah hotspot
    const addHotspot = () => {
        setCurrentPanorama({
            ...currentPanorama,
            hotspots: [
                ...currentPanorama.hotspots,
                {
                    pitch: 0,
                    yaw: 0,
                    type: "info",
                    text: "Hotspot Baru",
                    sceneId: "scene" + Date.now()
                }
            ]
        });
    };

    return (
        <div className="container mx-auto p-4">
            {/* Preview Modal */}
            {previewConfig && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
                    <div className="flex justify-between items-center p-4 bg-gray-900">
                        <Typography variant="h5" color="white">
                            Preview Virtual Tour
                        </Typography>
                        <Button
                            color="red"
                            onClick={() => setPreviewConfig(null)}
                        >
                            Tutup Preview
                        </Button>
                    </div>
                    <div className="flex-1">
                        <Pannellum
                            ref={pannellumRef}
                            width="100%"
                            height="100%"
                            image={previewConfig.panorama}
                            autoLoad
                            showZoomCtrl={true}
                            hotSpots={previewConfig.hotSpots}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <Typography variant="h2" className="text-2xl font-bold mb-6">
                Manajemen Virtual Tour
            </Typography>

            <Card>
                <CardBody>
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h5" className="font-bold">
                            Daftar Panorama
                        </Typography>
                        <Button onClick={() => handleOpenModal()}>
                            <PlusIcon className="h-5 w-5 mr-1" /> Tambah Panorama
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left bg-blue-gray-50">Nama Ruangan</th>
                                    <th className="p-4 text-left bg-blue-gray-50">Hotspot</th>
                                    <th className="p-4 text-left bg-blue-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {panoramas.map(panorama => (
                                    <tr key={panorama.id} className="border-b border-blue-gray-100">
                                        <td className="p-4">{panorama.name_ruangan}</td>
                                        <td className="p-4">
                                            <Chip
                                                value={`${panorama.hotspots.length} Hotspot`}
                                                color="blue"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Tooltip content="Edit">
                                                    <IconButton
                                                        variant="text"
                                                        color="blue"
                                                        onClick={() => handleOpenModal(panorama)}
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Preview">
                                                    <IconButton
                                                        variant="text"
                                                        color="green"
                                                        onClick={() => handlePreview(panorama)}
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Hapus">
                                                    <IconButton
                                                        variant="text"
                                                        color="red"
                                                        onClick={() => setPanoramas(panoramas.filter(p => p.id !== panorama.id))}
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} handler={() => setOpenModal(false)} size="xl">
                <DialogHeader>
                    {currentPanorama.id ? "Edit Panorama" : "Tambah Panorama"}
                </DialogHeader>
                <DialogBody divider className="grid gap-4">
                    <Input
                        label="Nama Ruangan"
                        value={currentPanorama.name_ruangan}
                        onChange={(e) => setCurrentPanorama({
                            ...currentPanorama,
                            name_ruangan: e.target.value
                        })}
                    />

                    <Input
                        label="URL Gambar Panorama"
                        value={currentPanorama.gambar_panorama}
                        onChange={(e) => setCurrentPanorama({
                            ...currentPanorama,
                            gambar_panorama: e.target.value
                        })}
                    />

                    <div className="flex justify-between items-center">
                        <Typography variant="h6">Hotspots</Typography>
                        <Button size="sm" onClick={addHotspot}>
                            <PlusIcon className="h-4 w-4 mr-1" /> Tambah Hotspot
                        </Button>
                    </div>

                    {currentPanorama.hotspots.map((hotspot, index) => (
                        <div key={index} className="border rounded-lg p-4 grid grid-cols-3 gap-4">
                            <Input
                                label="Text"
                                value={hotspot.text}
                                onChange={(e) => {
                                    const newHotspots = [...currentPanorama.hotspots];
                                    newHotspots[index].text = e.target.value;
                                    setCurrentPanorama({ ...currentPanorama, hotspots: newHotspots });
                                }}
                            />
                            <Input
                                type="number"
                                label="Pitch"
                                value={hotspot.pitch}
                                onChange={(e) => {
                                    const newHotspots = [...currentPanorama.hotspots];
                                    newHotspots[index].pitch = parseFloat(e.target.value);
                                    setCurrentPanorama({ ...currentPanorama, hotspots: newHotspots });
                                }}
                            />
                            <Input
                                type="number"
                                label="Yaw"
                                value={hotspot.yaw}
                                onChange={(e) => {
                                    const newHotspots = [...currentPanorama.hotspots];
                                    newHotspots[index].yaw = parseFloat(e.target.value);
                                    setCurrentPanorama({ ...currentPanorama, hotspots: newHotspots });
                                }}
                            />
                        </div>
                    ))}

                    <Button
                        color="light-blue"
                        onClick={() => handlePreview(currentPanorama)}
                        className="flex items-center gap-2"
                    >
                        <EyeIcon className="h-5 w-5" /> Preview
                    </Button>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setOpenModal(false)}
                        className="mr-1"
                    >
                        <XMarkIcon className="h-5 w-5" /> Batal
                    </Button>
                    <Button
                        color="green"
                        onClick={handleSave}
                    >
                        <CheckIcon className="h-5 w-5" /> Simpan
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManagePanoramaPage;