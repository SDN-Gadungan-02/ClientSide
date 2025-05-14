import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import {
    Card, CardBody, Typography, Button, Input, Dialog,
    DialogHeader, DialogBody, DialogFooter, Chip, Select, Option,
    IconButton, Textarea, Tooltip
} from "@material-tailwind/react";
import {
    PencilIcon, TrashIcon, PlusIcon, EyeIcon,
    CheckIcon, XMarkIcon, ArrowLeftIcon, PhotoIcon,
    ArrowRightIcon, InformationCircleIcon
} from "@heroicons/react/24/solid";
import VirtualTourService from '../../services/virtualtourService';
import PreviewPane from '../../components/admin/PreviewPane';

const HotspotModal = React.memo(({
    show,
    onClose,
    hotspotData,
    panoramas,
    selectedPanorama,
    onSave,
    onDelete,
    isSaving,
    pannellumRef
}) => {
    const [form, setForm] = useState({
        text: '',
        description: '',
        pitch: 0,
        yaw: 0,
        targetPanoramaId: null,
    });

    useEffect(() => {
        if (show) {
            const viewer = pannellumRef?.current;
            if (!viewer) return;

            const getViewerValues = () => {
                try {
                    return {
                        pitch: parseFloat(viewer.getPitch().toFixed(6)),
                        yaw: parseFloat(viewer.getYaw().toFixed(6))
                    };
                } catch (e) {
                    console.error("Gagal mendapatkan nilai dari viewer:", e);
                    return { pitch: 0, yaw: 0 };
                }
            };

            const timeout = setTimeout(() => {
                const { pitch: currentPitch, yaw: currentYaw } = getViewerValues();

                if (hotspotData) {
                    setForm({
                        text: hotspotData.text || '',
                        description: hotspotData.description || '',
                        pitch: hotspotData.pitch ?
                            parseFloat(hotspotData.pitch) :
                            currentPitch,
                        yaw: hotspotData.yaw ?
                            parseFloat(hotspotData.yaw) :
                            currentYaw,
                        targetPanoramaId: hotspotData.targetPanoramaId || null,
                    });
                } else {
                    setForm({
                        text: '',
                        description: '',
                        pitch: currentPitch,
                        yaw: currentYaw,
                        targetPanoramaId: null,
                    });
                }

                if (hotspotData) {
                    viewer.lookAt(
                        parseFloat(hotspotData.yaw || currentYaw),
                        parseFloat(hotspotData.pitch || currentPitch),
                        1000
                    );
                }
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [show, hotspotData, pannellumRef]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.text || form.pitch === undefined || form.yaw === undefined) {
            alert('Harap isi semua field yang wajib diisi');
            return;
        }
        onSave({
            ...hotspotData,
            ...form
        });
    };

    return (
        <Dialog open={show} handler={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    {hotspotData?.id ? 'Edit Hotspot' : 'Tambah Hotspot Baru'}
                </DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input
                            label="Judul Hotspot"
                            value={form.text}
                            onChange={(e) => setForm({ ...form, text: e.target.value })}
                            autoFocus
                            required
                        />

                        <Textarea
                            label="Deskripsi"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                label="Pitch"
                                value={form.pitch}
                                onChange={(e) => setForm({
                                    ...form,
                                    pitch: parseFloat(e.target.value) || 0
                                })}
                                step="0.000001"
                                required
                            />
                            <Input
                                type="number"
                                label="Yaw"
                                value={form.yaw}
                                onChange={(e) => setForm({
                                    ...form,
                                    yaw: parseFloat(e.target.value) || 0
                                })}
                                step="0.000001"
                                required
                            />
                        </div>

                        <Select
                            label="Target Panorama"
                            value={form.targetPanoramaId || ''}
                            onChange={(value) => setForm({ ...form, targetPanoramaId: value })}
                        >
                            <Option value="">Pilih Target</Option>
                            {panoramas.filter(p => p.id !== selectedPanorama?.id).map(p => (
                                <Option key={p.id} value={p.id}>
                                    {p.nama_ruangan} ({p.hotspots?.length || 0} hotspot)
                                </Option>
                            ))}
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => onDelete(hotspotData)}
                        className="mr-1"
                        disabled={isSaving}
                    >
                        <TrashIcon className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                    <div className="flex-1"></div>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={onClose}
                        className="mr-1"
                        disabled={isSaving}
                    >
                        Batal
                    </Button>
                    <Button
                        color="blue"
                        type="submit"
                        disabled={isSaving || !form.text.trim()}
                    >
                        {isSaving ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            </span>
                        ) : (
                            <>
                                <CheckIcon className="h-4 w-4 mr-1" /> Simpan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
});

const PanoramaCard = ({ panorama, isSelected, onClick, onDelete, isUploading }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <Card
            onClick={onClick}
            className={`cursor-pointer p-3 transition-all ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <Typography variant="h6" className="font-medium">
                        {panorama.nama_ruangan}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                        {panorama.hotspots?.length || 0} Hotspot
                    </Typography>
                </div>
                <Tooltip content="Hapus panorama">
                    <IconButton
                        variant="text"
                        color="red"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                        }}
                        disabled={isUploading}
                    >
                        <TrashIcon className="h-4 w-4" />
                    </IconButton>
                </Tooltip>
            </div>

            <Dialog open={showDeleteConfirm} handler={() => setShowDeleteConfirm(false)} size="xs">
                <DialogHeader>Konfirmasi Hapus</DialogHeader>
                <DialogBody>
                    Apakah Anda yakin ingin menghapus "{panorama.nama_ruangan}"? Ini akan menghapus semua hotspot yang terkait.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="mr-1"
                        disabled={isUploading}
                    >
                        Batal
                    </Button>
                    <Button
                        color="red"
                        onClick={() => {
                            onDelete(panorama);
                            setShowDeleteConfirm(false);
                        }}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menghapus...
                            </span>
                        ) : (
                            <>
                                <TrashIcon className="h-4 w-4 mr-1" /> Hapus
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

const ManageVirtualTourPage = () => {
    const [panoramas, setPanoramas] = useState([]);
    const [selectedPanorama, setSelectedPanorama] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSavingHotspot, setIsSavingHotspot] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [showHotspotModal, setShowHotspotModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [formData, setFormData] = useState({
        nama_ruangan: '',
        gambar_panorama: '',
        hotspots: []
    });
    const [activeHotspot, setActiveHotspot] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const pannellumRef = useRef(null);
    const previewPannellumRef = useRef(null); // Untuk mode preview normal
    const modalPannellumRef = useRef(null); // Untuk preview di modal

    const [pendingHotspot, setPendingHotspot] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            [pannellumRef, previewPannellumRef, modalPannellumRef].forEach(ref => {
                if (ref.current) {
                    ref.current.destroy();
                    ref.current = null;
                }
            });
        };
    }, []);

    useEffect(() => {
        // Jika ada hotspot yang menunggu untuk disimpan setelah panorama disimpan
        if (pendingHotspot && selectedPanorama?.id && !editMode) {
            // Now we can safely save the hotspot
            handleSaveHotspot(pendingHotspot);
            setPendingHotspot(null);
        }
    }, [selectedPanorama, pendingHotspot, editMode]);

    useEffect(() => {
        loadPanoramas();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        // Buat URL sementara untuk pratinjau
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result); // Perbarui previewUrl
            setFormData((prev) => ({
                ...prev,
                gambar_panorama: reader.result // Perbarui formData.gambar_panorama
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            setIsUploading(true);
            setUploadError(null);

            if (!formData.nama_ruangan.trim()) {
                throw new Error("Nama ruangan harus diisi");
            }

            if (!selectedFile && !formData.gambar_panorama) {
                throw new Error("Gambar panorama harus diunggah");
            }

            const payload = new FormData();
            payload.append('nama_ruangan', formData.nama_ruangan);
            if (selectedFile) {
                payload.append('gambar_panorama', selectedFile);
            } else if (formData.gambar_panorama.startsWith('data:')) {
                const blob = await fetch(formData.gambar_panorama).then(r => r.blob());
                payload.append('gambar_panorama', blob);
            }

            let response;
            if (selectedPanorama?.id) {
                // Update existing panorama
                response = await VirtualTourService.updateVirtualTour(selectedPanorama.id, payload);
            } else {
                // Create new panorama
                response = await VirtualTourService.createVirtualTour(payload);
            }

            if (!response.success) {
                throw new Error(response.message || "Gagal menyimpan panorama");
            }

            // Update state dengan data baru dari server
            const savedPanorama = response.data;
            setSelectedPanorama(savedPanorama);
            setFormData({
                nama_ruangan: savedPanorama.nama_ruangan,
                gambar_panorama: savedPanorama.gambar_panorama,
                hotspots: savedPanorama.hotspots || []
            });

            // Refresh data
            await loadPanoramas();
            setEditMode(false);
            setShowSaveModal(false);
            setSelectedFile(null);
            setPreviewUrl('');

            // If there was a pending hotspot, now we can save it
            if (pendingHotspot) {
                handleSaveHotspot(pendingHotspot);
                setPendingHotspot(null);
            }
        } catch (error) {
            console.error("Error menyimpan:", error);
            setUploadError(error.message || "Gagal menyimpan virtual tour");
        } finally {
            setIsUploading(false);
        }
    };

    const loadPanoramas = async () => {
        try {
            const response = await VirtualTourService.getPanoramas();
            if (!response.success) throw new Error(response.message || 'Gagal memuat panorama');

            const panoramaData = Array.isArray(response.data) ? response.data : [];
            const panoramasWithHotspots = panoramaData.map(panorama => ({
                ...panorama,
                hotspots: (panorama.hotspots || []).map(hotspot => ({
                    ...hotspot,
                    id_panorama_asal: hotspot.id_panorama_asal || panorama.id // Pastikan id_panorama_asal ada
                }))
            }));

            console.log("Loaded Panoramas:", panoramasWithHotspots); // Debugging log

            setPanoramas(panoramasWithHotspots);
        } catch (error) {
            console.error("Gagal memuat panorama:", error);
            setPanoramas([]);
            setUploadError(error.message || "Gagal memuat panorama. Silakan coba lagi.");
        }
    };

    const handleHapusPanorama = async (panorama) => {
        try {
            setIsUploading(true);
            await VirtualTourService.deleteVirtualTour(panorama.id);

            // Show success message
            setUploadError(null);

            // Reset selection if deleting the currently selected panorama
            if (selectedPanorama?.id === panorama.id) {
                setSelectedPanorama(null);
                setFormData({
                    nama_ruangan: '',
                    gambar_panorama: '',
                    hotspots: []
                });
            }

            // Refresh the list
            await loadPanoramas();
        } catch (error) {
            console.error("Gagal menghapus:", error);
            setUploadError(error.message || "Gagal menghapus panorama. Pastikan tidak ada hotspot yang terkait.");
        } finally {
            setIsUploading(false);
        }
    };

    // Pastikan handleSelectPanorama mempertahankan semua data hotspot
    const handleSelectPanorama = useCallback((panorama) => {
        // Filter hotspot berdasarkan id_panorama_asal
        const filteredHotspots = (panorama.hotspots || []).filter(
            (hotspot) => hotspot.id_panorama_asal === panorama.id
        );

        console.log("Selected Panorama:", panorama); // Debugging log
        console.log("Filtered Hotspots:", filteredHotspots); // Debugging log

        setSelectedPanorama({
            ...panorama,
            hotspots: filteredHotspots, // Hanya hotspot yang sesuai dengan panorama asal
        });

        setFormData({
            nama_ruangan: panorama.nama_ruangan,
            gambar_panorama: panorama.gambar_panorama,
            hotspots: filteredHotspots,
        });

        setEditMode(false); // Pastikan editMode di-set ke false
        setActiveHotspot(null);
    }, []);

    const handleNewPanorama = () => {
        setSelectedPanorama(null);
        setFormData({
            nama_ruangan: '',
            gambar_panorama: '',
            hotspots: []
        });
        setEditMode(true);
        setActiveHotspot(null);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleAddHotspot = useCallback((position) => {
        if (!pannellumRef.current || !formData.gambar_panorama) {
            alert('Harap unggah dan pilih gambar panorama terlebih dahulu');
            return;
        }

        const viewer = pannellumRef.current;

        setTimeout(() => {
            const currentPitch = viewer.getPitch();
            const currentYaw = viewer.getYaw();

            const newHotspot = {
                id_panorama_asal: selectedPanorama?.id, // Panorama asal
                pitch: position.pitch || currentPitch,
                yaw: position.yaw || currentYaw,
                text: `Hotspot ${formData.hotspots.length + 1}`,
                description: "Deskripsi di sini",
                targetPanoramaId: null, // Panorama tujuan (default null)
            };

            console.log("New Hotspot:", newHotspot); // Debugging log

            setFormData((prev) => ({
                ...prev,
                hotspots: [...prev.hotspots, newHotspot],
            }));
            setActiveHotspot(newHotspot);
            setShowHotspotModal(true);

            // Fokuskan ke posisi hotspot baru
            viewer.lookAt(
                position.yaw || currentYaw,
                position.pitch || currentPitch,
                1000
            );
        }, 100);
    }, [formData.hotspots.length, formData.gambar_panorama, selectedPanorama]);

    const handleAddHotspotButton = useCallback(() => {
        if (!viewerInstance.current || !editMode) { // Tambahkan pengecekan editMode
            console.error("Viewer not ready or not in edit mode");
            return;
        }

        if (!pannellumRef.current || !formData.gambar_panorama) {
            alert('Harap unggah dan pilih gambar panorama terlebih dahulu');
            return;
        }

        const viewer = pannellumRef.current;
        const pitch = viewer.getPitch();
        const yaw = viewer.getYaw();

        handleAddHotspot({ pitch, yaw });

    }, [formData.gambar_panorama, handleAddHotspot]);


    const handleSaveHotspot = useCallback(debounce(async (updatedHotspot) => {
        try {
            setIsSavingHotspot(true);

            if (!updatedHotspot.text || !updatedHotspot.pitch || !updatedHotspot.yaw) {
                throw new Error("Harap isi semua field yang wajib diisi");
            }

            let panoramaId = selectedPanorama?.id;

            // Simpan panorama jika belum disimpan
            if (!panoramaId) {
                console.log("Panorama belum tersimpan. Menyimpan panorama terlebih dahulu...");
                const payload = new FormData();
                payload.append('nama_ruangan', formData.nama_ruangan);
                if (selectedFile) payload.append('gambar_panorama', selectedFile);

                const panoramaResponse = await VirtualTourService.createVirtualTour(payload);
                if (!panoramaResponse.success) {
                    throw new Error(panoramaResponse.message || "Gagal menyimpan panorama");
                }

                panoramaId = panoramaResponse.data.id;
                setSelectedPanorama(panoramaResponse.data);
                console.log("Panorama berhasil disimpan:", panoramaResponse.data);
            }

            const hotspotData = {
                id_panorama_asal: panoramaId, // Gunakan ID panorama yang valid
                pitch: updatedHotspot.pitch,
                yaw: updatedHotspot.yaw,
                text: updatedHotspot.text,
                description: updatedHotspot.description || '',
                targetPanoramaId: updatedHotspot.targetPanoramaId || null, // Panorama tujuan
            };

            console.log("Membuat hotspot dengan data:", hotspotData);

            let savedHotspot;
            if (updatedHotspot.id) {
                const response = await VirtualTourService.updateHotspot(
                    panoramaId,
                    updatedHotspot.id,
                    hotspotData
                );
                savedHotspot = response.data;
            } else {
                const response = await VirtualTourService.createHotspot(
                    panoramaId,
                    hotspotData
                );
                savedHotspot = response.data;
            }

            setFormData(prev => ({
                ...prev,
                hotspots: [...prev.hotspots, savedHotspot],
            }));

            setActiveHotspot(savedHotspot);
            setShowHotspotModal(false);
        } catch (error) {
            console.error("Gagal menyimpan hotspot:", error);
            setUploadError(error.message || "Gagal menyimpan hotspot");
        } finally {
            setIsSavingHotspot(false);
        }
    }, 300), [selectedPanorama, formData, activeHotspot, selectedFile]);

    const handleDeleteHotspot = useCallback(async () => {
        try {
            setFormData(prev => ({
                ...prev,
                hotspots: prev.hotspots.filter(h => h !== activeHotspot)
            }));

            if (activeHotspot?.id && selectedPanorama?.id) {
                await VirtualTourService.deleteHotspot(selectedPanorama.id, activeHotspot.id);
            }

            setActiveHotspot(null);
            setShowHotspotModal(false);
        } catch (error) {
            console.error("Gagal menghapus hotspot:", error);
            setUploadError("Gagal menghapus hotspot");
        }
    }, [activeHotspot, selectedPanorama?.id]);

    const handleClearAllHotspots = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            hotspots: []
        }));
        setActiveHotspot(null);
    }, []);


    const SaveModal = () => (
        <Dialog open={showSaveModal} handler={() => setShowSaveModal(false)}>
            <DialogHeader>Konfirmasi Perubahan</DialogHeader>
            <DialogBody>
                Apakah Anda yakin ingin menyimpan perubahan ini? Ini akan memperbarui virtual tour.
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="blue-gray"
                    onClick={() => setShowSaveModal(false)}
                    className="mr-1"
                >
                    Batal
                </Button>
                <Button
                    color="green"
                    onClick={handleSave}
                    disabled={isUploading}
                >
                    {isUploading ? 'Menyimpan...' : (
                        <>
                            <CheckIcon className="h-4 w-4 mr-1" /> Simpan
                        </>
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    );

    return (
        <div className="container mx-auto p-4">
            <Typography variant="h2" className="text-2xl font-bold mb-6">
                Manajemen Virtual Tour
            </Typography>

            {uploadError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    {uploadError}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardBody>
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h5">Daftar Panorama</Typography>
                            <Button onClick={handleNewPanorama} size="sm" disabled={isUploading}>
                                <PlusIcon className="h-4 w-4 mr-1" /> Baru
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {panoramas.map(panorama => (
                                <PanoramaCard
                                    key={panorama.id}
                                    panorama={panorama}
                                    isSelected={selectedPanorama?.id === panorama.id}
                                    onClick={() => !isUploading && handleSelectPanorama(panorama)}
                                    onDelete={handleHapusPanorama}
                                />
                            ))}
                        </div>
                    </CardBody>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                    {selectedPanorama && !editMode && (
                        <Card>
                            <CardBody>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h4">{selectedPanorama.nama_ruangan}</Typography>
                                    <div className="flex gap-2">
                                        <Button onClick={() => setEditMode(true)} disabled={isUploading}>
                                            <PencilIcon className="h-4 w-4 mr-1" /> Edit
                                        </Button>
                                        <Button onClick={() => setPreviewMode(true)} disabled={isUploading}>
                                            <EyeIcon className="h-4 w-4 mr-1" /> Pratinjau
                                        </Button>
                                    </div>
                                </div>
                                <div className="h-96">
                                    <PreviewPane
                                        pannellumRef={previewPannellumRef}
                                        image={selectedPanorama.gambar_panorama}
                                        hotspots={selectedPanorama.hotspots || []}
                                        editMode={false} // Pastikan false untuk mode view
                                        panoramas={panoramas}
                                        onSelectPanorama={handleSelectPanorama}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    )}


                    {editMode && (
                        <Card>
                            <CardBody>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h4">
                                        {selectedPanorama ? 'Panorama' : 'Buat Panorama Baru'}
                                    </Typography>
                                    <div className="flex gap-2">
                                        <Button variant="outlined" onClick={() => setEditMode(false)} disabled={isUploading}>
                                            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Kembali
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Input
                                            label="Nama Ruangan"
                                            value={formData.nama_ruangan}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nama_ruangan: e.target.value
                                            })}
                                            disabled={isUploading}
                                        />

                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                id="panorama-upload"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                            <Button
                                                variant="outlined"
                                                color="blue"
                                                fullWidth
                                                className="flex items-center gap-2"
                                                disabled={isUploading}
                                                onClick={() => fileInputRef.current.click()}
                                                type="button"
                                            >
                                                <PhotoIcon className="h-5 w-5" />
                                                Unggah Gambar Panorama
                                            </Button>

                                            {/* {previewUrl && (
                                                <div className="mt-2">
                                                    <Typography variant="small" className="mb-1">
                                                        Pratinjau:
                                                    </Typography>
                                                    <img
                                                        src={previewUrl}
                                                        alt="Pratinjau panorama"
                                                        className="h-32 object-cover rounded-lg border"
                                                    />
                                                </div>
                                            )} */}
                                        </div>

                                        <div className="pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <Typography variant="h6">
                                                    Hotspot ({formData.hotspots.length})
                                                </Typography>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="gradient"
                                                        size="sm"
                                                        onClick={handleAddHotspotButton}
                                                        disabled={isUploading || !formData.gambar_panorama}
                                                    >
                                                        <PlusIcon className="h-4 w-4" /> Tambah
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="red"
                                                        size="sm"
                                                        onClick={handleClearAllHotspots}
                                                        disabled={isUploading || formData.hotspots.length === 0}
                                                    >
                                                        <TrashIcon className="h-4 w-4" /> Hapus Semua
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {formData.hotspots.map((hotspot, index) => {
                                                    const pitch = typeof hotspot.pitch === 'number' ? hotspot.pitch : parseFloat(hotspot.pitch) || 0;
                                                    const yaw = typeof hotspot.yaw === 'number' ? hotspot.yaw : parseFloat(hotspot.yaw) || 0;

                                                    return (
                                                        <Chip
                                                            key={index}
                                                            value={`${hotspot.text || 'Hotspot'} (${pitch.toFixed(1)}, ${yaw.toFixed(1)})`}
                                                            color={activeHotspot?.id === hotspot.id ? 'blue' : 'gray'}
                                                            onClick={() => {
                                                                setActiveHotspot(hotspot);
                                                                setShowHotspotModal(true);
                                                            }}
                                                            onDoubleClick={() => {
                                                                if (pannellumRef.current && formData.gambar_panorama) {
                                                                    pannellumRef.current.lookAt(
                                                                        yaw,
                                                                        pitch,
                                                                        1000
                                                                    );
                                                                }
                                                            }}
                                                            className="cursor-pointer"
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-96">
                                        <PreviewPane
                                            pannellumRef={pannellumRef}
                                            image={formData.gambar_panorama}
                                            hotspots={selectedPanorama?.hotspots || []}
                                            editMode={editMode} // Pastikan true untuk mode edit
                                            onAddHotspot={handleAddHotspot}
                                            panoramas={panoramas}
                                            onSelectPanorama={handleSelectPanorama}
                                        />
                                    </div>
                                </div>
                            </CardBody>

                            <CardBody className="pt-0">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outlined"
                                        color="red"
                                        onClick={() => setEditMode(false)}
                                        disabled={isUploading}
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-1" /> Batal
                                    </Button>
                                    <Button
                                        color="green"
                                        onClick={() => setShowSaveModal(true)}
                                        disabled={isUploading}
                                    >
                                        <CheckIcon className="h-4 w-4 mr-1" /> Simpan
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>

            <Dialog open={previewMode} handler={() => setPreviewMode(false)} size="xl">
                <DialogHeader>
                    Pratinjau Virtual Tour - {selectedPanorama?.nama_ruangan}
                </DialogHeader>
                <DialogBody className="p-0 h-[70vh]">
                    <PreviewPane
                        pannellumRef={modalPannellumRef}
                        image={selectedPanorama?.gambar_panorama}
                        hotspots={selectedPanorama?.hotspots || []}
                        editMode={false}
                        panoramas={panoramas}
                        onSelectPanorama={handleSelectPanorama}
                    />
                </DialogBody>
                <DialogFooter>
                    <Button onClick={() => setPreviewMode(false)}>Tutup</Button>
                </DialogFooter>
            </Dialog>

            <HotspotModal
                show={showHotspotModal}
                onClose={() => setShowHotspotModal(false)}
                hotspotData={activeHotspot}
                panoramas={panoramas}
                selectedPanorama={selectedPanorama}
                onSave={handleSaveHotspot}
                onDelete={handleDeleteHotspot}
                isSaving={isSavingHotspot}
                pannellumRef={editMode ? pannellumRef : previewPannellumRef}
            />

            <SaveModal />
        </div>
    );
};

export default ManageVirtualTourPage;