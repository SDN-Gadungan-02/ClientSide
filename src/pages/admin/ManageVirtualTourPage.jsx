import React, { useState, useEffect, useRef } from 'react';
import { Pannellum } from 'pannellum-react';
import {
    Card, CardBody, Typography, Button, Input, Dialog,
    DialogHeader, DialogBody, DialogFooter, Chip, Select, Option,
    IconButton, Tooltip
} from "@material-tailwind/react";
import {
    PencilIcon, TrashIcon, PlusIcon, EyeIcon,
    CheckIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon,
    PhotoIcon
} from "@heroicons/react/24/solid";
import VirtualTourService from '../../services/virtualtourService';

const ManageVirtualTourPage = () => {
    // State management
    const [panoramas, setPanoramas] = useState([]);
    const [selectedPanorama, setSelectedPanorama] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const [formData, setFormData] = useState({
        nama_ruangan: '',
        gambar_panorama: '',
        hotspots: []
    });

    const [activeHotspot, setActiveHotspot] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const pannellumRef = useRef(null);

    // Load initial data
    useEffect(() => {
        loadPanoramas();
    }, []);

    // Service wrappers
    const loadPanoramas = async () => {
        try {
            const data = await VirtualTourService.getPanoramas();
            setPanoramas(data);
        } catch (error) {
            console.error("Failed to load panoramas:", error);
            setUploadError("Failed to load panoramas");
        }
    };

    const savePanorama = async (payload) => {
        return selectedPanorama?.id
            ? VirtualTourService.updatePanorama(selectedPanorama.id, payload)
            : VirtualTourService.createPanorama(payload);
    };

    // Handlers
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setFormData(prev => ({
                ...prev,
                gambar_panorama: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSelectPanorama = (panorama) => {
        setSelectedPanorama(panorama);
        setFormData({
            nama_ruangan: panorama.nama_ruangan,
            gambar_panorama: panorama.gambar_panorama,
            hotspots: panorama.hotspots || []
        });
        setPreviewMode(false);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleNewPanorama = () => {
        setSelectedPanorama(null);
        setFormData({
            nama_ruangan: '',
            gambar_panorama: '',
            hotspots: []
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setEditMode(true);
    };

    const handleAddHotspot = (e) => {
        if (!e?.data) return;

        const newHotspot = {
            pitch: e.data.pitch,
            yaw: e.data.yaw,
            type: "info",
            text: "Hotspot Baru",
            targetPanoramaId: null
        };

        setFormData(prev => ({
            ...prev,
            hotspots: [...prev.hotspots, newHotspot]
        }));
        setActiveHotspot(newHotspot);
    };

    const handleUpdateHotspot = (updated) => {
        setFormData(prev => ({
            ...prev,
            hotspots: prev.hotspots.map(h =>
                h === activeHotspot ? updated : h
            )
        }));
        setActiveHotspot(updated);
    };

    const handleDeleteHotspot = () => {
        setFormData(prev => ({
            ...prev,
            hotspots: prev.hotspots.filter(h => h !== activeHotspot)
        }));
        setActiveHotspot(null);
    };

    const handleSave = async () => {
        try {
            setIsUploading(true);
            setUploadError(null);

            const payload = new FormData();
            payload.append('nama_ruangan', formData.nama_ruangan);

            // Append each hotspot individually
            formData.hotspots.forEach((hotspot, index) => {
                payload.append(`hotspots[${index}][pitch]`, hotspot.pitch);
                payload.append(`hotspots[${index}][yaw]`, hotspot.yaw);
                payload.append(`hotspots[${index}][targetPanoramaId]`, hotspot.targetPanoramaId || '');
                payload.append(`hotspots[${index}][name]`, hotspot.name || '');
                payload.append(`hotspots[${index}][title]`, hotspot.title || '');
                payload.append(`hotspots[${index}][deskripsi]`, hotspot.deskripsi || '');
            });

            if (selectedFile) {
                payload.append('gambar_panorama', selectedFile);
            }

            const response = selectedPanorama?.id
                ? await VirtualTourService.updateVirtualTour(selectedPanorama.id, payload)
                : await VirtualTourService.createVirtualTour(payload);

            if (response.success) {
                loadPanoramas();
                setEditMode(false);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadError(error.response?.data?.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPanorama?.id) return;
        try {
            await VirtualTourService.deletePanorama(selectedPanorama.id);
            loadPanoramas();
            setSelectedPanorama(null);
        } catch (error) {
            console.error("Delete failed:", error);
            setUploadError("Failed to delete panorama");
        }
    };

    // Sub-components
    const HotspotForm = () => (
        <div className="space-y-4 p-4 border rounded-lg">
            <Typography variant="h6">Edit Hotspot</Typography>
            <Input
                label="Hotspot Text"
                value={activeHotspot?.text || ''}
                onChange={(e) => handleUpdateHotspot({
                    ...activeHotspot,
                    text: e.target.value
                })}
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    type="number"
                    label="Pitch"
                    value={activeHotspot?.pitch || 0}
                    onChange={(e) => handleUpdateHotspot({
                        ...activeHotspot,
                        pitch: parseFloat(e.target.value)
                    })}
                />
                <Input
                    type="number"
                    label="Yaw"
                    value={activeHotspot?.yaw || 0}
                    onChange={(e) => handleUpdateHotspot({
                        ...activeHotspot,
                        yaw: parseFloat(e.target.value)
                    })}
                />
            </div>
            <Select
                label="Hotspot Type"
                value={activeHotspot?.type || 'info'}
                onChange={(value) => handleUpdateHotspot({
                    ...activeHotspot,
                    type: value
                })}
            >
                <Option value="info">Info</Option>
                <Option value="scene">Navigation</Option>
            </Select>
            <Button
                color="red"
                variant="outlined"
                onClick={handleDeleteHotspot}
                fullWidth
            >
                Delete Hotspot
            </Button>
        </div>
    );

    const PreviewPane = () => (
        <div className="h-full border rounded-lg overflow-hidden relative">
            {formData.gambar_panorama ? (
                <>
                    <Pannellum
                        ref={pannellumRef}
                        width="100%"
                        height="100%"
                        image={formData.gambar_panorama}
                        autoLoad
                        showZoomCtrl={true}
                        hotSpots={formData.hotspots}
                        hotspotDebug={editMode}
                        onMouseDown={editMode ? handleAddHotspot : undefined}
                    />
                    {editMode && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
                            Click on image to add hotspot
                        </div>
                    )}
                </>
            ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                    <Typography>Upload panorama image for preview</Typography>
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <Typography variant="h2" className="text-2xl font-bold mb-6">
                Virtual Tour Manager
            </Typography>

            {uploadError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    {uploadError}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panorama List */}
                <Card className="lg:col-span-1">
                    <CardBody>
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h5">Panorama List</Typography>
                            <Button onClick={handleNewPanorama} size="sm" disabled={isUploading}>
                                <PlusIcon className="h-4 w-4 mr-1" /> New
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {panoramas.map(panorama => (
                                <Card
                                    key={panorama.id}
                                    onClick={() => !isUploading && handleSelectPanorama(panorama)}
                                    className={`cursor-pointer p-3 ${selectedPanorama?.id === panorama.id ? 'bg-blue-50' : ''}`}
                                >
                                    <Typography variant="h6">{panorama.nama_ruangan}</Typography>
                                    <Typography variant="small">
                                        {panorama.hotspots?.length || 0} Hotspots
                                    </Typography>
                                </Card>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Main Content Area */}
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
                                            <EyeIcon className="h-4 w-4 mr-1" /> Full Preview
                                        </Button>
                                    </div>
                                </div>
                                <div className="h-96">
                                    <PreviewPane />
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {editMode && (
                        <Card>
                            <CardBody>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h4">
                                        {selectedPanorama ? 'Edit Panorama' : 'Create New Panorama'}
                                    </Typography>
                                    <div className="flex gap-2">
                                        <Button variant="outlined" onClick={() => setEditMode(false)} disabled={isUploading}>
                                            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
                                        </Button>
                                        {selectedPanorama && (
                                            <Button color="red" onClick={handleDelete} disabled={isUploading}>
                                                <TrashIcon className="h-4 w-4 mr-1" /> Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Input
                                            label="Room Name"
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
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                            <label htmlFor="panorama-upload" className="cursor-pointer">
                                                <Button
                                                    variant="outlined"
                                                    color="blue"
                                                    fullWidth
                                                    className="flex items-center gap-2"
                                                    disabled={isUploading}
                                                >
                                                    <PhotoIcon className="h-5 w-5" />
                                                    Upload Panorama Image
                                                </Button>
                                            </label>

                                            {previewUrl && (
                                                <div className="mt-2">
                                                    <Typography variant="small" className="mb-1">
                                                        Preview:
                                                    </Typography>
                                                    <img
                                                        src={previewUrl}
                                                        alt="Panorama preview"
                                                        className="h-32 object-cover rounded-lg border"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <Typography variant="h6">
                                                    Hotspots ({formData.hotspots.length})
                                                </Typography>
                                                <Tooltip content="Click on image to add hotspot">
                                                    <IconButton variant="text" size="sm" disabled={isUploading}>
                                                        <PlusIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>

                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {formData.hotspots.map((hotspot, index) => (
                                                    <Chip
                                                        key={index}
                                                        value={`${hotspot.text || 'Hotspot'} (${hotspot.pitch.toFixed(1)}, ${hotspot.yaw.toFixed(1)})`}
                                                        color={activeHotspot === hotspot ? 'blue' : 'gray'}
                                                        onClick={() => !isUploading && setActiveHotspot(hotspot)}
                                                        className="cursor-pointer"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {activeHotspot && <HotspotForm />}
                                    </div>

                                    <div className="h-96">
                                        <PreviewPane />
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
                                        <XMarkIcon className="h-4 w-4 mr-1" /> Cancel
                                    </Button>
                                    <Button
                                        color="green"
                                        onClick={handleSave}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Saving...' : (
                                            <>
                                                <CheckIcon className="h-4 w-4 mr-1" /> Save
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>

            {/* Full Preview Modal */}
            <Dialog open={previewMode} handler={() => setPreviewMode(false)} size="xl">
                <DialogHeader>
                    Virtual Tour Preview - {selectedPanorama?.nama_ruangan}
                </DialogHeader>
                <DialogBody className="p-0 h-[70vh]">
                    <PreviewPane />
                </DialogBody>
                <DialogFooter>
                    <Button onClick={() => setPreviewMode(false)}>Close</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageVirtualTourPage;