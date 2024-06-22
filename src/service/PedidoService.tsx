const API_BASE_URL = "http://localhost:8080/api/pedidos";

export interface Pedido {
  id?: number;
  total: number;
  estado: Estado;
  fechaPedido: Date;
  hora: string;
  domicilio: Domicilio;
  cliente: Cliente;
  pedidoDetalle: PedidoDetalle[];
}
export enum Estado {
  PENDIENTE = "PENDIENTE",
  CONFIRMADO = "CONFIRMADO",
  EN_PREPARACION = "EN_PREPARACION",
  ENVIADO = "ENVIADO",
  ENTREGADO = "ENTREGADO",
  CANCELADO = "CANCELADO",
}
export interface Domicilio {
  calle?: string;
  numero?: string;
  localidad?: Localidad;
  cp?: number;
}
export interface Localidad {
  nombre?: string;
  provincia?: Provincia;
}
export interface Provincia {
  nombre?: string;
}

export interface Cliente {
  id?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
}
export interface PedidoDetalle {
  id?: number;
  cantidad?: number;
  articulo: Articulo;
}
export interface Articulo {}

export const fetchPedidos = async (sucursalId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/traer-lista/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener los pedidos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
};

export const cambiarEstadoPedido = async (
  id: number,
  nuevoEstado: Estado
): Promise<Pedido> => {
  try {
    const response = await fetch(`${API_BASE_URL}/estado/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: nuevoEstado, // Enviar solo el valor del estado
    });
    if (!response.ok) {
      throw new Error("Error al cambiar el estado del pedido");
    }
    const data: Pedido = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
};