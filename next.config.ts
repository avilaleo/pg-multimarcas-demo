import type { NextConfig } from "next";

const basePath = "/pg-multimarcas-demo";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.autocerto.com",
        pathname: "/fotos/**",
      },
    ],
  },
};

export default nextConfig;
