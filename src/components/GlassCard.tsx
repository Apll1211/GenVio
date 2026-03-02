import React from "react";

interface GlassCardProps {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime?: string;
  className?: string;
}

export default function GlassCard({
  title,
  excerpt,
  date,
  tags,
  readTime = "5 min read",
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/20 backdrop-blur-2xl border border-white/30
        dark:bg-gray-800/60 dark:border-gray-600/30
        shadow-2xl
        transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl
        hover:border-white/40 hover:bg-white/25
        dark:hover:border-gray-500/40 dark:hover:bg-gray-800/70
        ${className}
      `}
    >
      {/* 装饰性渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 dark:from-gray-700/60 dark:to-gray-800/40" />

      <div className="relative p-6">
        {/* 日期和阅读时间 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-800 font-semibold dark:text-gray-200">
            {date}
          </span>
          <span className="text-xs text-gray-800 bg-white/30 px-2 py-1 rounded-full dark:bg-gray-700/50 dark:text-gray-200">
            {readTime}
          </span>
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight dark:text-white">
          {title}
        </h3>

        {/* 摘要 */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 dark:text-gray-300">
          {excerpt}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-800 bg-white/30 px-2 py-1 rounded-md
                hover:bg-white/40 transition-colors cursor-default
                dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-600/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 底部渐变边框效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40" />
    </div>
  );
}
