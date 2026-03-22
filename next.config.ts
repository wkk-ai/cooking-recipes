import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/cooking-recipes",
  trailingSlash: true,
};

export default nextConfig;
