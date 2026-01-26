"use client";

import { motion } from "framer-motion";
import {
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import MetallicPaint, { parseLogoImage } from "@/components/MetallicPaint";
import ShinyText from "@/components/ShinyText";
import { useSplashCursor } from "@/context/SplashCursorContext";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { isEnabled, toggleEnabled } = useSplashCursor();
  const { theme, isDark, mode, toggleTheme } = useTheme();
  const [imageData, setImageData] = useState<ImageData | null>(null);

  // 加载 logo.svg 并解析为 ImageData
  useEffect(() => {
    async function loadLogoImage() {
      try {
        const response = await fetch("/logo.svg");
        const blob = await response.blob();
        const file = new File([blob], "logo.svg", { type: blob.type });
        const parsedData = await parseLogoImage(file);
        setImageData(parsedData?.imageData ?? null);
      } catch (err) {
        // Silent fail
      }
    }

    loadLogoImage();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 bg-background/60 backdrop-blur-2xl border-b border-border/20">
      <div className="flex h-full items-center justify-between px-3 md:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="relative flex h-7 w-7 items-center justify-center overflow-hidden select-none"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {imageData && (
                <MetallicPaint
                  imageData={imageData}
                  params={{
                    edge: 1.5,
                    patternBlur: 0.003,
                    patternScale: 1.5,
                    refraction: 0.02,
                    speed: 0.4,
                    liquid: 0.1,
                  }}
                />
              )}
            </motion.div>
            <motion.div
              whileHover={{ letterSpacing: "0.05em" }}
              transition={{ duration: 0.2 }}
            >
              <ShinyText
                text="Apllgen"
                speed={2}
                delay={0}
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
                className="text-base font-bold select-none"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Theme Toggle & Splash Cursor */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme Toggle */}
          <motion.button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg bg-background/60 backdrop-blur-xl border border-border/20 text-muted-foreground hover:bg-background/70 hover:text-primary active:scale-95 active:bg-background/60 transition-transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-label="切换主题"
            title={
              mode === "auto"
                ? "当前为自动模式，点击切换为手动控制"
                : "手动控制主题，点击切换回自动模式"
            }
          >
            <motion.div
              className="relative w-4 h-4"
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? (
                <Moon className="absolute inset-0 w-4 h-4" />
              ) : (
                <Sun className="absolute inset-0 w-4 h-4" />
              )}
            </motion.div>
          </motion.button>

          {/* Splash Cursor Toggle */}
          <motion.button
            type="button"
            onClick={toggleEnabled}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground bg-background/60 backdrop-blur-xl border border-border/20 hover:bg-background/70 hover:text-primary active:scale-95 active:bg-background/60 transition-transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-label="切换滑动特效"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">滑动特效</span>
            <motion.div
              className="relative h-5 w-9 rounded-full transition-colors"
              animate={{
                backgroundColor: isEnabled ? "#3b82f6" : "#e5e7eb",
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                animate={{
                  x: isEnabled ? 16 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
