import React, { useEffect, useState } from "react";
import { PedidoDetalle } from "../../../entidades/compras/interface";
import CheckoutMP from "../../mercadoPago/CheckoutMP";

interface CarritoProps {
  carrito: PedidoDetalle[];
  quitarDelCarrito: (productoId: number) => void;
  realizarCompra: () => void;
  limpiarCarrito: () => void;
  preferenceId: string | null;
  pedidoRealizado: boolean;
}

const Carrito: React.FC<CarritoProps> = ({
  carrito,
  quitarDelCarrito,
  realizarCompra,
  limpiarCarrito,
  preferenceId,
  pedidoRealizado,
}) => {
  const [carritos, setCarritos] = useState<PedidoDetalle[]>(() => {
    // Intenta cargar el carrito desde el almacenamiento local cuando se inicializa el estado
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Sincronizar carritos con carrito prop cuando cambie
  useEffect(() => {
    if (carrito.length > 0) {
      setCarritos(prevCarritos => {
        // Combina el estado previo del carrito con los nuevos elementos del carrito
        const nuevoCarrito = [...prevCarritos];
        carrito.forEach(detalle => {
          const index = nuevoCarrito.findIndex(item => item.producto.id === detalle.producto.id);
          if (index !== -1) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            nuevoCarrito[index].cantidad += detalle.cantidad;
          } else {
            // Si el producto no está en el carrito, lo agrega
            nuevoCarrito.push(detalle);
          }
        });
        return nuevoCarrito;
      });
    }
  }, [carrito]);

  // Almacenar carrito en localStorage en cada renderizado
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carritos));
  }, [carritos]);

  const quitarProducto = (productoId: number) => {
    quitarDelCarrito(productoId);
    const nuevoCarrito = carritos.filter(item => item.producto.id !== productoId);
    setCarritos(nuevoCarrito);
  };

  const realizarCompraConLimpieza = () => {
    realizarCompra();
    // Aquí no se limpia el carrito
  };

  const limpiarCarritoConLimpieza = () => {
    limpiarCarrito();
    setCarritos([]);
    localStorage.removeItem('carrito');
  };

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
      {carritos.map((detalle) => {
        const subtotal = detalle.producto.precioVenta * detalle.cantidad; // Calcula el subtotal aquí
        return (
          <div key={detalle.producto.id}>
            {detalle.producto.denominacion} - Cantidad: {detalle.cantidad} -
            Subtotal: {subtotal}
            {!preferenceId && !pedidoRealizado && (
              <button onClick={() => quitarProducto(detalle.producto.id)}>
                Quitar
              </button>
            )}
          </div>
        );
      })}
      <div>
        Total:{" "}
        {carritos.reduce(
          (total, detalle) =>
            total + detalle.producto.precioVenta * detalle.cantidad,
          0
        )}
      </div>{" "}
      {!preferenceId && !pedidoRealizado && (
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: "1em" }}
        >
          <button onClick={limpiarCarritoConLimpieza}>Limpiar carrito</button>
          <button onClick={realizarCompraConLimpieza} style={{ marginTop: "1em" }}>
            Realizar pedido
          </button>
        </div>
      )}
      {preferenceId && <CheckoutMP preferenceId={preferenceId} />}
    </div>
  );
};

export default Carrito;
