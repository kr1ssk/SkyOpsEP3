# SkyOps

Plataforma web de abastecimiento de repuestos aeronáuticos. Permite explorar un catálogo clasificado por categorías ATA, armar un manifiesto de componentes, solicitar su despacho a una aeronave (incluidas las que están en condición AOG) y administrar productos, órdenes, categorías y usuarios desde un panel administrativo. Proyecto de la asignatura Desarrollo Fullstack II (Duoc UC).

El frontend consume la API REST del backend de SkyOps (Spring Boot + MySQL, repositorio aparte). Los datos y la sesión ya no viven en el navegador: vienen del backend, que valida el token JWT y el rol de cada petición.

## Integrantes

- Agustín Boeri Aedo
- Cristian Rivera

## Stack

- React 19 con Vite
- React Router (HashRouter)
- fetch para llamar a la API REST, con sesión JWT en localStorage
- Bootstrap 5 y React-Bootstrap
- Vitest, React Testing Library y jsdom para pruebas unitarias y de componentes
- Playwright (Chromium) para pruebas de aceptación
- ESLint
- GitHub Actions y GitHub Pages para integración continua y despliegue

## Puesta en marcha

### Con Docker

Para iniciar frontend, API y MySQL juntos, sigue el apartado **Con Docker Compose** del README del repositorio
[SkyOps Backend](https://github.com/kr1ssk/SkyOpsEVP3). Ambos repositorios deben estar clonados en carpetas hermanas.
La interfaz queda en http://localhost:3000 y Swagger en http://localhost:8080/swagger-ui.html.

### Ejecución directa (sin Docker)

Primero hay que iniciar el backend (ver su README): `./mvnw spring-boot:run`, queda en http://localhost:8080.

```bash
npm install
npm run dev                                       # http://localhost:5173, API en http://localhost:8080
VITE_API_URL=http://<direccion-del-backend>:8080 npm run build   # genera dist/ apuntando a otro backend
```

La URL de la API se lee de `VITE_API_URL` **al compilar** (ver `.env.example`); cambiarla exige volver a compilar. Si no
se define, usa `http://localhost:8080`.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor de desarrollo de Vite |
| `npm run build` | Compila la aplicación para producción en `dist/` |
| `npm run preview` | Sirve localmente el resultado de `build` |
| `npm test` | Ejecuta Vitest en modo observador |
| `npm run test:run` | Ejecuta todas las pruebas de Vitest una vez |
| `npm run test:coverage` | Ejecuta las pruebas y genera el informe de cobertura |
| `npm run test:e2e` | Compila la app y ejecuta las pruebas de aceptación con Playwright (la API se simula, no necesita backend) |
| `npm run lint` | Revisa el código con ESLint |

## Estructura de `src/`

```text
src/
├── components/   Componentes reutilizables (Layout, LayoutAdmin, Acceso, TarjetaProducto, formularios)
├── context/      SkyOpsContext: carga los datos desde la API y expone las acciones a las pantallas
├── data/         Datos y funciones del proyecto original con localStorage (la app ya no los usa) y boletines del blog
├── services/     Conexión con el backend: api.js (fetch, token y renovación), sesion.js (localStorage), adaptadores.js
├── pages/        Vistas de la aplicación
│   └── admin/    Vistas del panel administrativo
├── test/         Configuración de las pruebas
├── utils/        Validaciones, reglas de negocio y reportes
├── App.jsx       Definición de las rutas
├── main.jsx      Punto de entrada
└── styles.css    Estilos propios
```

## Pruebas

Las pruebas unitarias y de componentes viven junto al código que verifican (`*.test.js` y `*.test.jsx`). Las pruebas de aceptación están en la carpeta `e2e/` y recorren la aplicación compilada en un navegador real; las respuestas de la API se simulan para que corran en integración continua sin backend.

Se utiliza Vitest en lugar de Jasmine y Karma por recomendación del docente: Karma fue deprecado por su equipo en 2023 y Protractor, su complemento para pruebas end-to-end, fue descontinuado el mismo año. Vitest es el ejecutor nativo de Vite, comparte su configuración y mantiene la misma API de pruebas. La cobertura exige un mínimo de 80% en sentencias, ramas, funciones y líneas; si baja de ese umbral, el despliegue se detiene.

## Sesión y permisos

- Al iniciar sesión el backend entrega un `accessToken` (15 minutos) y un `refreshToken` (7 días). `src/services/sesion.js`
  los guarda en `localStorage`, así la sesión sobrevive a recargar la página. Al abrir la app se confirma con `GET /usuarios/me`.
- `src/services/api.js` agrega el token a cada petición. Si el backend responde 401 por token vencido, renueva los tokens
  una vez y repite la petición; si no se puede renovar, cierra la sesión y vuelve al login.
- `src/components/Acceso.jsx` protege las rutas por rol (ver `App.jsx`) y los menús y botones se ocultan según el rol.
  Es solo interfaz: la seguridad real la aplica el backend con 401 y 403.

| Rol | Qué ve |
| --- | --- |
| Visitante | Catálogo, flota, contacto, registro e inicio de sesión |
| Cliente | Lo anterior más manifiesto, compra y su historial |
| Vendedor | Solo "Panel de ventas": productos y órdenes de solo lectura, con su detalle |
| Administrador | Todo el panel de administración |

## Cuentas de demostración

Las crea el backend en su primer arranque. Todas con la contraseña `Skyops123`.

- `admin@skyops.cl` (administrador)
- `vendedor@skyops.cl` (vendedor)
- `cliente@skyops.cl` (cliente)
