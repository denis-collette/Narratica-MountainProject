'use client';

import { useEffect, useState, useRef } from 'react';
import { useAudio } from '@/components/audio/AudioContext';

let cachedSourceNode: MediaElementAudioSourceNode | null = null;
let connected = false;

export function useAnalyser() {
  const { audioRef, audioApiContext } = useAudio();
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const audioEl = audioRef.current;
    const audioCtx = audioApiContext;
    if (!audioEl || !audioCtx) return;

    if (!cachedSourceNode) {
      cachedSourceNode = audioCtx.createMediaElementSource(audioEl);
    }

    if (!analyserRef.current) {
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 256;
      cachedSourceNode.connect(analyserNode);
      analyserNode.connect(audioCtx.destination); // KEY PART
      analyserRef.current = analyserNode;
      setAnalyser(analyserNode);
      connected = true;
    } else {
      if (!connected) {
        // Make sure it's connected to destination (sound)
        analyserRef.current.connect(audioCtx.destination);
        connected = true;
      }
      setAnalyser(analyserRef.current);
    }

    return () => {
      // Don't disconnect the destination; just leave analyser in place
    };
  }, [audioRef, audioApiContext]);

  return analyser;
}
