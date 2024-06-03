import { useState } from "react";
import { Modal, Button } from "antd";

interface DetalleProductoProps {
  producto: any;
  onClose: () => void;
}

const DetalleProducto: React.FC<DetalleProductoProps> = ({
  producto,
  onClose,
}) => {
  if (!producto) {
    return <div>Cargando...</div>;
  }

  return (
    <Modal
      title={producto.denominacion}
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
    >
      <p>{producto.descripcion}</p>
      <p>Código: {producto.codigo}</p>
      <p>Precio de venta: {producto.precioVenta}</p>
      <p>Categoría: {producto.categoriaId}</p>
      <p>Sucursal: {producto.sucursalId}</p>

      {/* Aquí puedes agregar más detalles del producto según sea necesario */}
    </Modal>
  );
};

export default DetalleProducto;
