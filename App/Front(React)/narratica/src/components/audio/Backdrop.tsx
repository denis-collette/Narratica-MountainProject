import React, { useEffect } from "react";

interface BackdropProps {
  activeColor: string;
  trackIndex: number;
  isPlaying: boolean;
}

const Backdrop: React.FC<BackdropProps> = ({ activeColor, trackIndex, isPlaying }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--active-color", activeColor);
  }, [trackIndex, activeColor]);

  return <div className={`color-backdrop ${isPlaying ? "playing" : "idle"}`} />;
};

export default Backdrop;