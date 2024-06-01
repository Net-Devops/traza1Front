export interface Sucursal {
    id?: number;
    eliminado?: boolean;
    nombre: string;
    horaApertura: string;
    horaCierre: string;
    calle?: string;
    codigoPostal?:number;
    numero?: number;
    piso?:string;
    nroDepto?:number;
    localidad?:string;
    provincia?:string;
    pais?:string;
    imagen?:string;
    // Cambiado a string para que coincida con el formato de la API
    empresa?: Empresa;
    file?: File; // Añadido para manejar el archivo
}

export interface Empresa {
    id?: number;
    eliminado?: boolean;
    nombre?: string;
    razonSocial?: string;
    cuil?: number;
}

export const getSucursalId = async (id: number): Promise<Sucursal[]> => {
    console.log("----->" + id);

    const endpoint = `http://localhost:8080/api/sucursal/lista-sucursal/${id}`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
    });
    console.log(response);

    const sucursales: Sucursal[] = await response.json();
    return sucursales;
};

export async function crearSucursal(formData: Sucursal) {
    console.log("estoy en el crearEmpresa");
    
    try {
        console.log("estoy en el fetch");

        console.log(formData);

        const urlServer = "http://localhost:8080/api/sucursal/";

        // Crear un objeto FormData
        const data = new FormData();
        data.append('nombre', formData.nombre || ''); // Provide a default value of an empty string
        data.append('horaApertura', formData.horaApertura);
        data.append('horaCierre', formData.horaCierre);
        data.append('empresa', JSON.stringify({ id: formData.empresa?.id }));
        if (formData.file) {
            data.append('file', formData.file);
        }

        const response = await fetch(urlServer, {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            body: data, // Enviar el objeto FormData en lugar de un objeto JSON
        });

        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
}

export async function eliminarSucursal(id: string) {
    const urlServer = "http://localhost:8080/api/sucursal/" + id;
    await fetch(urlServer, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    });
}