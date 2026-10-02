import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Üst klasörlerdeki başka package-lock.json dosyaları proje kökünü şaşırtmasın
  turbopack: { root: __dirname },
};

export default nextConfig;
