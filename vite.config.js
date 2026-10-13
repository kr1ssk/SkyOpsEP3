import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
 
  base: "./",

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    include: ["src/**/*.test.{js,jsx}"],

      coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
 
      include: [
        "src/utils/**/*.js",
        "src/data/repositorio.js",
        "src/components/TarjetaProducto.jsx",
      ],
      exclude: ["src/**/*.test.{js,jsx}", "src/test/**", "src/main.jsx"],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
});