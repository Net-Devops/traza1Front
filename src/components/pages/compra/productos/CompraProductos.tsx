import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Paso 1
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
  const navigate = useNavigate(); // Paso 2
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

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
    dispatch(addToCarrito({ id: producto.id, producto, cantidad: 1 }));
  };

  const volverACategorias = () => {
    // Paso 3
    navigate(-1);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <Button
          onClick={volverACategorias}
          style={{ margin: "10px", alignSelf: "flex-start" }}
        >
          Volver a Categorías
        </Button>{" "}
        {/* Paso 4 y 5 */}
        <h1>Productos</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {productos.map((producto) => (
            <Card
              key={producto.id}
              style={{ width: 300 }}
              cover={
                <img
                  alt={producto.denominacion}
                  src={
                    producto.imagenes.length > 0
                      ? producto.imagenes[0]
                      : "http://localhost:8080/images/sin-imagen.jpg"
                  }
                />
              }
            >
              <Card.Meta
                title={producto.denominacion}
                description={
                  <>
                    <p>{producto.descripcion}</p>
                    <p
                      style={{ fontWeight: "bold", fontSize: "larger" }}
                    >{`Precio: $${producto.precioVenta}`}</p>
                    <br />
                  </>
                }
              />
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
