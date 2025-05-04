import React, { useState } from 'react';
import { Pannellum } from 'pannellum-react';
import { Typography, Card, CardBody } from "@material-tailwind/react";

const VirtualTourPage = () => {
    const [currentScene, setCurrentScene] = useState(0);

    const tourSpots = [
        {
            id: 1,
            name: "Ruang Kelas",
            image: "https://pannellum.org/images/alma.jpg",
            config: {
                yaw: 180,
                pitch: 10,
                hfov: 110
            }
        },
        {
            id: 2,
            name: "Kantor",
            image: "https://pannellum.org/images/cerro-toco-0.jpg",
            config: {
                yaw: 120,
                pitch: 5,
                hfov: 100
            }
        },
        {
            id: 3,
            name: "Perpustakaan",
            image: "https://pannellum.org/images/cerro-toco-0.jpg",
            config: {
                yaw: 200,
                pitch: 0,
                hfov: 120
            }
        }
    ];

    const handleThumbnailClick = (index) => {
        setCurrentScene(index);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                {/* Panorama Viewer */}
                <div className="mb-6">
                    <Card className="shadow-lg">
                        <CardBody className="p-0">
                            <div className="w-full h-[500px] rounded-lg overflow-hidden">
                                <Pannellum
                                    width="100%"
                                    height="500px"
                                    image={tourSpots[currentScene].image}
                                    pitch={tourSpots[currentScene].config.pitch}
                                    yaw={tourSpots[currentScene].config.yaw}
                                    hfov={tourSpots[currentScene].config.hfov}
                                    autoLoad
                                    showZoomCtrl
                                    showFullscreenCtrl
                                    onLoad={() => {
                                        console.log("Panorama loaded");
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {tourSpots.map((spot, index) => (
                        <Card
                            key={spot.id}
                            className={`cursor-pointer transition-all ${currentScene === index
                                ? 'ring-2 ring-blue-500 scale-105'
                                : 'hover:shadow-md'
                                }`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <CardBody className="p-2 flex flex-col items-center">
                                <div className="w-full h-20 mb-1 rounded-md overflow-hidden bg-gray-200">
                                    <img
                                        src={spot.image}
                                        alt={spot.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150';
                                            e.target.alt = 'Gambar tidak tersedia';
                                        }}
                                    />
                                </div>
                                <Typography variant="ll" className="text-center font-medium">
                                    {spot.name}
                                </Typography>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VirtualTourPage;