import {
  borrarProducto,
  borrarUsuario,
  guardarProducto,
  guardarUsuario,
  iniciarSesion,
} from "./repositorio.js";
import { crearDatosIniciales } from "./semilla.js";

// Producto válido listo para guardar. id: null significa "es nuevo".
function productoNuevo(cambios = {}) {
  return {
    id: null,
    nombre: "Sensor de presión",
    pn: "PN-36-0001",
    categoria: "ATA 27",
    descripcion: "Sensor del sistema neumático.",
    ubicacion: "Bodega SCL-B02",
    stock: 5,
    precio: 300000,
    descuento: 0,
    imagen: "sensor.svg",
    ...cambios,
  };
}

describe("guardarProducto", () => {
  it("agrega un producto nuevo al catálogo", () => {
    const datos = crearDatosIniciales();
    const resultado = guardarProducto(datos, productoNuevo());

    expect(resultado.productos).toHaveLength(4);
    expect(resultado.productos.at(-1).nombre).toBe("Sensor de presión");
  });

  it("asigna un id al producto nuevo", () => {
    const resultado = guardarProducto(crearDatosIniciales(), productoNuevo());
    expect(resultado.productos.at(-1).id).toBeDefined();
  });

  it("normaliza el número de parte y la categoría a mayúsculas", () => {
    const resultado = guardarProducto(
      crearDatosIniciales(),
      productoNuevo({ pn: "  pn-36-0001  ", categoria: "ata 27" })
    );

    const guardado = resultado.productos.at(-1);
    expect(guardado.pn).toBe("PN-36-0001");
    expect(guardado.categoria).toBe("ATA 27");
  });

  it("rechaza un número de parte repetido", () => {
    expect(() =>
      guardarProducto(crearDatosIniciales(), productoNuevo({ pn: "PN-27-6612" }))
    ).toThrow("Ya existe un producto con ese número de parte.");
  });

  it("rechaza una categoría que no está registrada", () => {
    expect(() =>
      guardarProducto(crearDatosIniciales(), productoNuevo({ categoria: "ATA 99" }))
    ).toThrow("Selecciona una categoría registrada.");
  });

  it("rechaza un producto con datos inválidos", () => {
    expect(() =>
      guardarProducto(crearDatosIniciales(), productoNuevo({ precio: 0 }))
    ).toThrow("Revisa los datos del producto.");
  });

  it("edita un producto existente sin agregar uno nuevo", () => {
    const datos = crearDatosIniciales();
    const existente = { ...datos.productos[0], nombre: "Actuador revisado" };
    const resultado = guardarProducto(datos, existente);

    expect(resultado.productos).toHaveLength(3);
    expect(resultado.productos[0].nombre).toBe("Actuador revisado");
  });

  it("no permite dejar el stock bajo lo comprometido en el manifiesto", () => {
    const datos = crearDatosIniciales();
    datos.carrito = [{ productoId: 1, cantidad: 3 }];
    const producto = { ...datos.productos[0], stock: 1 };

    expect(() => guardarProducto(datos, producto)).toThrow(
      "El stock no puede ser menor a la cantidad del manifiesto."
    );
  });
});

describe("borrarProducto", () => {
  it("elimina el producto del catálogo", () => {
    const resultado = borrarProducto(crearDatosIniciales(), 1);

    expect(resultado.productos).toHaveLength(2);
    expect(resultado.productos.some((p) => p.id === 1)).toBe(false);
  });

  it("impide borrar un producto que está en el manifiesto", () => {
    const datos = crearDatosIniciales();
    datos.carrito = [{ productoId: 1, cantidad: 1 }];

    expect(() => borrarProducto(datos, 1)).toThrow(
      "Quita el producto del manifiesto antes de eliminarlo."
    );
  });
});

describe("guardarUsuario", () => {
  function usuarioNuevo(cambios = {}) {
    return {
      id: null,
      nombre: "Cristian Rivera",
      correo: "Cristian@Skyops.cl",
      clave: "Skyops2026",
      rol: "cliente",
      ...cambios,
    };
  }

  it("registra un usuario nuevo y normaliza el correo a minúsculas", () => {
    const resultado = guardarUsuario(crearDatosIniciales(), usuarioNuevo());

    expect(resultado.usuarios).toHaveLength(2);
    expect(resultado.usuarios.at(-1).correo).toBe("cristian@skyops.cl");
  });

  it("rechaza un correo ya registrado", () => {
    expect(() =>
      guardarUsuario(crearDatosIniciales(), usuarioNuevo({ correo: "admin@skyops.cl" }))
    ).toThrow("Ese correo ya está registrado.");
  });

  it("rechaza una contraseña sin números o demasiado corta", () => {
    expect(() =>
      guardarUsuario(crearDatosIniciales(), usuarioNuevo({ clave: "skyops" }))
    ).toThrow("Revisa los datos del usuario.");
  });

  it("impide quitar el rol admin si es el único administrador", () => {
    const datos = crearDatosIniciales();
    const admin = { ...datos.usuarios[0], rol: "cliente" };

    expect(() => guardarUsuario(datos, admin)).toThrow(
      "Debe quedar al menos un administrador."
    );
  });
});

describe("borrarUsuario", () => {
  it("impide eliminar al único administrador", () => {
    expect(() => borrarUsuario(crearDatosIniciales(), "admin-demo")).toThrow(
      "Debe quedar al menos un administrador."
    );
  });

  it("impide eliminar la propia cuenta en sesión", () => {
    const datos = { ...crearDatosIniciales(), sesionId: "admin-demo" };

    expect(() => borrarUsuario(datos, "admin-demo")).toThrow(
      "No puedes eliminar tu propia cuenta."
    );
  });
});

describe("iniciarSesion", () => {
  it("abre sesión con credenciales correctas", () => {
    const resultado = iniciarSesion(crearDatosIniciales(), "admin@skyops.cl", "Skyops123");
    expect(resultado.sesionId).toBe("admin-demo");
  });

  it("acepta el correo con mayúsculas y espacios", () => {
    const resultado = iniciarSesion(crearDatosIniciales(), "  ADMIN@SKYOPS.CL ", "Skyops123");
    expect(resultado.sesionId).toBe("admin-demo");
  });

  it("rechaza una contraseña incorrecta", () => {
    expect(() =>
      iniciarSesion(crearDatosIniciales(), "admin@skyops.cl", "otraClave1")
    ).toThrow("Correo o contraseña incorrectos.");
  });
});

describe("inmutabilidad del repositorio", () => {
  it("no modifica los datos originales al guardar un producto", () => {
    const datos = crearDatosIniciales();
    guardarProducto(datos, productoNuevo());

    expect(datos.productos).toHaveLength(3);
  });
});
