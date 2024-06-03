import React from "react";
import { PedidoDetalle } from "../../../entidades/compras/interface";

interface CarritoProps {
  carrito: PedidoDetalle[];
  quitarDelCarrito: (productoId: number) => void;
  realizarCompra: () => void;
  limpiarCarrito: () => void;
}

const Carrito: React.FC<CarritoProps> = ({
  carrito,
  quitarDelCarrito,
  realizarCompra,
  limpiarCarrito,
}) => {
  return (
    <div
      style={{
        marginLeft: "2em",
        border: "1px solid black",
        padding: "1em",
        borderRadius: "10px",
      }}
    >
      <h2>Carrito</h2>
      {carrito.map((detalle) => {
        const subtotal = detalle.producto.precioVenta * detalle.cantidad; // Calcula el subtotal aquí
        return (
          <div key={detalle.producto.id}>
            {detalle.producto.denominacion} - Cantidad: {detalle.cantidad} -
            Subtotal: {subtotal}
            <button onClick={() => quitarDelCarrito(detalle.producto.id)}>
              Quitar
            </button>
          </div>
        );
      })}
      <div>
        Total:{" "}
        {carrito.reduce(
          (total, detalle) =>
            total + detalle.producto.precioVenta * detalle.cantidad,
          0
        )}
      </div>{" "}
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "1em" }}
      >
        <button onClick={limpiarCarrito}>Limpiar carrito</button>
        <button onClick={realizarCompra} style={{ marginTop: "1em" }}>
          Realizar pedido
        </button>
      </div>
    </div>
  );
};

export default Carrito;
