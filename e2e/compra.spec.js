import { test, expect } from "@playwright/test";

// La app usa HashRouter, por eso las rutas llevan #/

// Las pruebas no dependen del backend: las respuestas de la API se simulan
const productos = [
  {
    id: 1,
    nombre: "Actuador de Superficie de Control",
    pn: "PN-27-6612",
    categoria: "ATA 27",
    descripcion: "Actuador para el sistema de control de vuelo.",
    ubicacion: "Bodega ANF-A03",
    stock: 4,
    precio: 850000,
    descuento: 10,
    certificado: true,
    imagen: "",
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/productos", (ruta) => ruta.fulfill({ json: productos }));
  await page.route("**/api/v1/categorias", (ruta) => ruta.fulfill({ json: [{ id: 1, nombre: "ATA 27" }] }));
  await page.route("**/api/v1/flota", (ruta) => ruta.fulfill({ json: [] }));
});

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

test("sin sesión, el panel de administración redirige al login", async ({ page }) => {
  await page.goto("/#/admin/usuarios");
  await expect(page).toHaveURL(/#\/login/);
});

test("sin sesión, el checkout redirige al login", async ({ page }) => {
  await page.goto("/#/checkout");
  await expect(page).toHaveURL(/#\/login/);
});

test("un cliente no puede entrar al panel de administración", async ({ page }) => {
  // Sesión de cliente guardada, como la deja el login
  await page.addInitScript(() => {
    localStorage.setItem(
      "skyops_sesion",
      JSON.stringify({
        accessToken: "token",
        refreshToken: "token",
        usuario: { id: 2, nombre: "Cliente", correo: "c@skyops.cl", rol: "cliente" },
      })
    );
  });
  await page.route("**/api/v1/usuarios/me", (ruta) =>
    ruta.fulfill({ json: { id: 2, nombre: "Cliente", correo: "c@skyops.cl", rol: "CLIENTE" } })
  );
  await page.route("**/api/v1/boletas", (ruta) => ruta.fulfill({ json: [] }));

  await page.goto("/#/admin");
  await expect(page).toHaveURL(/#\/perfil/);
});
