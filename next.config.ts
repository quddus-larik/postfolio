import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@postfolio/core"],
  serverExternalPackages: ["esbuild", "mdx-bundler"],
};

export default nextConfig;
