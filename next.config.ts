import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  htmlLimitedBots: /.*/i,
  allowedDevOrigins: ["10.0.30.207"],
};

export default nextConfig;
