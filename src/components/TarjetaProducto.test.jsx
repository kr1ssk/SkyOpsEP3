import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import TarjetaProducto from "./TarjetaProducto.jsx";

function renderizar(producto, onAgregar = () => {}) {
  return render(
    <MemoryRouter>
      <TarjetaProducto producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  );
}

function bomba(cambios = {}) {
  return {
    id: "p1",
    nombre: "Bomba hidráulica",
    pn: "PN-29-1",
    categoria: "ATA 29",
    precio: 100000,
    descuento: 0,
    stock: 4,
    imagen: "",
    ...cambios,
  };
}

describe("TarjetaProducto", () => {
  it("muestra el nombre, el número de parte y la categoría recibidos por props", () => {
    renderizar(bomba());

    expect(screen.getByRole("heading", { name: "Bomba hidráulica" })).toBeInTheDocument();
    expect(screen.getByText("PN-29-1")).toBeInTheDocument();
    expect(screen.getByText("ATA 29")).toBeInTheDocument();
  });

  it("muestra el stock disponible", () => {
    renderizar(bomba({ stock: 7 }));
    expect(screen.getByText("Stock: 7")).toBeInTheDocument();
  });

  it("no muestra la insignia de oferta cuando el descuento es 0", () => {
    renderizar(bomba({ descuento: 0 }));
    expect(screen.queryByText(/Oferta/)).not.toBeInTheDocument();
  });

  it("muestra la insignia de oferta y el precio tachado cuando hay descuento", () => {
    renderizar(bomba({ descuento: 15 }));
    expect(screen.getByText("Oferta 15%")).toBeInTheDocument();
  });

  it("deshabilita el botón Agregar cuando el producto no tiene stock", () => {
    renderizar(bomba({ stock: 0 }));
    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();
  });

  it("llama a onAgregar con el id del producto al hacer clic", async () => {
    const onAgregar = vi.fn();
    const user = userEvent.setup();

    renderizar(bomba(), onAgregar);
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith("p1");
  });

  it("no llama a onAgregar si el botón está deshabilitado por falta de stock", async () => {
    const onAgregar = vi.fn();
    const user = userEvent.setup();

    renderizar(bomba({ stock: 0 }), onAgregar);
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(onAgregar).not.toHaveBeenCalled();
  });
});