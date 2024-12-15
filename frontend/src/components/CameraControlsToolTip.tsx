import React, { useState } from 'react';

export function GlobalCameraControlsTooltip() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="absolute top-4 left-4 z-10">
            <div className="relative inline-block">
                {/* Make a (?) icon */}
                <button
                className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 text-sm font-bold"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                >
                ?
                </button>
                
                {isVisible && (
                    // Tooltip description
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white border-2 border-black p-4 shadow-lg">
                        <div className="text-sm">
                            <p className="font-bold mb-2">Navigation Controls:</p>
                            <ul className="space-y-1">
                                <li>• Left Click + Drag: Rotate view</li>
                                <li>• Right Click + Drag: Pan camera</li>
                                <li>• Scroll Wheel: Zoom in/out</li>
                            </ul>
                            <div className="mt-3 pt-3 border-t-2 border-black">
                                <p>Click any point to see its nearest neighbors</p>
                            </div>
                        </div>

                        {/* Arrow pointing up */}
                        <div className="absolute -top-2 left-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black"></div>
                        <div className="absolute -top-[7px] left-[17px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export function LocalCameraControlsTooltip() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="absolute top-4 left-4 z-10">
            <div className="relative inline-block">
                {/* Make a (?) icon */}
                <button
                className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 text-sm font-bold"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                >
                ?
                </button>
                
                {isVisible && (
                    // Tooltip description
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white border-2 border-black p-4 shadow-lg">
                        <div className="text-sm">
                            <p className="font-bold mb-2">Navigation Controls:</p>
                            <ul className="space-y-1">
                                <li>• Right Click + Drag: Pan camera</li>
                                <li>• Scroll Wheel: Zoom in/out</li>
                            </ul>
                            <div className="mt-3 pt-3 border-t-2 border-black">
                                <p>Click any point to update Selected Point view</p>
                            </div>
                        </div>

                        {/* Arrow pointing up */}
                        <div className="absolute -top-2 left-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black"></div>
                        <div className="absolute -top-[7px] left-[17px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

