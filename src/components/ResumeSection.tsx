import React from "react";

interface ResumeSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function ResumeSection({
  title,
  icon,
  children,
  className = "",
}: ResumeSectionProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/20 backdrop-blur-2xl border border-white/30
        dark:bg-gray-800/60 dark:border-gray-600/30
        shadow-2xl
        transition-all duration-300 hover:shadow-3xl
        hover:border-white/40 hover:bg-white/25
        dark:hover:border-gray-500/40 dark:hover:bg-gray-800/70
        ${className}
      `}
    >
      {/* 装饰性渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 dark:from-gray-700/60 dark:to-gray-800/40 pointer-events-none" />

      <div className="relative p-8">
        {/* 标题区域 */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4 dark:border-gray-600/30">
          {icon && <div className="text-primary dark:text-primary-foreground">{icon}</div>}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>

        {/* 内容区域 */}
        <div className="text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>

      {/* 底部渐变边框效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40" />
    </div>
  );
}
