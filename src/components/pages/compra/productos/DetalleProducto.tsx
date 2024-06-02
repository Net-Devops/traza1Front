import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducto } from "../../../../service/Compra";
import { Modal, Button } from "antd";

interface DetalleProductoProps {
  productoId: number;
  onClose: () => void;
}

const DetalleProducto: React.FC<DetalleProductoProps> = ({
  productoId,
  onClose,
}) => {
  const [producto, setProducto] = useState({
    denominacion: "",
    descripcion: "",
    codigo: "",
    precioVenta: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducto(Number(productoId));
      setProducto(data);
    };
    fetchData();
  }, [productoId]);

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
      {/* Aquí puedes agregar más detalles del producto según sea necesario */}
    </Modal>
  );
};

export default DetalleProducto;
