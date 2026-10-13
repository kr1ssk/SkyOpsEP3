# SkyOps

Plataforma web de abastecimiento de repuestos aeronáuticos. Permite explorar un catálogo clasificado por categorías ATA, armar un manifiesto de componentes, solicitar su despacho a una aeronave (incluidas las que están en condición AOG) y administrar productos, órdenes, categorías y usuarios desde un panel administrativo. Proyecto de la asignatura Desarrollo Fullstack II (Duoc UC).

## Integrantes

- Agustín Boeri Aedo
- Cristian Rivera

## Stack

- React 19 con Vite
- React Router (HashRouter)
- Bootstrap 5 y React-Bootstrap
- Vitest, React Testing Library y jsdom para pruebas unitarias y de componentes
- Playwright (Chromium) para pruebas de aceptación
- ESLint
- GitHub Actions y GitHub Pages para integración continua y despliegue

## Puesta en marcha

```bash
npm install
npx playwright install chromium
npm run dev
```

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor de desarrollo de Vite |
| `npm run build` | Compila la aplicación para producción en `dist/` |
| `npm run preview` | Sirve localmente el resultado de `build` |
| `npm test` | Ejecuta Vitest en modo observador |
| `npm run test:run` | Ejecuta todas las pruebas de Vitest una vez |
| `npm run test:coverage` | Ejecuta las pruebas y genera el informe de cobertura |
| `npm run test:e2e` | Compila la app y ejecuta las pruebas de aceptación con Playwright |
| `npm run lint` | Revisa el código con ESLint |

## Estructura de `src/`

```text
src/
├── components/   Componentes reutilizables (Layout, LayoutAdmin, TarjetaProducto, formularios)
├── context/      SkyOpsContext: estado global y funciones de la aplicación
├── data/         Datos iniciales, repositorio (CRUD simulado) y boletines
├── pages/        Vistas de la aplicación
│   └── admin/    Vistas del panel administrativo
├── test/         Configuración de las pruebas
├── utils/        Validaciones, reglas de negocio y reportes
├── App.jsx       Definición de las rutas
├── main.jsx      Punto de entrada
└── styles.css    Estilos propios
```

## Pruebas

Las pruebas unitarias y de componentes viven junto al código que verifican (`*.test.js` y `*.test.jsx`). Las pruebas de aceptación están en la carpeta `e2e/` y recorren la aplicación compilada en un navegador real.

Se utiliza Vitest en lugar de Jasmine y Karma por recomendación del docente: Karma fue deprecado por su equipo en 2023 y Protractor, su complemento para pruebas end-to-end, fue descontinuado el mismo año. Vitest es el ejecutor nativo de Vite, comparte su configuración y mantiene la misma API de pruebas. La cobertura exige un mínimo de 80% en sentencias, ramas, funciones y líneas; si baja de ese umbral, el despliegue se detiene.

## Cuenta de demostración

- Correo: `admin@skyops.cl`
- Contraseña: `Skyops123`
