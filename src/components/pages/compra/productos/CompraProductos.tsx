import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductosPorCategoria } from "../../../../service/Compra";
import DetalleProducto from "./DetalleProducto";

interface Producto {
  id: number;
  denominacion: string;
  // Agrega aquí las demás propiedades de un producto
}

interface DetallePedido {
  producto: Producto;
  cantidad: number;
}

interface Pedido {
  detalles: DetallePedido[];
  // Agrega aquí las demás propiedades de un pedido
}

const CompraProductos = () => {
  const { categoriaId } = useParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [carrito, setCarrito] = useState<DetallePedido[]>([]);
  const [pedido, setPedido] = useState<Pedido | null>(null);

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
    const detallePedidoEnCarrito = carrito.find(
      (detalle) => detalle.producto.id === producto.id
    );

    if (detallePedidoEnCarrito) {
      // Si el producto ya está en el carrito, incrementa la cantidad
      setCarrito(
        carrito.map((detalle) =>
          detalle.producto.id === producto.id
            ? { ...detalle, cantidad: detalle.cantidad + 1 }
            : detalle
        )
      );
    } else {
      // Si el producto no está en el carrito, lo agrega con cantidad = 1
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (productoId: number) => {
    const detallePedidoEnCarrito = carrito.find(
      (detalle) => detalle.producto.id === productoId
    );

    if (detallePedidoEnCarrito && detallePedidoEnCarrito.cantidad > 1) {
      // Si la cantidad del producto en el carrito es mayor a 1, decrementa la cantidad
      setCarrito(
        carrito.map((detalle) =>
          detalle.producto.id === productoId
            ? { ...detalle, cantidad: detalle.cantidad - 1 }
            : detalle
        )
      );
    } else {
      // Si la cantidad del producto en el carrito es 1, lo quita del carrito
      setCarrito(
        carrito.filter((detalle) => detalle.producto.id !== productoId)
      );
    }
  };

  const finalizarCompra = () => {
    // Aquí puedes agregar la lógica para finalizar la compra
    // Por ejemplo, puedes crear un Pedido con los detalles del carrito
    setPedido({ detalles: carrito });
    // Y luego vaciar el carrito
    setCarrito([]);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <h1>Productos</h1>
        <div>
          {productos.map((producto) => (
            <div key={producto.id}>
              {producto.denominacion}
              <button onClick={() => verDetalle(producto)}>Ver detalles</button>
              <button onClick={() => agregarAlCarrito(producto)}>
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
        {selectedProducto && (
          <DetalleProducto
            producto={selectedProducto}
            onClose={cerrarDetalle}
          />
        )}
      </div>
      <div
        style={{
          marginLeft: "2em",
          border: "1px solid black",
          padding: "1em",
          borderRadius: "10px",
        }}
      >
        <h2>Carrito</h2>
        {carrito.map((detalle) => (
          <div key={detalle.producto.id}>
            {detalle.producto.denominacion} - Cantidad: {detalle.cantidad}
            <button onClick={() => quitarDelCarrito(detalle.producto.id)}>
              Quitar
            </button>
          </div>
        ))}
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: "1em" }}
        >
          <button onClick={() => setCarrito([])}>Limpiar carrito</button>
          <button onClick={finalizarCompra} style={{ marginTop: "1em" }}>
            Realizar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraProductos;
