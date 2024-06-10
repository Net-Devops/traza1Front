import { Card, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  removeToCarrito,
  incrementarCantidad,
  decrementarCantidad,
  limpiarCarrito,
  enviarPedido,
} from "../../../redux/slice/Carrito.slice";
import { useState } from "react";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import CheckoutMP from "../../mercadoPago/CheckoutMP";

const Carrito = () => {
  const dispatch = useAppDispatch();
  const carrito = useAppSelector((state) => state.cartReducer);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [pedidoRealizado, setPedidoRealizado] = useState(false);

  const quitarDelCarrito = (productoId: number) => {
    dispatch(removeToCarrito({ id: productoId }));
  };

  const incrementar = (productoId: number) => {
    dispatch(incrementarCantidad({ id: productoId }));
  };

  const decrementar = (productoId: number) => {
    dispatch(decrementarCantidad({ id: productoId }));
  };

  const limpiar = () => {
    dispatch(limpiarCarrito());
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precioVenta * item.cantidad,
    0
  );
  const handleEnviarPedido = async () => {
    try {
      const resultAction = await dispatch(enviarPedido());
      const preferenceId = unwrapResult(resultAction);

      setPreferenceId(preferenceId);
      toast.success("Pedido realizado con éxito. Ahora realiza el pago.");
      setPedidoRealizado(true);
    } catch (err) {
      console.error("Error al realizar el pedido", err);
      toast.error("Error al realizar el pedido.");
    }
  };

  return (
    <div>
      <h1>Carrito</h1>
      {carrito.map((item) => {
        const subtotal = item.producto.precioVenta * item.cantidad;
        return (
          <Card key={item.id} style={{ width: 300 }}>
            <Card.Meta
              title={item.producto.denominacion}
              description={`Cantidad: ${item.cantidad}, Precio: ${item.producto.precioVenta}, Subtotal: ${subtotal}`}
            />
            {!pedidoRealizado && (
              <>
                <Button type="primary" onClick={() => incrementar(item.id)}>
                  Incrementar cantidad
                </Button>
                <Button type="primary" onClick={() => decrementar(item.id)}>
                  Decrementar cantidad
                </Button>
                <Button
                  type="primary"
                  onClick={() => quitarDelCarrito(item.id)}
                >
                  Quitar del carrito
                </Button>
              </>
            )}
          </Card>
        );
      })}
      <h2>Total: {total}</h2>
      {!pedidoRealizado && (
        <>
          <Button type="primary" onClick={limpiar}>
            Limpiar carrito
          </Button>
          <Button type="primary" onClick={handleEnviarPedido}>
            Realizar pedido
          </Button>
        </>
      )}
      {preferenceId && <CheckoutMP preferenceId={preferenceId} />}
    </div>
  );
};

export default Carrito;
