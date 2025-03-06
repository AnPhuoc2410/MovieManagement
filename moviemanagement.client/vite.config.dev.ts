import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Development config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
  },
  publicDir: "public",
});
