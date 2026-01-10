import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import SplashCursor from "@/components/SplashCursor";
import { AuthProvider } from "@/context/AuthContext";
import { SplashCursorProvider } from "@/context/SplashCursorContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenVio",
  description: "GenVio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SplashCursorProvider>
          <SplashCursor />
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </SplashCursorProvider>
        <Toaster />
      </body>
    </html>
  );
}
