import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    server: "server.ts",
    "src/client": "src/client.ts",
    "src/renderer": "src/renderer.tsx",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom","esbuild", "mdx-bundler"],
  outDir: "dist",
});
