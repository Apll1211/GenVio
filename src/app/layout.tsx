import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import SplashCursor from "@/components/SplashCursor";
import { AuthProvider } from "@/context/AuthContext";
import { SplashCursorProvider } from "@/context/SplashCursorContext";
import { Toaster } from "@/components/ui/sonner";

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
      <body className="font-sans antialiased">
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
