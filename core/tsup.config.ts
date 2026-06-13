import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "index.ts",
    "src/client": "src/client.ts",
    "src/renderer": "src/renderer.tsx",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  outDir: "dist",
});
