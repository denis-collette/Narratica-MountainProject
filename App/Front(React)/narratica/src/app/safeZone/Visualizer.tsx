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
  | 'fire'
  | 'holographic'
  | 'liquid'
  | 'tunnel';

export const allVisualizerModes: VisualizerMode[] = [
  'bars',
  'circle',
  'wave',
  'ecg',
  'trippy',
  'electric',
  'fire',
  'holographic',
  'liquid',
  'tunnel',
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

    const bufferLength = Math.floor(analyser.frequencyBinCount * 0.7);
    const dataArray = (new Uint8Array(bufferLength)).slice(0, bufferLength);

    const draw = () => {
      if (!canvasRef.current || !ctx || !analyser) return;

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (mode) {
        case 'bars':
          drawBars(ctx, dataArray, canvas, bufferLength);
          break;
        case 'circle':
          drawCircle(ctx, dataArray, canvas);
          break;
        case 'wave':
          drawWave(ctx, dataArray, canvas, bufferLength);
          break;
        case 'ecg':
          drawECG(ctx, dataArray, canvas, bufferLength);
          break;
        case 'trippy':
          drawTrippy(ctx, dataArray, canvas);
          break;
        case 'electric':
          drawElectric(ctx, dataArray, canvas, bufferLength);
          break;
        case 'fire':
          drawFire(ctx, dataArray, canvas, bufferLength);
          break;
        case 'holographic':
          drawHolographic(ctx, dataArray, canvas, bufferLength);
          break;
        case 'liquid':
          drawLiquid(ctx, dataArray, canvas, bufferLength);
          break;
        case 'tunnel':
          drawTunnel(ctx, dataArray, canvas);
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
  
  // Loop through the bars
  for (let i = 0; i < length; i++) {
    const height = data[i];

    // Trippy color palette: Using HSL to create a psychedelic color effect
    const hue = (i / length) * 360 + (Date.now() * 0.05 % 360); // Dynamic hue based on time
    const saturation = 100; // Full saturation for vibrant colors
    const lightness = 50; // Consistent lightness for rich, non-white colors

    // Set up the glow effect
    const glow = Math.min(30 + (height / 255) * 50, 70); // Glow intensity based on height

    // Set the fill color with HSL and apply the glow
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`; // Lighten the shadow for a glowing effect
    ctx.shadowBlur = glow;

    // Draw the bar with a glow effect
    ctx.fillRect(x, canvas.height - height, barWidth, height);
    
    // Reset shadow for next bar (optional for cleanliness)
    ctx.shadowBlur = 0;

    x += barWidth + 1;
  }
}

let smoothRadius = 100;
const trailCount = 6;
const trailDecay = 0.15;

function drawCircle(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const average = data.reduce((sum, value) => sum + value, 0) / data.length;
  const normalizedValue = average / 255;

  const minRadius = 60;
  const maxRadius = 160;
  const targetRadius = minRadius + (maxRadius - minRadius) * normalizedValue;

  // Smooth motion
  const smoothingFactor = 0.1;
  smoothRadius += (targetRadius - smoothRadius) * smoothingFactor;

  // Glow effect
  ctx.shadowColor = `hsl(${(Date.now() / 10) % 360}, 100%, 70%)`;
  ctx.shadowBlur = 40;

  // Draw fading trails
  for (let i = trailCount; i > 0; i--) {
    const trailRadius = smoothRadius - i * 8;
    const opacity = 1 - i * trailDecay;

    ctx.beginPath();
    ctx.arc(cx, cy, trailRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${(Date.now() / 10 + i * 10) % 360}, 100%, 60%, ${opacity})`;
    ctx.lineWidth = 2 + i * 0.5;
    ctx.stroke();
  }

  // Dashed main circle
  ctx.setLineDash([10, 6]);
  ctx.lineDashOffset = -Date.now() / 25;
  ctx.beginPath();
  ctx.arc(cx, cy, smoothRadius, 0, Math.PI * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = `hsl(${(Date.now() / 10) % 360}, 100%, 60%)`;
  ctx.stroke();

  // Reset dash so it doesn’t affect other drawings
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
}

function drawWave(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const { width, height } = canvas;
  const sliceWidth = width / (length - 1);
  ctx.beginPath();
  ctx.moveTo(0, height - 10);
  for (let i = 0; i < length; i++) {
    const v = Math.pow(data[i] / 255, 1.5);
    const y = height - v * (height * 0.8);
    ctx.lineTo(i * sliceWidth, y);
  }
  ctx.lineTo(width, height - 10);
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
    const y = height / 2 + Math.sin(i * 0.6) * v * 80;
    ctx.lineTo(i * sliceWidth, y);
  }
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTrippy(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) {
  const { width, height } = canvas;
  const time = Date.now() * 0.002;
  const stripeCount = 14;
  const centerY = height / 2;
  const sliceWidth = width / data.length;
  const average = data.reduce((sum, v) => sum + v, 0) / data.length;

  ctx.save(); // Save the state for rotation
  ctx.translate(width / 2, height / 2);
  ctx.rotate(Math.sin(time * 0.2) * 0.02); // subtle oscillating rotation
  ctx.translate(-width / 2, -height / 2);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `hsl(${(time * 20) % 360}, 100%, 10%)`);
  gradient.addColorStop(0.5, `hsl(${(time * 10 + 60) % 360}, 100%, 15%)`);
  gradient.addColorStop(1, `hsl(${(time * 10 + 120) % 360}, 100%, 10%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw wavy lines
  for (let i = 0; i < stripeCount; i++) {
    const phase = time + i * 0.8;
    const hue = (time * 20 + i * 30) % 360;
    const verticalOffset = (i - stripeCount / 2) * 30;

    ctx.beginPath();
    ctx.moveTo(0, centerY + verticalOffset);

    for (let x = 0; x < data.length; x++) {
      const t = x / data.length;
      const v = data[x] / 255;
      const boosted = v * (0.3 + Math.pow(t, 1.8)); // Boost right side
      const y =
        centerY +
        Math.sin(x * 0.05 + phase) * (50 + average * 0.25) * boosted +
        verticalOffset;
      ctx.lineTo(x * sliceWidth, y);
    }

    ctx.strokeStyle = `hsl(${hue}, 100%, ${60 + (average / 255) * 40}%)`;
    ctx.lineWidth = 3;
    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
    ctx.shadowBlur = 30 + (average / 255) * 40;
    ctx.stroke();
  }

  // Sparkles
  for (let i = 0; i < 40; i++) {
    const sparkleX = Math.random() * width;
    const sparkleY = Math.random() * height;
    const sparkleSize = Math.random() * 2;
    const sparkleAlpha = Math.random() * 0.4 + 0.1;
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
    ctx.fill();
  }

  // Occasional strobe
  if (average > 200 && Math.sin(time * 10) > 0.92) {
    ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore(); // Restore rotation state
  ctx.shadowBlur = 0;
}

function drawElectric(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  for (let i = 0; i < length; i++) {
    const offset = (Math.random() - 0.5) * data[i] * 0.4;
    const y = canvas.height / 2 + offset;
    ctx.lineTo((i / length) * canvas.width, y);
  }
  ctx.strokeStyle = `rgba(0, ${data[20]}, 255, 0.8)`;
  ctx.lineWidth = 2;
  ctx.stroke();
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

function drawHolographic(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  for (let i = 0; i < 10; i++) {
    const radius = data[i * 2] || 0;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + i * 15, 0, Math.PI * 2);
    ctx.strokeStyle = `hsl(${(Date.now() / 10 + i * 10) % 360}, 100%, 70%)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawLiquid(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, length: number) {
  ctx.fillStyle = 'rgba(0, 0, 50, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < length; i += 10) {
    const size = data[i] / 5;
    ctx.beginPath();
    ctx.arc((i / length) * canvas.width, canvas.height / 2 + Math.sin(Date.now() / 500 + i) * 30, size, 0, 2 * Math.PI);
    ctx.fillStyle = `hsla(${i * 3}, 100%, 70%, 0.8)`;
    ctx.fill();
  }
}

function drawTunnel(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) {
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const time = Date.now() * 0.0015;
  const average = data.reduce((sum, v, i) => (i < data.length * 0.7 ? sum + v : sum), 0) / (data.length * 0.7);
  const baseHue = (time * 40) % 360;

  // Clear background
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);
  ctx.translate(centerX, centerY);

  // Particle definition and pool (static per drawTunnel call)
  const particleCount = 120;
  const particles: {
    x: number;
    y: number;
    z: number;
    hueOffset: number;
  }[] = (drawTunnel as any)._particles ||= Array.from({ length: particleCount }, () => ({
    x: (Math.random() - 0.5) * width * 1.5,
    y: (Math.random() - 0.5) * height * 1.5,
    z: Math.random() * 300 + 100,
    hueOffset: Math.random() * 360,
  }));

  // Update & draw particles
  for (const p of particles) {
    p.z -= 1.5 + average * 0.05;
    if (p.z < 1) {
      p.x = (Math.random() - 0.5) * width * 1.5;
      p.y = (Math.random() - 0.5) * height * 1.5;
      p.z = 300;
      p.hueOffset = Math.random() * 360;
    }

    const scale = 100 / p.z;
    const x = p.x * scale;
    const y = p.y * scale;

    ctx.beginPath();
    ctx.arc(x, y, 1.5 + (1 - p.z / 300) * 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${(baseHue + p.hueOffset) % 360}, 100%, 70%)`;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  // Spiral tunnel lines
  const lines = 35;
  const maxRadius = Math.max(width, height) * 0.6;
  const slice = (Math.PI * 2) / lines;

  for (let i = 0; i < lines; i++) {
    const angle = i * slice + time * 0.8;
    const freqIndex = Math.floor((i / lines) * data.length * 0.7);
    const intensity = (data[freqIndex] || 0) / 255;
    const thickness = 1 + intensity * 8;

    ctx.beginPath();
    for (let r = 0; r <= 1; r += 0.05) {
      const radius = r * maxRadius;
      const spiralAngle = angle + r * 2; // tighter spiral
      const x = Math.cos(spiralAngle) * radius;
      const y = Math.sin(spiralAngle) * radius;
      if (r === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    const hue = (baseHue + i * 10) % 360;
    ctx.strokeStyle = `hsl(${hue}, 100%, ${40 + intensity * 40}%)`;
    ctx.lineWidth = thickness;
    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
    ctx.shadowBlur = 20;
    ctx.stroke();
  }

  ctx.restore();
}
