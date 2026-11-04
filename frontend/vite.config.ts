import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    // Required to make Vite reachable from Docker
    host: true,
    port: 5173,

    // API proxy (used later when backend is running)
    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    },
  },

  // Important for later: relative paths allow static serving & HTML export
  base: "./",
});
