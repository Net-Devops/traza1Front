export interface Pedido {
  hora: string;
  total: number;
  TotalCostoProduccion: number;
  //estado: string;
  //formaPago: string;
  //TipoEnvio: string;
  fechaPedido: string;
  preferenceMPId: string;
  sucursal: any;
  domicilio: any;
  cliente: any;
  pedidoDetalle: PedidoDetalle[];
  factura: any;
}
interface PedidoDetalle {
  producto: Producto;
  cantidad: number;
}
interface Producto {
  id: number;
  denominacion: string;
  descripcion: string;
  codigo: string;
  precioVenta: number;
  categoria: any;
  sucursal: any;
  imagenes: [];
  // Agrega aquí las demás propiedades de un producto
}

export const getCategorias = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/categorias/traer-todo/"
    );
    if (!response.ok) {
      throw new Error("Error al obtener las categorías");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getProductosPorCategoria = async (categoriaId: number) => {
  console.log("--------------------" + categoriaId + "-------------------");
  try {
    const response = await fetch(
      `http://localhost:8080/api/compra/productos/${categoriaId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los productos por categoría");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getProducto = async (id: number) => {
  const response = await fetch("/buscar-articulo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }

  const data = await response.json();
  return data;
};

export const realizarPedido = async (pedido: Pedido) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/compra/productos/crear-pedido",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      }
    );

    if (!response.ok) {
      throw new Error("Error al realizar el pedido");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
