export interface Promocion {
  id: number;
  denominacion: string;
  descripcionDescuento: string;
  // Añade aquí cualquier otra propiedad que tenga una promoción
}
export interface ArticuloManufacturado {
  id: number;
  denominacion: string;
  descripcion: string;
  precioVenta: number;
  imagenes: string[];
  codigo: string;
  // Añade aquí cualquier otra propiedad que tenga un artículo
}

export const promocionesPorSucursal = async (sucursalId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/local/promocion/sucursal/${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const PromocionDetalle = async (promocionId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/local/promocion/detalle/${promocionId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la promoción");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchArticulosManufacturados = async (sucursalId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/local/articulo/manufacturado/sucursal/${sucursalId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los artículos manufacturados");
    }
    const articulosManufacturados = await response.json();
    return articulosManufacturados;
  } catch (error) {
    console.error(error);
    return [];
  }
};
