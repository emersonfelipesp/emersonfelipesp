import type { NextConfig } from "next";

const markdownAcceptHeader = [
  {
    type: "header" as const,
    key: "accept",
    value: "(.*)text/markdown(.*)",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  htmlLimitedBots: /.*/i,
  allowedDevOrigins: ["10.0.30.207"],
  async rewrites() {
    const project =
      ":project(netbox-proxbox|proxbox-api|netbox-sdk|proxmox-sdk)";

    return {
      beforeFiles: [
        {
          source: "/",
          has: markdownAcceptHeader,
          destination: "/md",
        },
        {
          source: "/sponsor",
          has: markdownAcceptHeader,
          destination: "/md/sponsor",
        },
        {
          source: `/${project}`,
          has: markdownAcceptHeader,
          destination: "/md/:project",
        },
        {
          source: `/${project}/:view(developer|roadmap|releases)`,
          has: markdownAcceptHeader,
          destination: "/md/:project/:view",
        },
        {
          source: `/${project}/releases/:tag*`,
          has: markdownAcceptHeader,
          destination: "/md/:project/releases/:tag*",
        },
      ],
    };
  },
};

export default nextConfig;
