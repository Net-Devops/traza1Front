import React from "react";
import { PedidoDetalle } from "../../../entidades/compras/interface";
import CheckoutMP from "../../mercadoPago/CheckoutMP";

interface CarritoProps {
  carrito: PedidoDetalle[];
  quitarDelCarrito: (productoId: number) => void;
  realizarCompra: () => void;
  limpiarCarrito: () => void;
  preferenceId: string | null;
}

const Carrito: React.FC<CarritoProps> = ({
  carrito,
  quitarDelCarrito,
  realizarCompra,
  limpiarCarrito,
  preferenceId,
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
            {!preferenceId && (
              <button onClick={() => quitarDelCarrito(detalle.producto.id)}>
                Quitar
              </button>
            )}
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
      {!preferenceId && (
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: "1em" }}
        >
          <button onClick={limpiarCarrito}>Limpiar carrito</button>
          <button onClick={realizarCompra} style={{ marginTop: "1em" }}>
            Realizar pedido
          </button>
        </div>
      )}
      {preferenceId && <CheckoutMP preferenceId={preferenceId} />}
    </div>
  );
};

export default Carrito;
