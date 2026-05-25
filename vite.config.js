import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./framework-builder.html",
      },
    },
  },
  server: {
    port: 3000,
    open: "/framework-builder.html",
  },
});
