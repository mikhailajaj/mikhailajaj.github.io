import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.awsstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "**.microsoft.com", pathname: "/**" },
      { protocol: "https", hostname: "101blockchains.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;

