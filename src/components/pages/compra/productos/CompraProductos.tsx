import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductosPorCategoria } from "../../../../service/Compra";
import DetalleProducto from "./DetalleProducto";
import Carrito from "../Carrito";
import { Producto } from "../../../../types/compras/interface";
import { Card, Button } from "antd";
import { useAppDispatch } from "../../../../redux/hooks";
import { addToCarrito } from "../../../../redux/slice/Carrito.slice";
const CompraProductos = () => {
  const dispatch = useAppDispatch();
  const { categoriaId } = useParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

  const [pedidoRealizado] = useState(false); // Nuevo estado

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductosPorCategoria(Number(categoriaId));
      setProductos(data);
    };
    fetchData();
  }, [categoriaId]);

  const verDetalle = (producto: Producto) => {
    setSelectedProducto(producto);
  };

  const cerrarDetalle = () => {
    setSelectedProducto(null);
  };

  const agregarAlCarrito = (producto: Producto) => {
    if (pedidoRealizado) return;

    dispatch(addToCarrito({ id: producto.id, producto, cantidad: 1 }));
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <h1>Productos</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {productos.map((producto) => (
            <Card key={producto.id} style={{ width: 300 }}>
              <Card.Meta title={producto.denominacion} />
              <Button type="primary" onClick={() => verDetalle(producto)}>
                Ver detalles
              </Button>
              <Button type="primary" onClick={() => agregarAlCarrito(producto)}>
                Agregar al carrito
              </Button>
            </Card>
          ))}
        </div>
        {selectedProducto && (
          <DetalleProducto
            producto={selectedProducto}
            onClose={cerrarDetalle}
          />
        )}
      </div>
      <Carrito />
    </div>
  );
};

export default CompraProductos;
