import { validarCheckout, validarContacto } from "./validaciones.js";

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
});