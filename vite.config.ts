import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // The knowledge base and lessons ship in the bundle by design (no backend); ~170 kB gzipped is fine for a local tool.
  build: { chunkSizeWarningLimit: 800 },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
