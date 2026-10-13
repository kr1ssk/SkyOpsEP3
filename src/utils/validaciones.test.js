import { validarCheckout, validarContacto, validarProducto } from "./validaciones.js";

function checkoutValido() {
  return {
    matricula: "CC-BFA",
    ingeniero: "Agustín Boeri",
    licencia: "AA-1234",
    correo: "agustin@skyops.cl",
    direccion: "Aeropuerto AMB, hangar 4",
    destino: "SCL",
    tipoEntrega: "Despacho a aeropuerto",
    declaracion: true,
  };
}

describe("validarCheckout", () => {
  it("no devuelve errores cuando todos los datos son válidos", () => {
    expect(validarCheckout(checkoutValido())).toEqual({});
  });

  it("rechaza una matrícula con formato incorrecto", () => {
    const errores = validarCheckout({ ...checkoutValido(), matricula: "CCBFA" });
    expect(errores.matricula).toBe("Usa el formato CC-BFA.");
  });

  it("acepta la matrícula en minúsculas porque se normaliza a mayúsculas", () => {
    const errores = validarCheckout({ ...checkoutValido(), matricula: "cc-bfa" });
    expect(errores.matricula).toBeUndefined();
  });

  it("exige nombre y apellido en el ingeniero responsable", () => {
    const errores = validarCheckout({ ...checkoutValido(), ingeniero: "Agustín" });
    expect(errores.ingeniero).toBe("Ingresa nombre y apellido.");
  });

  it("rechaza un destino que no es un aeropuerto habilitado", () => {
    const errores = validarCheckout({ ...checkoutValido(), destino: "LAX" });
    expect(errores.destino).toBe("Selecciona un aeropuerto.");
  });

  it("acumula varios errores cuando hay varios campos inválidos", () => {
    const errores = validarCheckout({
      ...checkoutValido(),
      licencia: "1234",
      correo: "correo-invalido",
      declaracion: false,
    });

    expect(Object.keys(errores)).toHaveLength(3);
    expect(errores.licencia).toBeDefined();
    expect(errores.correo).toBeDefined();
    expect(errores.declaracion).toBeDefined();
  });
});

describe("validarContacto", () => {
  it("exige un mensaje de al menos 20 caracteres", () => {
    const errores = validarContacto({
      nombre: "Agustín",
      correo: "agustin@skyops.cl",
      mensaje: "Hola",
    });

    expect(errores.mensaje).toBe("Escribe un mensaje de al menos 20 caracteres.");
  });


function productoValido() {
  return {
    id: null,
    nombre: "Bomba hidráulica",
    pn: "PN-29-1",
    categoria: "ATA 29",
    descripcion: "Bomba del sistema hidráulico principal.",
    ubicacion: "Bodega A-12",
    stock: 4,
    precio: 100000,
    descuento: 0,
    imagen: "bomba.svg",
  };
}

describe("validarProducto", () => {
  it("no devuelve errores cuando el producto es válido", () => {
    expect(validarProducto(productoValido())).toEqual({});
  });

  it("exige un nombre de al menos 3 caracteres", () => {
    const errores = validarProducto({ ...productoValido(), nombre: "AB" });
    expect(errores.nombre).toBe("Escribe un nombre de al menos 3 caracteres.");
  });

  it("exige número de parte, categoría, descripción y ubicación", () => {
    const errores = validarProducto({
      ...productoValido(),
      pn: "   ",
      categoria: "",
      descripcion: "",
      ubicacion: "  ",
    });

    expect(errores.pn).toBeDefined();
    expect(errores.categoria).toBeDefined();
    expect(errores.descripcion).toBeDefined();
    expect(errores.ubicacion).toBeDefined();
  });

  it("acepta stock 0 pero rechaza stock negativo", () => {
    expect(validarProducto({ ...productoValido(), stock: 0 }).stock).toBeUndefined();
    expect(validarProducto({ ...productoValido(), stock: -1 }).stock).toBeDefined();
  });

  it("rechaza un stock decimal", () => {
    const errores = validarProducto({ ...productoValido(), stock: 2.5 });
    expect(errores.stock).toBe("El stock debe ser un número entero igual o mayor a 0.");
  });

  it("rechaza un precio igual o menor a cero", () => {
    expect(validarProducto({ ...productoValido(), precio: 0 }).precio).toBeDefined();
    expect(validarProducto({ ...productoValido(), precio: -500 }).precio).toBeDefined();
  });

  it("acepta descuentos entre 0 y 100 y rechaza los que están fuera de rango", () => {
    expect(validarProducto({ ...productoValido(), descuento: 100 }).descuento).toBeUndefined();
    expect(validarProducto({ ...productoValido(), descuento: 101 }).descuento).toBeDefined();
    expect(validarProducto({ ...productoValido(), descuento: -5 }).descuento).toBeDefined();
  });

  it("acepta imagen vacía pero rechaza un nombre de archivo sin extensión válida", () => {
    expect(validarProducto({ ...productoValido(), imagen: "" }).imagen).toBeUndefined();
    expect(validarProducto({ ...productoValido(), imagen: "bomba.gif" }).imagen).toBeDefined();
    expect(validarProducto({ ...productoValido(), imagen: "bomba" }).imagen).toBeDefined();
  });
});
});