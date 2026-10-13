import {
  agregarAlCarrito,
  calcularTotal,
  cambiarCantidad,
  precioFinal,
  procesarCompra,
  quitarDelCarrito,
} from "./negocio.js";

function productos() {
  return [
    { id: "p1", nombre: "Bomba hidráulica", pn: "PN-29-1", precio: 100000, descuento: 0, stock: 2 },
    { id: "p2", nombre: "Álabe de turbina", pn: "PN-72-1", precio: 200000, descuento: 10, stock: 0 },
  ];
}

describe("precioFinal", () => {
  it("devuelve el precio sin cambios cuando no hay descuento", () => {
    expect(precioFinal(productos()[0])).toBe(100000);
  });

  it("aplica el porcentaje de descuento y redondea", () => {
    expect(precioFinal(productos()[1])).toBe(180000);
  });
});

describe("agregarAlCarrito", () => {
  it("agrega un producto nuevo con cantidad 1", () => {
    const carrito = agregarAlCarrito(productos(), [], "p1");
    expect(carrito).toEqual([{ productoId: "p1", cantidad: 1 }]);
  });

  it("incrementa la cantidad si el producto ya está en el manifiesto", () => {
    const carrito = agregarAlCarrito(productos(), [{ productoId: "p1", cantidad: 1 }], "p1");
    expect(carrito[0].cantidad).toBe(2);
  });

  it("lanza error si se supera el stock disponible", () => {
    expect(() =>
      agregarAlCarrito(productos(), [{ productoId: "p1", cantidad: 2 }], "p1")
    ).toThrow("No hay más unidades disponibles.");
  });

  it("lanza error si el producto no existe", () => {
    expect(() => agregarAlCarrito(productos(), [], "inexistente")).toThrow(
      "El producto no existe."
    );
  });

  it("no modifica el carrito original (inmutabilidad)", () => {
    const original = [{ productoId: "p1", cantidad: 1 }];
    agregarAlCarrito(productos(), original, "p1");
    expect(original[0].cantidad).toBe(1);
  });
});

describe("cambiarCantidad", () => {
  it("actualiza la cantidad cuando está dentro del stock", () => {
    const carrito = cambiarCantidad(productos(), [{ productoId: "p1", cantidad: 1 }], "p1", 2);
    expect(carrito[0].cantidad).toBe(2);
  });

  it("rechaza una cantidad mayor al stock", () => {
    expect(() =>
      cambiarCantidad(productos(), [{ productoId: "p1", cantidad: 1 }], "p1", 5)
    ).toThrow();
  });

  it("rechaza una cantidad decimal", () => {
    expect(() =>
      cambiarCantidad(productos(), [{ productoId: "p1", cantidad: 1 }], "p1", 1.5)
    ).toThrow();
  });
});

describe("quitarDelCarrito", () => {
  it("elimina solo el producto indicado", () => {
    const carrito = [
      { productoId: "p1", cantidad: 1 },
      { productoId: "p2", cantidad: 3 },
    ];

    expect(quitarDelCarrito(carrito, "p1")).toEqual([{ productoId: "p2", cantidad: 3 }]);
  });
});

describe("calcularTotal", () => {
  it("suma los subtotales aplicando el precio con descuento", () => {
    const total = calcularTotal(productos(), [{ productoId: "p1", cantidad: 2 }]);
    expect(total).toBe(200000);
  });
});

describe("procesarCompra", () => {
  function datosBase() {
    return {
      productos: productos(),
      carrito: [{ productoId: "p1", cantidad: 2 }],
      pedidos: [],
    };
  }

  const entrega = { matricula: "CC-BFA", destino: "SCL" };

  it("descuenta el stock y vacía el manifiesto cuando la compra se aprueba", () => {
    const { datos, pedido } = procesarCompra(datosBase(), entrega, true);

    expect(datos.productos[0].stock).toBe(0);
    expect(datos.carrito).toEqual([]);
    expect(pedido.estado).toBe("Pendiente");
    expect(datos.pedidos).toHaveLength(1);
  });

  it("conserva el stock y el manifiesto cuando el pago es rechazado", () => {
    const { datos, pedido } = procesarCompra(datosBase(), entrega, false);

    expect(datos.productos[0].stock).toBe(2);
    expect(datos.carrito).toHaveLength(1);
    expect(pedido.estado).toBe("Rechazado");
  });

  it("lanza error si el manifiesto está vacío", () => {
    expect(() => procesarCompra({ ...datosBase(), carrito: [] }, entrega, true)).toThrow(
      "El manifiesto está vacío."
    );
  });
});