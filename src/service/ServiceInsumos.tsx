
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

export interface Imagen {
    id: number;
    url: string;
}
export interface unidadMedida {
    id: number;
    denominacion: string;
}

export const getUnidadMedida = async (): Promise<unidadMedida[]> => {
    const endpoint = "http://localhost:8080/api/unidad-medida/";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
    });
    console.log(response);
    return await response.json();
};

export const getArticulosInsumos = async (): Promise<ArticuloInsumo[]> => {
    const endpoint = "http://localhost:8080/api/articulos/insumos/";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
    });
    console.log(response);
    return await response.json();
};


export async function crearInsumo(formData: ArticuloInsumo) {
    console.log("estoy en el crearInsumo");
    
    try {
        console.log("estoy en el fetch");

        console.log(formData);

        const urlServer = "http://localhost:8080/api/articulos/insumos/";
        const response = await fetch(urlServer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            body: JSON.stringify({
                codigo: formData.codigo,
                denominacion: formData.denominacion,
                precioCompra: formData.precioCompra,
                precioVenta: formData.precioVenta,
                stockActual: formData.stockActual,
                stockMaximo: formData.stockMaximo,
                esParaElaborar: formData.esParaElaborar,
                imagenes: formData.imagenes,
                unidadMedida: formData.unidadMedida,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function modificarInsumoId(formData: any, id: number) {
    try {
        console.log("estoy en el fetc");
        console.log("data"+formData);
        console.log("id:"+id);
        
        
        
        const urlServer = `http://localhost:8080/api/articulos/insumos/${id}`;
        const response = await fetch(urlServer, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            body: JSON.stringify({
                id: id,
                codigo: formData.codigo,
                denominacion: formData.denominacion,
                precioCompra: formData.precioCompra,
                precioVenta: formData.precioVenta,
                stockActual: formData.stockActual,
                stockMaximo: formData.stockMaximo,
                esParaElaborar: formData.esParaElaborar,
                imagenes: formData.uploadImagenes,
                unidadMedida: formData.unidadMedida,
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


export async function getInsumoXId(id: string) {
    const urlServer = "http://localhost:8080/api/articulos/insumos/"+id;
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

  export async function deleteInsumoXId(id: string) {
    const urlServer = "http://localhost:8080/api/articulos/insumos/" + id;
    await fetch(urlServer, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });
  }