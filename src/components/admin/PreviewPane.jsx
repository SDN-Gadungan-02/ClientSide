import React, { useEffect, useRef, useState } from 'react';
import 'pannellum/src/js/pannellum';
import 'pannellum/src/css/pannellum.css';

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
    const [activeHotspotId, setActiveHotspotId] = useState(null);

    // Get hotspot icon based on type
    const addHotspot = (hotspot) => {
        if (!viewerInstance.current) return;

        const { id, pitch, yaw, text, targetPanoramaId } = hotspot;

        try {
            viewerInstance.current.addHotSpot({
                id: id || `hotspot-${Math.random().toString(36).substr(2, 9)}`,
                pitch: parseFloat(pitch),
                yaw: parseFloat(yaw),
                cssClass: 'custom-hotspot',
                text: text,
                createTooltipFunc: function (hotSpotDiv, args) {
                    // Create container for hotspot
                    const container = document.createElement('div');
                    container.className = 'hotspot-container';

                    // Create marker element
                    const marker = document.createElement('div');
                    marker.className = 'hotspot-marker';

                    // Create tooltip element
                    const tooltip = document.createElement('div');
                    tooltip.className = 'hotspot-tooltip';
                    tooltip.textContent = args.text;

                    // Style the marker
                    Object.assign(marker.style, {
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: targetPanoramaId ? '#3b82f6' : '#f59e0b',
                        border: '2px solid white',
                        position: 'relative',
                        cursor: 'pointer'
                    });

                    // Style the tooltip
                    Object.assign(tooltip.style, {
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: '10',
                        fontSize: '14px',
                        marginBottom: '5px',
                        display: showHotspotLabels ? 'block' : 'none'
                    });

                    // Add elements to container
                    container.appendChild(tooltip);
                    container.appendChild(marker);
                    hotSpotDiv.appendChild(container);

                    // Style the container
                    Object.assign(hotSpotDiv.style, {
                        width: '20px',
                        height: '20px',
                        pointerEvents: 'auto'
                    });
                },
                clickHandlerFunc: editMode ? (event) => {
                    if (onAddHotspot) {
                        onAddHotspot({
                            data: {
                                pitch: parseFloat(pitch),
                                yaw: parseFloat(yaw)
                            }
                        });
                    }
                } : (event, hotspot) => {
                    // Find the hotspot data
                    const hotspotData = hotspots.find(h => h.id === hotspot.id);

                    if (hotspotData?.targetPanoramaId) {
                        const targetPanorama = panoramas.find(p => p.id === hotspotData.targetPanoramaId);
                        if (targetPanorama && onSelectPanorama) {
                            onSelectPanorama(targetPanorama);
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error adding hotspot:', error);
        }

    };

    // Add all hotspots
    const addAllHotspots = () => {
        if (!isViewerReady || !viewerInstance.current) return;

        // Remove existing hotspots
        const config = viewerInstance.current.getConfig();
        if (config.hotSpots) {
            config.hotSpots.forEach(hotspot => {
                try {
                    viewerInstance.current.removeHotSpot(hotspot.id);
                } catch (error) {
                    console.error('Error removing hotspot:', error);
                }
            });
        }

        // Add new hotspots
        hotspots.forEach(hotspot => addHotspot(hotspot));
    };

    useEffect(() => {
        if (!containerRef.current || !image) return;

        // Hancurkan viewer sebelumnya jika ada
        if (pannellumRef.current) {
            try {
                pannellumRef.current.destroy();
            } catch (e) {
                console.error("Error destroying previous viewer:", e);
            }
        }

        // Inisialisasi viewer baru
        const viewer = window.pannellum.viewer(containerRef.current, {
            type: "equirectangular",
            panorama: image,
            autoLoad: true,
            showControls: true,
            hotSpotDebug: false,
            onLoad: () => {
                console.log('Panorama loaded successfully');
                setIsViewerReady(true);
                addAllHotspots();
            },
            onError: (err) => {
                console.error('Pannellum error:', err);
                setIsViewerReady(false);
            }
        });

        pannellumRef.current = viewer;

        return () => {
            if (viewer) viewer.destroy();
        };
    }, [image]);

    useEffect(() => {
        if (isViewerReady) {
            addAllHotspots();
        }
    }, [isViewerReady, hotspots, activeHotspotId]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default PreviewPane;