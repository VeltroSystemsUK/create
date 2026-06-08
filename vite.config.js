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
    hmr: {
      host: "localhost",
      protocol: "ws",
      clientPort: 3002,
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
