export interface Imagen {
    id: number;
    url: string;
}

export interface unidadMedida {
    id: number;
    denominacion: string;
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
    tiempoEstimadoMinutos?: number;
    preparacion?: string;
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
}


export async function crearManufacturado(formData: ArticuloProducto) {
    console.log("estoy en el crearInsumo");
    
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
                tiempoEstimadoMinutos: formData.tiempoEstimadoMinutos || 0,
                preparacion: formData.preparacion || "sin preparacion",
                articuloManufacturadoDetalles: Array.isArray(formData.articuloManufacturadoDetalles) ? formData.articuloManufacturadoDetalles : [formData.articuloManufacturadoDetalles]
                
            }),
        });

        if (!response.ok) {
            // throw new Error(HTTP error! status: ${response.status});
        }
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
}
