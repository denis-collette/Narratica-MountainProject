'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Visualizer styles
const VisualizerA = () => <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 animate-pulse" />;
const VisualizerB = () => <div className="w-full h-full bg-gradient-to-tr from-pink-400 to-purple-600 animate-spin-slow" />;
const VisualizerC = () => <div className="w-full h-full bg-gradient-to-tl from-yellow-400 to-red-500 animate-bounce" />;

export const visualizers = [VisualizerA, VisualizerB, VisualizerC];

type VisualizerContextType = {
    visualizerIndex: number;
    setVisualizerIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const VisualizerContext = createContext<VisualizerContextType>({
    visualizerIndex: 0,
    setVisualizerIndex: () => {},
});

export const VisualizerProvider = ({ children }: { children: ReactNode }) => {
    const [visualizerIndex, setVisualizerIndex] = useState(0);

    return (
        <VisualizerContext.Provider value={{ visualizerIndex, setVisualizerIndex }}>
            {children}
        </VisualizerContext.Provider>
    );
};
