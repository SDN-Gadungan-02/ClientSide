import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'pannellum/src/js/pannellum';

const PreviewPane = ({
    pannellumRef,
    image,
    hotspots = [],
    editMode = false,
    onAddHotspot,
    panoramas = [],
    onSelectPanorama,
    showHotspotLabels = true,
    activeHotspot
}) => {
    const containerRef = useRef(null);
    const viewerInstance = useRef(null);
    const [isViewerReady, setIsViewerReady] = useState(false);
    const [currentView, setCurrentView] = useState({ pitch: 0, yaw: 0, hfov: 100 });

    // Tambahkan style untuk hotspot
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

        .hotspot-dot {
            width: 12px;
            height: 12px;
            background-color: green !important;
            border-radius: 50%;
            pointer-events: auto;
            transition: all 0.2s ease;
        }

        .custom-hotspot.active .hotspot-dot {
            background-color: #3182ce !important;
            width: 16px;
            height: 16px;
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

    // Di bagian handleAddHotspotButton
    const handleAddHotspotButton = (e) => {
        e.stopPropagation(); // Penting untuk mencegah event bubbling
        if (!pannellumRef.current || !editMode || !onAddHotspot) {
            console.log('Cannot add hotspot:', {
                hasViewer: !!pannellumRef.current,
                editMode,
                hasCallback: !!onAddHotspot
            });
            return;
        }

        try {
            const pitch = parseFloat(pannellumRef.current.getPitch().toFixed(6));
            const yaw = parseFloat(pannellumRef.current.getYaw().toFixed(6));

            console.log('Adding hotspot at:', { pitch, yaw });
            onAddHotspot({ pitch, yaw });
        } catch (error) {
            console.error('Error getting viewer position:', error);
        }
    };

    // Di useEffect inisialisasi viewer
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
                showControls: false,
                hotSpotDebug: false,

                hotSpots: hotspots.map(hotspot => ({
                    id: hotspot.id || `hotspot-${hotspot.pitch}-${hotspot.yaw}`,
                    pitch: parseFloat(hotspot.pitch) || 0,
                    yaw: parseFloat(hotspot.yaw) || 0,
                    cssClass: `custom-hotspot ${activeHotspot?.id === hotspot.id ? 'active' : ''}`,
                    createTooltipFunc: (hotSpotDiv) => {
                        hotSpotDiv.innerHTML = '';
                        const container = document.createElement('div');
                        container.className = 'hotspot-container';
                        const dot = document.createElement('div');
                        dot.className = 'hotspot-dot';
                        container.appendChild(dot);
                        if (showHotspotLabels) {
                            const label = document.createElement('div');
                            label.className = 'hotspot-label';
                            label.textContent = hotspot.text || 'Hotspot';
                            container.appendChild(label);
                        }
                        hotSpotDiv.appendChild(container);
                    }
                })),
                onLoad: () => {
                    setIsViewerReady(true);
                    updateHotspotsInViewer();
                },
                onError: (error) => {
                    console.error('Viewer error:', error);
                }
            });

            viewerInstance.current = viewer;
            if (pannellumRef) {
                pannellumRef.current = viewer;
            }
        };

        const timer = setTimeout(initViewer, 100);
        return () => {
            clearTimeout(timer);
            if (viewerInstance.current) {
                viewerInstance.current.destroy();
            }
        };
    }, [image, pannellumRef]);

    // Di dalam updateHotspotsInViewer
    const updateHotspotsInViewer = useCallback(() => {
        if (!viewerInstanccxcurrent) return;

        try {
            // Hapus semua hotspot yang ada
            const currentHotspots = viewerInstance.current.getConfig().hotSpots || [];
            currentHotspots.forEach(hotspot => {
                viewerInstance.current.removeHotSpot(hotspot.id);
            });

            // Tambahkan hotspot baru
            hotspots.forEach(hotspot => {
                const pitch = parseFloat(hotspot.pitch) || 0;
                const yaw = parseFloat(hotspot.yaw) || 0;
                const hotspotId = hotspot.id || `hotspot-${pitch}-${yaw}-${Date.now()}`;

                viewerInstance.current.addHotSpot({
                    id: hotspotId,
                    pitch: pitch,
                    yaw: yaw,
                    cssClass: `custom-hotspot ${activeHotspot?.id === hotspot.id ? 'active' : ''}`,
                    createTooltipFunc: (hotSpotDiv) => {
                        // Bersihkan isi
                        hotSpotDiv.innerHTML = '';
                        // Container
                        const container = document.createElement('div');
                        container.className = 'hotspot-container';
                        // Dot
                        const dot = document.createElement('div');
                        dot.className = 'hotspot-dot';
                        container.appendChild(dot);
                        // Label
                        if (showHotspotLabels) {
                            const label = document.createElement('div');
                            label.className = 'hotspot-label';
                            label.textContent = hotspot.text || 'Hotspot';
                            container.appendChild(label);
                        }
                        hotSpotDiv.appendChild(container);

                        // Event click jika ada targetPanoramaId
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
    }, [hotspots, panoramas, onSelectPanorama, showHotspotLabels, activeHotspot]);


    // Update hotspots when they change
    useEffect(() => {
        if (isViewerReady) {
            updateHotspotsInViewer();
        }
    }, [isViewerReady, hotspots]);

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