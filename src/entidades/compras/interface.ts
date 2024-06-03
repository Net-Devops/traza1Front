export interface Producto {
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

export interface PedidoDetalle {
  id?: number;
  producto: Producto;
  cantidad: number;
}

export interface Pedido {
  id?: number;
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
