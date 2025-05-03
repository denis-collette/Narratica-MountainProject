'use client';

import { useState } from 'react';
import { GiSwirlString } from 'react-icons/gi';
import Visualizer, { allVisualizerModes as modes } from './Visualizer';

export default function SafeZonePage() {
    const [modeIndex, setModeIndex] = useState(0);

    const handleNext = () => setModeIndex((prev) => (prev + 1) % modes.length);
    const handlePrev = () => setModeIndex((prev) => (prev - 1 + modes.length) % modes.length);
    const handleRandom = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * modes.length);
        } while (randomIndex === modeIndex);
        setModeIndex(randomIndex);
    };

    const aura = 'before:absolute before:inset-0 before:rounded-full before:bg-pink-500/30 before:blur-2xl before:animate-pulse before:opacity-90 before:content-[""]';
    const baseBtn = `relative z-50 p-4 rounded-full shadow-md backdrop-blur drop-shadow-[0_0_15px_#ff00ff] hover:scale-110 transition-all duration-300 ${aura} hover:drop-shadow-[0_0_10px_#fff,0_0_20px_#f0f,0_0_30px_#0ff]`;

    return (
        <div className="fixed inset-0 bg-black z-0 overflow-hidden animate-[hue-rotate_60s_linear_infinite]">
            <Visualizer mode={modes[modeIndex]} />

            {/* Glowing Visualizer Name */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
                <div className="px-6 py-2 text-pink-200 text-xl font-bold rounded-full shadow-xl bg-pink-500/20 backdrop-blur-md animate-pulse drop-shadow-[0_0_12px_#f0f]">
                    {modes[modeIndex].toUpperCase()}
                </div>
            </div>

            {/* Left Arrow */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-50">
                <button
                    onClick={handlePrev}
                    title={`Previous: ${modes[(modeIndex - 1 + modes.length) % modes.length]}`}
                    className={`text-pink-300 text-5xl ${baseBtn}`}
                >
                    <GiSwirlString className="-scale-x-100 animate-[spin_40s_linear_infinite]" />
                </button>
            </div>

            {/* Right Arrow */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-50">
                <button
                    onClick={handleNext}
                    title={`Next: ${modes[(modeIndex + 1) % modes.length]}`}
                    className={`text-pink-300 text-5xl ${baseBtn}`}
                >
                    <GiSwirlString className="animate-[spin_40s_linear_infinite]" />
                </button>
            </div>

            {/* Mushroom Button */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20 z-50">
                <button
                    onClick={handleRandom}
                    title={`Trip harder!`}
                    className={`text-3xl ${baseBtn}`}
                >
                    <span className="inline-block animate-[spin_40s_linear_infinite]">🍄</span>
                </button>
            </div>
        </div>
    );
}
