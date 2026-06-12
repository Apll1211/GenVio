"use client";

import React from "react";

interface PrismProps {
  height?: number;
  baseWidth?: number;
  animationType?: "rotate" | "hover" | "3drotate";
  glow?: number;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  timeScale?: number;
  noise?: number;
  whiteGlow?: number;
}

const PrismBackground: React.FC<PrismProps> = ({
  timeScale = 0.5,
  hueShift = 0,
}) => {
  const duration = `${20 / (timeScale || 1)}s`;
  const h = hueShift * 360;
  
  return (
    <div className="absolute inset-0 overflow-hidden bg-background pointer-events-none -z-10 select-none">
      {/* 静态渐变底色 - 无需动画，极低消耗 */}
      <div 
        className="absolute inset-0 opacity-50 dark:opacity-30 transition-colors duration-1000"
        style={{
          background: `
            radial-gradient(circle at 10% 10%, oklch(0.7 0.2 ${280 + h} / 0.4) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, oklch(0.6 0.2 ${200 + h} / 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, oklch(0.8 0.1 ${320 + h} / 0.3) 0%, transparent 80%)
          `
        }}
      />

      {/* 动态棱镜带 - 使用 will-change 优化性能，移除昂贵的混合模式 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.2] dark:opacity-[0.15]">
        <div 
          className="w-[120vmax] h-[120vmax] animate-prism-rotate will-change-transform"
          style={{
            animationDuration: duration,
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              oklch(0.9 0.3 ${260 + h}) 15deg,
              transparent 30deg,
              oklch(0.85 0.25 ${180 + h}) 90deg,
              transparent 120deg,
              oklch(0.9 0.3 ${320 + h}) 180deg,
              transparent 210deg,
              oklch(0.85 0.25 ${220 + h}) 270deg,
              transparent 300deg,
              oklch(0.9 0.3 ${260 + h}) 360deg
            )`
          }}
        />
      </div>

      {/* 极简氛围光斑 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-accent/20 rounded-full blur-[100px]" />
      </div>

      <style jsx>{`
        @keyframes prism-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-prism-rotate {
          animation: prism-rotate linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PrismBackground;
