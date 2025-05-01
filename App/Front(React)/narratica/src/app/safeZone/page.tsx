'use client';

import React, { useEffect, useContext } from 'react';
import { VisualizerContext, visualizers } from './Visualizer';

export default function SecretVisualizer() {
    const { visualizerIndex, setVisualizerIndex } = useContext(VisualizerContext);
    const CurrentVisualizer = visualizers[visualizerIndex];

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleCycle = () => {
        setVisualizerIndex((prev) => (prev + 1) % visualizers.length);
    };

    return (
        <div className="fixed inset-0 bg-black text-green-400 overflow-hidden z-0">
            <CurrentVisualizer />

            <button
                onClick={handleCycle}
                title="Trip harder"
                className="absolute bottom-24 right-4 bg-green-700 hover:bg-green-500 text-black px-4 py-2 rounded-xl shadow-lg transition"
            >
                🍄
            </button>
        </div>
    );
}
