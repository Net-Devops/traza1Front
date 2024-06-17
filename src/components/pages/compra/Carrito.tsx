import { Card, Button, InputNumber } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  removeToCarrito,
  incrementarCantidad,
  decrementarCantidad,
  limpiarCarrito,
  enviarPedido,
  cambiarCantidad,
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

  const cambiarCantidadProducto = (productoId: number, cantidad: number) => {
    dispatch(cambiarCantidad({ id: productoId, cantidad }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Carrito</h1>
      {carrito.map((item) => {
        const subtotal = item.producto.precioVenta * item.cantidad;
        return (
          <Card key={item.id} style={{ width: 300, marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Card.Meta
                title={item.producto.denominacion}
                description={
                  <>
                    Cantidad:
                    <InputNumber
                      min={1}
                      value={item.cantidad}
                      onChange={(value) =>
                        cambiarCantidadProducto(item.id, value ?? 0)
                      }
                      disabled={pedidoRealizado} // Deshabilita el input si el pedido ha sido realizado
                    />
                    <br />
                    Subtotal: {subtotal}
                  </>
                }
              />
              <p>Precio: {item.producto.precioVenta}</p>
            </div>
            {!pedidoRealizado && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  <Button
                    type="primary"
                    icon={<MinusOutlined />}
                    onClick={() => decrementar(item.id)}
                    style={{ marginRight: "5px" }}
                  />

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => incrementar(item.id)}
                  />
                </div>
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => quitarDelCarrito(item.id)}
                />
              </div>
            )}
          </Card>
        );
      })}
      <h2 style={{ textAlign: "center" }}>Total: {total}</h2>
      {!pedidoRealizado && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={limpiar}
          >
            Limpiar carrito
          </Button>
          <Button type="primary" onClick={handleEnviarPedido}>
            Realizar pedido
          </Button>
        </div>
      )}
      {preferenceId && <CheckoutMP preferenceId={preferenceId} />}
    </div>
  );
};

export default Carrito;
