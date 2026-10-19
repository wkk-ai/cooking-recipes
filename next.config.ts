import type { NextConfig } from "next";

const pages = process.env.PAGES === "1";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  basePath: "/cooking-recipes",
  trailingSlash: true,
  ...(pages ? { output: "export" as const } : {}),
  ...(pages
    ? {
        turbopack: {
          resolveAlias: {
            "@/app/actions": "./src/lib/static-actions.ts",
          },
        },
      }
    : {}),
};

export default nextConfig;
