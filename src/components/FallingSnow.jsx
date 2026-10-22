import React, { useMemo } from 'react';

/**
 * High performance falling snow overlay with neon ambient frost sparkles
 */
export default function FallingSnow() {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${4 + Math.random() * 7}s`,
      delay: `${Math.random() * 5}s`,
      size: `${2 + Math.random() * 4}px`,
      opacity: 0.2 + Math.random() * 0.7,
      color: i % 7 === 0 ? '#00e5ff' : i % 11 === 0 ? '#ff003c' : '#ffffff'
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="absolute rounded-full animate-fall"
          style={{
            left: flake.left,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            backgroundColor: flake.color,
            opacity: flake.opacity,
            boxShadow: `0 0 6px ${flake.color}`,
            animation: `snowFall ${flake.duration} linear infinite`,
            animationDelay: flake.delay
          }}
        />
      ))}
      <style>{`
        @keyframes snowFall {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) translateX(15px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(105vh) translateX(-10px);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
