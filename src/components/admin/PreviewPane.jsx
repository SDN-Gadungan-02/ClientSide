import React, { useEffect, useRef, useState } from 'react';
import 'pannellum/src/js/pannellum';

const PreviewPane = ({
    pannellumRef,
    image,
    hotspots = [],
    editMode = false,
    onAddHotspot,
    panoramas = [],
    onSelectPanorama,
    showHotspotLabels = true
}) => {
    const containerRef = useRef(null);
    const viewerInstance = useRef(null);
    const [isViewerReady, setIsViewerReady] = useState(false);
    const [currentView, setCurrentView] = useState({ pitch: 0, yaw: 0, hfov: 100 });
    const [localHotspots, setLocalHotspots] = useState(hotspots);



    // Sync localHotspots with props
    useEffect(() => {
        setLocalHotspots(hotspots);
    }, [hotspots]);

    useEffect(() => {
        const styleId = 'pannellum-hotspot-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .custom-hotspot {
                width: 30px;
                height: 30px;
                pointer-events: auto;
                transform: translate(-50%, -50%);
            }
            
            .hotspot-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                pointer-events: none;
            }
            
            .hotspot-dot {
                width: 12px;
                height: 12px;
                background-color: green;
                border-radius: 50%;
                pointer-events: auto;
            }
            
            .hotspot-label {
                position: absolute;
                top: 100%;
                margin-top: 5px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s;
                pointer-events: none;
            }
            
            .hotspot-container:hover .hotspot-label {
                opacity: 1;
            }
            
            /* HIDE DEFAULT PANNELLUM CONTROLS */
            .pnlm-controls-container {
                display: none !important;
            }
            

        `;
        document.head.appendChild(style);

        return () => document.getElementById(styleId)?.remove();
    }, []);

    // Update current view when viewer is ready
    const updateCurrentView = () => {
        if (viewerInstance.current) {
            setCurrentView({
                pitch: parseFloat(viewerInstance.current.getPitch().toFixed(6)),
                yaw: parseFloat(viewerInstance.current.getYaw().toFixed(6)),
                hfov: viewerInstance.current.getHfov()
            });
        }
    };

    useEffect(() => {
        if (viewerInstance.current) {
            const interval = setInterval(updateCurrentView, 100);
            return () => clearInterval(interval);
        }
    }, []);

    const handleAddHotspotButton = () => {
        if (!viewerInstance.current || !editMode) {
            console.error("Viewer not ready or not in edit mode");
            return;
        }

        const pitch = parseFloat(viewerInstance.current.getPitch().toFixed(6));
        const yaw = parseFloat(viewerInstance.current.getYaw().toFixed(6));

        const newHotspot = {
            id: `hotspot-${Date.now()}`,
            pitch,
            yaw,
            text: `Hotspot ${localHotspots.length + 1}`,
            targetPanoramaId: null
        };

        // Perbarui state
        setLocalHotspots(prev => [...prev, newHotspot]);

        // Langsung tambahkan ke viewer
        viewerInstance.current.addHotSpot({
            id: newHotspot.id,
            pitch: newHotspot.pitch,
            yaw: newHotspot.yaw,
            cssClass: 'custom-hotspot',
            createTooltipFunc: (hotSpotDiv) => {
                hotSpotDiv.innerHTML = '';
                const container = document.createElement('div');
                container.className = 'hotspot-container';

                const dot = document.createElement('div');
                dot.className = 'hotspot-dot';

                const label = document.createElement('div');
                label.className = 'hotspot-label';
                label.textContent = newHotspot.text;

                container.appendChild(dot);
                if (showHotspotLabels) {
                    container.appendChild(label);
                }
                hotSpotDiv.appendChild(container);
            }
        });

        if (onAddHotspot) onAddHotspot(newHotspot);
    };

    // Function to update hotspots in the viewer
    const updateHotspotsInViewer = () => {
        if (!viewerInstance.current) return;

        console.log("Updating hotspots in viewer:", hotspots); // Debugging log

        try {
            // Hapus semua hotspot yang ada
            const currentHotspots = viewerInstance.current.getConfig().hotSpots || [];
            currentHotspots.forEach(hotspot => {
                viewerInstance.current.removeHotSpot(hotspot.id);
            });

            // Tambahkan hotspot baru
            hotspots.forEach(hotspot => {
                viewerInstance.current.addHotSpot({
                    id: hotspot.id,
                    pitch: parseFloat(hotspot.pitch),
                    yaw: parseFloat(hotspot.yaw),
                    cssClass: 'custom-hotspot',
                    createTooltipFunc: (hotSpotDiv) => {
                        hotSpotDiv.innerHTML = '';
                        const container = document.createElement('div');
                        container.className = 'hotspot-container';

                        const dot = document.createElement('div');
                        dot.className = 'hotspot-dot';

                        const label = document.createElement('div');
                        label.className = 'hotspot-label';
                        label.textContent = hotspot.text || 'Hotspot';

                        container.appendChild(dot);
                        if (showHotspotLabels) {
                            container.appendChild(label);
                        }
                        hotSpotDiv.appendChild(container);

                        // Navigasi ke panorama tujuan jika targetPanoramaId ada
                        if (hotspot.targetPanoramaId) {
                            hotSpotDiv.addEventListener('click', (e) => {
                                e.stopPropagation();
                                const targetPanorama = panoramas.find(p => p.id === hotspot.targetPanoramaId);
                                if (targetPanorama && onSelectPanorama) {
                                    onSelectPanorama(targetPanorama);
                                }
                            });
                        }
                    }
                });
            });
        } catch (e) {
            console.error('Error updating hotspots:', e);
        }




        if (editMode && viewerInstance.current) {
            try {
                viewerInstance.current.addHotSpot({
                    id: 'center-pointer',
                    pitch: currentView.pitch,
                    yaw: currentView.yaw,
                    cssClass: 'center-pointer',

                });
            } catch (e) {
                console.error("Error adding center pointer hotspot:", e);
            }
        }
    };

    // Initialize and update viewer
    useEffect(() => {
        if (!containerRef.current || !image) return;

        const initViewer = () => {
            if (viewerInstance.current) {
                viewerInstance.current.destroy();
            }

            const viewer = window.pannellum.viewer(containerRef.current, {
                type: "equirectangular",
                panorama: image,
                autoLoad: true,
                showControls: false, // Matikan controls bawaan
                hotSpotDebug: false,
                mouseZoom: true,
                passive: true,
                onLoad: () => {
                    setIsViewerReady(true);
                    updateCurrentView();
                    updateHotspotsInViewer(hotspots);
                },
                onError: (error) => {
                    console.error('Viewer error:', error);
                }
            });

            viewerInstance.current = viewer;
            pannellumRef.current = viewer;
        };

        initViewer();

        return () => {
            if (viewerInstance.current) {
                viewerInstance.current.destroy();
            }
        };
    }, [image]);

    // Update hotspots when they change
    useEffect(() => {
        if (isViewerReady) {
            updateHotspotsInViewer();
        }
    }, [isViewerReady, localHotspots, editMode, currentView, hotspots]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div
                ref={containerRef}
                style={{ width: "100%", height: "100%" }}
            ></div>

            {editMode && (
                <button
                    onClick={handleAddHotspotButton}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#3182ce",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        fontSize: "20px",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.8
                    }}
                    title="Tambah Hotspot"
                >
                    +
                </button>
            )}
        </div>
    );
};

export default PreviewPane;