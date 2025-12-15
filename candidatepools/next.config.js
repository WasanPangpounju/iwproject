// next.config.js

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "profile.line-scdn.net",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "scontent.fkkc4-2.fna.fbcdn.net", // ✅ เพิ่มอันนี้
      },
      {
        protocol: "https",
        hostname: "scontent.fkkc3-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net", // สำรองสำหรับโดเมนอื่นๆ ของ FB
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // สำหรับ profile picture จากเพจ
      },
      {
        protocol: "https",
        hostname: "*.fna.fbcdn.net", // สำรองแบบ wildcard (ใช้ได้เฉพาะบาง CDN setup)
      },
      {
        protocol: "https",
        hostname: "**.fna.fbcdn.net", // เฟซบุ๊กใช้ CDN ตระกูลนี้
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  reactStrictMode: true,
  trailingSlash: true,
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://career.iwsif.org' : '', // Comment out or remove
  async rewrites() {
    return [
          // ✅ ทำให้ /api/... (ไม่มี /) ไปที่ /api/.../ (มี /) แบบไม่ redirect
    {
      source: "/api/:path*",
      destination: "/api/:path*/",
    },
      {
        source: "/supervisor/students/detail/:id",
        destination: "/supervisor/students/detail/[id].jsx",
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
