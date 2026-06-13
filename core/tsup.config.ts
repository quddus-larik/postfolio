import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    server: "server.ts",
    "src/client": "src/client.tsx",
    "src/utils": "src/utils.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom","esbuild", "mdx-bundler"],
  outDir: "dist",
});
