import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductosPorCategoria } from "../../../../service/Compra";
import DetalleProducto from "./DetalleProducto";
import { realizarPedido, Pedido } from "../../../../service/Compra"; // Asegúrate de reemplazar esto con la ruta correcta a tu función realizarPedido
import Carrito from "../Carrito";
import {
  PedidoDetalle,
  Producto,
} from "../../../../entidades/compras/interface";

const CompraProductos = () => {
  const { categoriaId } = useParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [carrito, setCarrito] = useState<PedidoDetalle[]>([]);

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

  const realizarCompra = async () => {
    // Preparar el pedido a partir del carrito
    const detalles = carrito.map((detalle) => ({
      productoId: detalle.producto.id,
      cantidad: detalle.cantidad,
      producto: detalle.producto,
    }));

    const pedido: Pedido = {
      hora: "10:00", // Reemplaza esto con la hora actual
      total: carrito.reduce(
        (total, detalle) =>
          total + detalle.cantidad * detalle.producto.precioVenta,
        0
      ), // Asume que Producto tiene una propiedad 'precio'
      TotalCostoProduccion: 0, // Reemplaza esto con el costo de producción total
      //estado: "pendiente", // Asume que este es un estado válido
      //formaPago: "tarjeta", // Asume que este es un método de pago válido
      //TipoEnvio: "normal", // Asume que este es un tipo de envío válido
      fechaPedido: new Date().toISOString(), // Fecha actual en formato ISO
      preferenceMPId: "", // Reemplaza esto con el ID de preferencia de MercadoPago
      sucursal: null, // Reemplaza esto con la sucursal correspondiente
      domicilio: null, // Reemplaza esto con el domicilio correspondiente
      cliente: null, // Reemplaza esto con el cliente correspondiente
      pedidoDetalle: detalles, // Detalles del pedido
      factura: null, // Reemplaza esto con la factura correspondiente
    }; // Asegúrate de agregar aquí cualquier otra propiedad que necesite el pedido

    // Llamar a la función realizarPedido
    const data = await realizarPedido(pedido);

    // Manejar la respuesta
    if (data) {
      console.log("Pedido realizado con éxito:", data);
      setCarrito([]); // Vaciar el carrito
    } else {
      console.error("Error al realizar el pedido");
    }
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
      <Carrito
        carrito={carrito}
        quitarDelCarrito={quitarDelCarrito}
        realizarCompra={realizarCompra}
        limpiarCarrito={() => setCarrito([])}
      />
    </div>
  );
};

export default CompraProductos;
