import { test, expect } from "@playwright/test";

// La app usa HashRouter, por eso las rutas llevan #/

test("la portada carga y muestra el título", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/SkyOps/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("se puede navegar al catálogo desde el menú", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Catálogo", exact: true }).click();

  await expect(page).toHaveURL(/#\/catalogo/);
  await expect(page.getByRole("button", { name: "Agregar" }).first()).toBeVisible();
});

test("agregar un repuesto actualiza el contador del manifiesto", async ({ page }) => {
  await page.goto("/#/catalogo");
  await page.getByRole("button", { name: "Agregar" }).first().click();

  // El contador del navbar muestra la cantidad total de piezas
  await expect(page.getByRole("link", { name: /Manifiesto \(1\)/ })).toBeVisible();
});

test("el manifiesto conserva las piezas al recargar la página", async ({ page }) => {
  await page.goto("/#/catalogo");
  await page.getByRole("button", { name: "Agregar" }).first().click();

  await page.reload();

  // Persistencia en localStorage: el manifiesto sobrevive al refresco
  await expect(page.getByRole("link", { name: /Manifiesto \(1\)/ })).toBeVisible();
});

test("una ruta inexistente muestra la vista 404", async ({ page }) => {
  await page.goto("/#/ruta-que-no-existe");
  await expect(page.getByText(/404/)).toBeVisible();
});
