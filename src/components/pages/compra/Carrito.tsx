import { useState } from "react";
import { Card, Button, InputNumber, Avatar, Radio, Modal } from "antd";
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
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import CheckoutMP from "../../mercadoPago/CheckoutMP";
import { TipoEnvio, Domicilio } from "../../../types/compras/interface";
import DireccionForm from "./formulario/DireccionForm";

const Carrito = () => {
  const imagenPorDefecto = "http://localhost:8080/images/sin-imagen.jpg";
  const dispatch = useAppDispatch();
  const carrito = useAppSelector((state) => state.cartReducer);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [metodoEntrega, setMetodoEntrega] = useState<TipoEnvio>(
    TipoEnvio.RETIRO_LOCAL
  );
  const [direccionEnvio, setDireccionEnvio] = useState<Domicilio | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    if (metodoEntrega === TipoEnvio.DELIVERY && !direccionEnvio) {
      toast.error("Por favor, ingresa una dirección de envío.");
      return;
    }
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

  const handleMetodoEntregaChange = (e: any) => {
    if (pedidoRealizado) {
      return; // Evita cambiar el método de entrega si ya se realizó el pedido
    }

    const metodo = e.target.value;
    setMetodoEntrega(metodo);

    if (metodo === TipoEnvio.DELIVERY) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };

  const handleModalOk = (values: Domicilio) => {
    setDireccionEnvio(values);
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setMetodoEntrega(TipoEnvio.RETIRO_LOCAL);
    setModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Carrito</h1>
      {carrito.map((item) => {
        const subtotal = item.producto.precioVenta * item.cantidad;
        const imagenAMostrar =
          item.producto.imagenes.length > 0
            ? "http://localhost:8080/images/" + item.producto.imagenes[0].url
            : imagenPorDefecto;
        return (
          <Card key={item.id} style={{ width: 300, marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Card.Meta
                avatar={<Avatar src={imagenAMostrar} />}
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
                      disabled={pedidoRealizado}
                    />
                    <br />
                    Subtotal: {subtotal}
                  </>
                }
              />
              <p>Precio: ${item.producto.precioVenta}</p>
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
      <Radio.Group
        onChange={handleMetodoEntregaChange}
        value={metodoEntrega}
        style={{ marginBottom: "10px" }}
        disabled={pedidoRealizado} // Evita que se cambie el valor si el pedido está realizado
      >
        <Radio value={TipoEnvio.RETIRO_LOCAL}>Retiro en Local</Radio>
        <Radio value={TipoEnvio.DELIVERY}>Envío a Domicilio</Radio>
      </Radio.Group>
      {direccionEnvio && metodoEntrega === TipoEnvio.DELIVERY && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Dirección de Envío:</h3>
          <p>
            calle: {direccionEnvio.calle}, Numero:{direccionEnvio.numero},
            codigo postal: {direccionEnvio.cp}
          </p>
        </div>
      )}

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

      {pedidoRealizado && metodoEntrega === TipoEnvio.RETIRO_LOCAL && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Button type="primary">Pago en Efectivo</Button>
        </div>
      )}

      {preferenceId && <CheckoutMP preferenceId={preferenceId} />}
      <Modal
        title="Ingresar dirección de envío"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <DireccionForm
          initialValues={{ calle: "", numero: "", cp: 0 }}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default Carrito;
