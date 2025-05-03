'use client';

import { useEffect, useRef } from 'react';
import { useAnalyser } from './useAnalyser';
import { useAudio } from '@/components/audio/AudioContext';

export type VisualizerMode =
  | 'bars'
  | 'circle'
  | 'wave'
  | 'ecg'
  | 'trippy'
  | 'electric'
  | 'metallic'
  | 'fire'
  | 'disco'
  | 'crt'
  | 'holographic'
  | 'liquid';

export const allVisualizerModes: VisualizerMode[] = [
  'bars',
  'circle',
  'wave',
  'ecg',
  'trippy',
  'electric',
  'metallic',
  'fire',
  'disco',
  'crt',
  'holographic',
  'liquid',
];

export default function Visualizer({ mode = 'bars' }: { mode?: VisualizerMode }) {
  const { audioRef } = useAudio();
  const analyser = useAnalyser();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current || !ctx || !analyser) return;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (mode) {
        case 'bars':
          drawBars(ctx, dataArray, canvas, bufferLength);
          break;
        case 'circle':
          drawCircle(ctx, dataArray, canvas, bufferLength);
          break;
        case 'wave':
          drawWave(ctx, dataArray, canvas, bufferLength);
          break;
        case 'ecg':
          drawECG(ctx, dataArray, canvas, bufferLength);
          break;
        case 'trippy':
          drawTrippy(ctx, dataArray, canvas, bufferLength);
          break;
        case 'electric':
          drawElectric(ctx, dataArray, canvas, bufferLength);
          break;
        case 'metallic':
          drawMetallic(ctx, dataArray, canvas, bufferLength);
          break;
        case 'fire':
          drawFire(ctx, dataArray, canvas, bufferLength);
          break;
        case 'disco':
          drawDisco(ctx, dataArray, canvas, bufferLength);
          break;
        case 'crt':
          drawCRT(ctx, dataArray, canvas);
          break;
        case 'holographic':
          drawHolographic(ctx, dataArray, canvas, bufferLength);
          break;
        case 'liquid':
          drawLiquid(ctx, dataArray, canvas, bufferLength);
          break;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, mode]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
    </div>
  );
}

// === DRAW FUNCTIONS ===

function drawBars(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const barWidth = (canvas.width / length) * 2.5;
  let x = 0;
  for (let i = 0; i < length; i++) {
    const height = data[i];
    ctx.fillStyle = `rgb(${height + 100}, ${150 * (i / length)}, 180)`;
    ctx.fillRect(x, canvas.height - height, barWidth, height);
    x += barWidth + 1;
  }
}

function drawCircle(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 80;
  ctx.beginPath();
  for (let i = 0; i < length; i++) {
    const value = Math.pow(data[i] / 255, 1.5);
    const angle = (i / length) * Math.PI * 2;
    const x = cx + Math.cos(angle) * (radius + value * 150);
    const y = cy + Math.sin(angle) * (radius + value * 150);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = 'aqua';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawWave(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const { width, height } = canvas;
  const sliceWidth = width / (length - 1);
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let i = 0; i < length; i++) {
    const v = Math.pow(data[i] / 255, 1.5);
    const y = height - v * height;
    ctx.lineTo(i * sliceWidth, y);
  }
  ctx.lineTo(width, height);
  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawECG(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const { width, height } = canvas;
  const sliceWidth = width / length;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  for (let i = 0; i < length; i++) {
    const v = Math.pow(data[i] / 255, 1.5);
    const y = height / 2 + Math.sin(i * 0.5) * v * 60;
    ctx.lineTo(i * sliceWidth, y);
  }
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTrippy(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  ctx.beginPath();
  for (let i = 0; i < length; i++) {
    const angle = (i / length) * 2 * Math.PI;
    const radius = Math.pow(data[i] / 255, 1.7) * 200;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = `hsl(${Date.now() % 360}, 100%, 60%)`;
  ctx.stroke();
}

function drawElectric(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  for (let i = 0; i < length; i++) {
    const y = canvas.height / 2 + (Math.random() - 0.5) * Math.pow(data[i], 1.3) * 0.1;
    ctx.lineTo((i / length) * canvas.width, y);
  }
  ctx.strokeStyle = `rgb(${data[0]},${data[32] || 100},255)`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawMetallic(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const avg = data.reduce((a, b) => a + b) / length;
  ctx.fillStyle = `rgb(${avg + 100}, ${avg + 100}, ${avg + 100})`;
  ctx.fillRect(0, canvas.height / 2 - avg / 2, canvas.width, avg);
}

function drawFire(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  for (let i = 0; i < length; i++) {
    const height = Math.pow(data[i], 1.2) * 0.5;
    const flameWidth = canvas.width / length;
    ctx.beginPath();
    ctx.moveTo(i * flameWidth, canvas.height);
    ctx.lineTo(i * flameWidth + flameWidth / 2, canvas.height - height);
    ctx.lineTo(i * flameWidth + flameWidth, canvas.height);
    ctx.closePath();
    ctx.fillStyle = `rgb(255, ${50 + height / 3}, 0)`;
    ctx.fill();
  }
}

function drawDisco(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const energy = data.reduce((a, b) => a + b) / length;
  const radius = energy / 2;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  ctx.fillStyle = `hsl(${energy % 360}, 100%, 50%)`;
  ctx.fill();
}

function drawCRT(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) {
  ctx.fillStyle = '#001100';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.height; i += 2) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
  const pulse = data[0] / 255;
  ctx.globalAlpha = 0.1 + pulse * 0.4;
  ctx.fillStyle = '#0f0';
  ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
  ctx.globalAlpha = 1;
}

function drawHolographic(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  for (let i = 0; i < 20; i++) {
    const x = centerX + (Math.random() - 0.5) * data[i] * 2;
    const y = centerY + (Math.random() - 0.5) * data[i] * 2;
    ctx.strokeStyle = `rgba(0,255,255,${Math.random() * 0.7 + 0.2})`;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function drawLiquid(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = data[i] / 6;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${data[i]}, ${data[i + 10]}, 255, 0.2)`;
    ctx.fill();
  }
}
