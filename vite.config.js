import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: "./index.html",
        main: "./framework-builder.html",
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3002,
    strictPort: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    hmr: {
      host: "localhost",
      protocol: "ws",
      clientPort: Number(process.env.VITE_CLIENT_PORT || 3002),
    },
    open: "/framework-builder.html",
    fs: {
      allow: ["."],
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
      "/media": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
});
