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
    isSaving
}) => {
    const [form, setForm] = useState({
        text: '',
        description: '',
        pitch: 0,
        yaw: 0,
        targetPanoramaId: null,
    });

    useEffect(() => {
        if (hotspotData) {
            setForm({
                text: hotspotData.text || '',
                description: hotspotData.description || '',
                pitch: hotspotData.pitch || 0,
                yaw: hotspotData.yaw || 0,
                targetPanoramaId: hotspotData.targetPanoramaId || null,
            });
        }
    }, [hotspotData]);

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

    const getHotspotIcon = (type) => {
        switch (type) {
            case 'scene':
                return <ArrowRightIcon className="h-5 w-5 text-blue-500" />;
            case 'info':
                return <InformationCircleIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <InformationCircleIcon className="h-5 w-5" />;
        }
    };

    return (
        <Dialog open={show} handler={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    {hotspotData?.id ? 'Edit Hotspot' : 'Tambah Hotspot Baru'}
                </DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            {getHotspotIcon(form.type)}
                            <Input
                                label="Judul Hotspot"
                                value={form.text}
                                onChange={(e) => setForm({ ...form, text: e.target.value })}
                                autoFocus
                                required
                            />
                        </div>

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
                                    pitch: Number(e.target.value) || 0
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
                                    yaw: Number(e.target.value) || 0
                                })}
                                step="0.000001"
                                required
                            />
                        </div>



                        <Select
                            label="Target Panorama"
                            value={form.targetPanoramaId || ''}
                            onChange={(value) => setForm({ ...form, targetPanoramaId: value })}
                            required={form.type === 'scene'}
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
                        disabled={isSaving || !form.text.trim() || (form.type === 'scene' && !form.targetPanoramaId)}
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
    const fileInputRef = useRef(null);

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

            // Validasi
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
            }

            let response;
            if (selectedPanorama?.id && !selectedPanorama.id.toString().startsWith('temp-')) {
                response = await VirtualTourService.updateVirtualTour(selectedPanorama.id, payload);
            } else {
                response = await VirtualTourService.createVirtualTour(payload);
            }

            if (!response.success) {
                throw new Error(response.message || "Gagal menyimpan panorama");
            }

            // Refresh data
            await loadPanoramas();
            setEditMode(false);
            setShowSaveModal(false);
            setSelectedFile(null);
            setPreviewUrl('');
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
                hotspots: panorama.hotspots || []
            }));

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
    // In handleSelectPanorama
    const handleSelectPanorama = useCallback((panorama) => {
        const formattedHotspots = (panorama.hotspots || []).map(hotspot => ({
            id: hotspot.id,
            pitch: parseFloat(hotspot.pitch) || 0,
            yaw: parseFloat(hotspot.yaw) || 0,
            text: hotspot.text || hotspot.name_deskripsi || "Hotspot",
            description: hotspot.description || hotspot.deskripsi || "",
            targetPanoramaId: hotspot.targetPanoramaId || hotspot.targetpanoramald || null,
            type: hotspot.type || (hotspot.targetpanoramald ? 'scene' : 'info')
        }));

        setSelectedPanorama(panorama);
        setFormData({
            nama_ruangan: panorama.nama_ruangan,
            gambar_panorama: panorama.gambar_panorama,
            hotspots: formattedHotspots
        });
        setPreviewUrl(panorama.gambar_panorama);
        setEditMode(false);
    }, []);


    const handleNewPanorama = () => {
        setSelectedPanorama({
            id: 'temp-' + Date.now(),
            nama_ruangan: '',
            gambar_panorama: '',
            hotspots: []
        });
        setFormData({
            nama_ruangan: '',
            gambar_panorama: '',
            hotspots: []
        });
        setEditMode(true);
    };

    // In your handleAddHotspot function
    const handleAddHotspot = useCallback((e) => {
        if (!e?.data) return;

        const newHotspot = {
            // Don't assign a temp ID here - let the database generate it
            pitch: Number(e.data.pitch) || 0,
            yaw: Number(e.data.yaw) || 0,
            text: "Hotspot Baru",
            description: "Deskripsi di sini",
            targetPanoramaId: null,
        };

        setFormData(prev => ({
            ...prev,
            hotspots: [...prev.hotspots, newHotspot]
        }));
        setActiveHotspot(newHotspot);
        setShowHotspotModal(true);
    }, []);

    const handleAddHotspotButton = useCallback(() => {
        if (!pannellumRef.current || !formData.gambar_panorama) {
            alert('Harap unggah dan pilih gambar panorama terlebih dahulu');
            return;
        }

        try {
            // Directly use the viewer instance stored in the ref
            const viewer = pannellumRef.current;
            if (!viewer) {
                console.error("Viewer tidak terinisialisasi");
                return;
            }

            const newHotspot = {
                pitch: Number(viewer.getPitch()) || 0,
                yaw: Number(viewer.getYaw()) || 0,
                text: "Hotspot Baru",
                description: "Deskripsi di sini",
                targetPanoramaId: null,
            };

            setFormData(prev => ({
                ...prev,
                hotspots: [...prev.hotspots, newHotspot]
            }));
            setActiveHotspot(newHotspot);
            setShowHotspotModal(true);

            viewer.lookAt(newHotspot.yaw, newHotspot.pitch, 1000);
        } catch (error) {
            console.error("Error mendapatkan posisi viewer:", error);
            setUploadError("Gagal menambahkan hotspot. Silakan coba lagi.");
        }
    }, [formData.gambar_panorama]);

    // In your handleSaveHotspot function
    const handleSaveHotspot = useCallback(debounce(async (updatedHotspot) => {
        try {
            setIsSavingHotspot(true);

            // Validate required fields
            if (!updatedHotspot.text || !updatedHotspot.pitch || !updatedHotspot.yaw) {
                throw new Error("Harap isi semua field yang wajib diisi");
            }

            if (!selectedPanorama) {
                throw new Error("Tidak ada panorama yang dipilih");
            }

            // Check if we're working with a temporary panorama
            const isTempPanorama = selectedPanorama.id.toString().startsWith('temp-');

            // Prepare hotspot data
            const hotspotData = {
                pitch: updatedHotspot.pitch,
                yaw: updatedHotspot.yaw,
                text: updatedHotspot.text,
                description: updatedHotspot.description || '',
                targetPanoramaId: updatedHotspot.targetPanoramaId || null
            };

            let savedHotspot;
            let panoramaId = selectedPanorama.id;

            // If panorama is temporary, save it first to get a real ID
            if (isTempPanorama) {
                const payload = new FormData();
                payload.append('nama_ruangan', formData.nama_ruangan);
                if (selectedFile) payload.append('gambar_panorama', selectedFile);

                const panoramaResponse = await VirtualTourService.createVirtualTour(payload);
                panoramaId = panoramaResponse.data.id;
                setSelectedPanorama(panoramaResponse.data);
            }

            // Save the hotspot
            const response = await VirtualTourService.createHotspot(
                panoramaId,
                hotspotData
            );

            savedHotspot = {
                ...updatedHotspot,
                id: response.data.id // Use the real ID from database
            };

            // Update state
            setFormData(prev => ({
                ...prev,
                hotspots: prev.hotspots.map(h =>
                    (h === activeHotspot || h.id === activeHotspot?.id) ? savedHotspot : h
                )
            }));

            setActiveHotspot(savedHotspot);
            setShowHotspotModal(false);

            // Refresh panorama list if we created a new panorama
            if (isTempPanorama) {
                await loadPanoramas();
            }
        } catch (error) {
            console.error("Gagal menyimpan hotspot:", error);
            setUploadError(error.message || "Gagal menyimpan hotspot");
        } finally {
            setIsSavingHotspot(false);
        }
    }, 300), [selectedPanorama, formData, selectedFile, activeHotspot, loadPanoramas]);


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
                                        pannellumRef={pannellumRef}
                                        image={formData.gambar_panorama}
                                        hotspots={formData.hotspots}
                                        editMode={editMode}
                                        onAddHotspot={handleAddHotspot}
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
                                        {selectedPanorama ? 'Edit Panorama' : 'Buat Panorama Baru'}
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

                                            {previewUrl && (
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
                                            )}
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
                                                                    pannellumRef.current.getViewer().lookAt(
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
                                            hotspots={formData.hotspots}
                                            editMode={editMode}
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
                        pannellumRef={pannellumRef}
                        image={formData.gambar_panorama}
                        hotspots={formData.hotspots}
                        editMode={editMode}
                        onAddHotspot={handleAddHotspot}
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
            />

            <SaveModal />
        </div>
    );
};

export default ManageVirtualTourPage;