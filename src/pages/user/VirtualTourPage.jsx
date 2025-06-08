import React, { useState, useEffect } from 'react';
import { Pannellum } from 'pannellum-react';
import { Typography, Card, CardBody, Spinner } from "@material-tailwind/react";
import VirtualTourService from '../../services/virtualTourService';
import { toast } from 'react-toastify';

const VirtualTourPage = () => {
    const [panoramas, setPanoramas] = useState([]);
    const [currentScene, setCurrentScene] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPanoramas = async () => {
            try {
                setLoading(true);
                const response = await VirtualTourService.getPanoramas();

                if (response.success) {
                    setPanoramas(response.data);
                    if (response.data.length > 0) {
                        setCurrentScene(0);
                    }
                } else {
                    setError(response.message || 'Failed to load panoramas');
                    toast.error(response.message || 'Failed to load panoramas');
                }
            } catch (err) {
                console.error('Error fetching panoramas:', err);
                setError('Failed to load virtual tour data');
                toast.error('Failed to load virtual tour data');
            } finally {
                setLoading(false);
            }
        };

        fetchPanoramas();
    }, []);

    const handleThumbnailClick = (index) => {
        setCurrentScene(index);
    };

    const handleHotspotClick = (hotspot) => {
        if (hotspot.targetPanoramaId) {
            const targetIndex = panoramas.findIndex(p => p.id === hotspot.targetPanoramaId);
            if (targetIndex !== -1) {
                setCurrentScene(targetIndex);
            } else {
                toast.warning('Target panorama not found');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <Typography variant="h4" color="red">
                    {error}
                </Typography>
            </div>
        );
    }

    if (panoramas.length === 0) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <Typography variant="h4">
                    No panoramas available
                </Typography>
            </div>
        );
    }

    const currentPanorama = panoramas[currentScene];

    return (
        <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                {/* Panorama Viewer */}
                <div className="mb-6">
                    <Card className="shadow-lg">
                        <CardBody className="p-0">
                            <div className="w-full h-[500px] rounded-lg overflow-hidden relative">
                                <Pannellum
                                    width="100%"
                                    height="500px"
                                    image={currentPanorama.gambar_panorama}
                                    pitch={0}
                                    yaw={180}
                                    hfov={110}
                                    autoLoad
                                    showZoomCtrl
                                    showFullscreenCtrl
                                    onLoad={() => {
                                        console.log("Panorama loaded");
                                    }}
                                >
                                    {currentPanorama.hotspots && currentPanorama.hotspots.map((hotspot, index) => (
                                        <Pannellum.Hotspot
                                            key={`${hotspot.id}-${index}`}
                                            pitch={hotspot.pitch}
                                            yaw={hotspot.yaw}
                                            type="info"
                                            text={hotspot.text}
                                            tooltip={hotspot.description}
                                            tooltipArg={hotspot}
                                            clickHandlerArg={hotspot}
                                            clickHandler={(hotspot) => handleHotspotClick(hotspot)}
                                        />
                                    ))}
                                </Pannellum>
                                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                                    <Typography variant="h6" className="text-white">
                                        {currentPanorama.name}
                                    </Typography>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {panoramas.map((panorama, index) => (
                        <Card
                            key={panorama.id}
                            className={`cursor-pointer transition-all ${currentScene === index
                                ? 'ring-2 ring-blue-500 scale-105'
                                : 'hover:shadow-md'
                                }`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <CardBody className="p-2 flex flex-col items-center">
                                <div className="w-full h-20 mb-1 rounded-md overflow-hidden bg-gray-200">
                                    <img
                                        src={panorama.gambar_panorama}
                                        alt={panorama.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150';
                                            e.target.alt = 'Gambar tidak tersedia';
                                        }}
                                    />
                                </div>
                                <Typography variant="small" className="text-center font-medium">
                                    {panorama.nama_ruangan}
                                </Typography>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Hotspot Information */}
                {currentPanorama.hotspots && currentPanorama.hotspots.length > 0 && (
                    <div className="mt-6">
                        <Card className="shadow-lg">
                            <CardBody>
                                <Typography variant="h5" className="mb-4">
                                    Navigation Points
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {currentPanorama.hotspots.map((hotspot, index) => (
                                        <div
                                            key={`hotspot-info-${index}`}
                                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleHotspotClick(hotspot)}
                                        >
                                            <Typography variant="h6" className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                                {hotspot.text}
                                            </Typography>
                                            {hotspot.description && (
                                                <Typography variant="small" className="text-gray-600 mt-1">
                                                    {hotspot.description}
                                                </Typography>
                                            )}
                                            {hotspot.targetPanoramaId && (
                                                <Typography variant="small" className="text-blue-500 mt-1">
                                                    Click to navigate
                                                </Typography>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VirtualTourPage;