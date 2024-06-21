

export interface Imagen {
    id: number;
    url: string;
}

export interface unidadMedida {
    id: number;
    denominacion: string;
}
export interface sucursal {
    id: number;
    nombre: string;
}
export interface ArticuloInsumo {
    id: number;
    denominacion: string;
    codigo: string;
    precioCompra: number;
    precioVenta: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;
    imagenes: Imagen[];
    unidadMedida: unidadMedida;
}

export interface ArticuloManufacturadoDetalle {
    id: number;
    cantidad: number;
    articuloInsumo: ArticuloInsumo;
}

export interface ArticuloProducto {
    id: number;
    denominacion: string;
    descripcion?: string;
    codigo: string;
    precioVenta: number;
    imagenes: Imagen[];
    unidadMedida: unidadMedida;
    tiempoEstimadoCocina?: number;
    preparacion?: string;
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
    sucursal: sucursal
}


export async function crearManufacturado(formData: ArticuloProducto) {
    console.log("estoy en el crearManufacturado");
    
    try {
        console.log("estoy en el fetch");

        console.log(formData);

        const urlServer = "http://localhost:8080/api/articulos/manufacturados/";
        const response = await fetch(urlServer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            body: JSON.stringify({
                codigo: 'M-' + formData.codigo,
                denominacion: formData.denominacion,
                descripcion: formData.descripcion || "sin descripcion",
                precioVenta: formData.precioVenta,
                imagenes: formData.imagenes,
                unidadMedida: formData.unidadMedida,
                tiempoEstimadoMinutos: formData.tiempoEstimadoCocina || 0,
                preparacion: formData.preparacion || "sin preparacion",
                sucursal: formData.sucursal,
                articuloManufacturadoDetalles: formData.articuloManufacturadoDetalles
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }
}

export async function deleteProductoXId(id: string) {
    const urlServer = "http://localhost:8080/api/articulos/manufacturados/" + id;
    await fetch(urlServer, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });
  }


  export async function getProductoXSucursal(id: string) {
    const urlServer = "http://localhost:8080/api/local/articulo/manufacturado/sucursal/"+id;
    console.log(urlServer);
    const response = await fetch(urlServer, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });
  
    return await response.json();
  }