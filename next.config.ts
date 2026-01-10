import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 強制將 better-sqlite3 視為外部依賴，不進行打包
  serverExternalPackages: ["better-sqlite3"],

  // 允许的外部域名
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apll.qzz.io",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;