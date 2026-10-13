import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Carpeta donde viven las pruebas de aceptación
  testDir: "./e2e",
  use: { baseURL: "http://localhost:4173" },

  webServer: {
    // Compila la app y la sirve igual que quedará publicada en GitHub Pages
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
