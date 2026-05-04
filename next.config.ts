import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  htmlLimitedBots: /.*/i,
};

export default nextConfig;
