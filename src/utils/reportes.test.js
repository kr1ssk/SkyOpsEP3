import { resumirPedidos } from "./reportes.js";

describe("resumirPedidos", () => {
  const pedidos = [
    { estado: "Pendiente", total: 100000, lineas: [{ cantidad: 2 }] },
    { estado: "Resuelto", total: 50000, lineas: [{ cantidad: 1 }, { cantidad: 3 }] },
    { estado: "Rechazado", total: 999999, lineas: [{ cantidad: 10 }] },
  ];

  it("cuenta los pedidos por estado", () => {
    const resumen = resumirPedidos(pedidos);

    expect(resumen.cantidad).toBe(3);
    expect(resumen.aprobados).toBe(2);
    expect(resumen.rechazados).toBe(1);
    expect(resumen.pendientes).toBe(1);
  });

  it("excluye los pedidos rechazados de los ingresos", () => {
    expect(resumirPedidos(pedidos).ingresos).toBe(150000);
  });

  it("suma las unidades de todas las líneas aprobadas", () => {
    expect(resumirPedidos(pedidos).unidades).toBe(6);
  });

  it("devuelve ceros cuando no hay pedidos", () => {
    const resumen = resumirPedidos([]);

    expect(resumen.cantidad).toBe(0);
    expect(resumen.ingresos).toBe(0);
  });
});
