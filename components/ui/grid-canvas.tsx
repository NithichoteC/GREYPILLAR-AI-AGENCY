'use client';

import { useEffect, useRef } from 'react';

interface GridCanvasProps {
  className?: string;
}

export default function GridCanvas({ className }: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration
    const config = {
      squareSize: 80,
      speed: 0.5,
      borderColor: '#ced4da', // Light gray for borders
      hoverFillColor: '#e9ecef', // Slightly darker gray for hover
      direction: 'diagonal'
    };

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function drawGrid() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffsetRef.current.x / config.squareSize) * config.squareSize;
      const startY = Math.floor(gridOffsetRef.current.y / config.squareSize) * config.squareSize;

      ctx.lineWidth = 0.5;

      for (let x = startX; x < canvas.width + config.squareSize; x += config.squareSize) {
        for (let y = startY; y < canvas.height + config.squareSize; y += config.squareSize) {
          const squareX = x - (gridOffsetRef.current.x % config.squareSize);
          const squareY = y - (gridOffsetRef.current.y % config.squareSize);

          // Check if this square is hovered
          if (hoveredSquareRef.current &&
              Math.floor((x - startX) / config.squareSize) === hoveredSquareRef.current.x &&
              Math.floor((y - startY) / config.squareSize) === hoveredSquareRef.current.y) {
            ctx.fillStyle = config.hoverFillColor;
            ctx.fillRect(squareX, squareY, config.squareSize, config.squareSize);
          }

          ctx.strokeStyle = config.borderColor;
          ctx.strokeRect(squareX, squareY, config.squareSize, config.squareSize);
        }
      }

      // Add subtle radial gradient for depth
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2,
        Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2
      );
      gradient.addColorStop(0, 'rgba(247, 247, 248, 0)');
      gradient.addColorStop(1, 'rgba(247, 247, 248, 0.3)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateAnimation() {
      const effectiveSpeed = Math.max(config.speed, 0.1);

      gridOffsetRef.current.x = (gridOffsetRef.current.x - effectiveSpeed + config.squareSize) % config.squareSize;
      gridOffsetRef.current.y = (gridOffsetRef.current.y - effectiveSpeed + config.squareSize) % config.squareSize;

      drawGrid();
      animationIdRef.current = requestAnimationFrame(updateAnimation);
    }

    function handleMouseMove(event: MouseEvent) {
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffsetRef.current.x / config.squareSize) * config.squareSize;
      const startY = Math.floor(gridOffsetRef.current.y / config.squareSize) * config.squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffsetRef.current.x - startX) / config.squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffsetRef.current.y - startY) / config.squareSize);

      hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
    }

    function handleMouseLeave() {
      hoveredSquareRef.current = null;
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Initialize
    resizeCanvas();
    animationIdRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      // Cleanup
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}