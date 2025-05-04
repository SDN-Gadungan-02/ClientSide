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
    const getHotspotIcon = (type) => {
        switch (type) {
            case 'scene':
                return 'arrow-right';
            default:
                return 'info-circle';
        }
    };

    // Add a single hotspot
    const addHotspot = (hotspot) => {
        if (!viewerInstance.current) return;

        const { id, pitch, yaw, text, targetPanoramaId } = hotspot;

        try {
            viewerInstance.current.addHotSpot({
                id: id || `hotspot-${Math.random().toString(36).substr(2, 9)}`,
                pitch: parseFloat(pitch),
                yaw: parseFloat(yaw),
                type: "info",
                cssClass: `hotspot-${type} ${activeHotspotId === id ? 'active-hotspot' : ''}`,
                text: text,
                createTooltipFunc: function (hotSpotDiv, args) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'hotspot-tooltip';

                    // Create icon element
                    const icon = document.createElement('i');
                    icon.className = `fa fa-${getHotspotIcon(type)}`;
                    icon.style.marginRight = '5px';

                    // Create text element
                    const text = document.createElement('span');
                    text.textContent = args.text;

                    tooltip.appendChild(icon);
                    tooltip.appendChild(text);

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
                        display: 'flex',
                        alignItems: 'center'
                    });

                    hotSpotDiv.appendChild(tooltip);
                    hotSpotDiv.style.pointerEvents = 'auto';
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
                    // Toggle active hotspot
                    if (activeHotspotId === hotspot.id) {
                        setActiveHotspotId(null);
                        // Load target panorama if this is a scene hotspot
                        const targetPanorama = panoramas.find(p => p.id === targetPanoramaId);
                        if (targetPanorama && onSelectPanorama) {
                            onSelectPanorama(targetPanorama);
                        }
                    } else {
                        setActiveHotspotId(hotspot.id);
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

        // Destroy previous viewer if exists
        if (viewerInstance.current) {
            try {
                viewerInstance.current.destroy();
            } catch (e) {
                console.error("Error destroying previous viewer:", e);
            }
        }

        setIsViewerReady(false);

        // Create new viewer
        viewerInstance.current = window.pannellum.viewer(containerRef.current, {
            type: "equirectangular",
            panorama: image,
            autoLoad: true,
            showControls: false,
            hotSpotDebug: editMode,
            onLoad: () => {
                setIsViewerReady(true);
            }
        });

        // Save reference to viewer
        if (pannellumRef) {
            pannellumRef.current = viewerInstance.current;
        }

        return () => {
            if (viewerInstance.current) {
                try {
                    viewerInstance.current.destroy();
                } catch (e) {
                    console.error("Error cleaning up viewer:", e);
                }
            }
        };
    }, [image, editMode, pannellumRef]);

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