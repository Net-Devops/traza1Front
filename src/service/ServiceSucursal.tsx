export interface Sucursal {
    id?: number;
    nombre?: string;
    horaApertura?: string;
    horaCierre?: string; // Cambiado a string para que coincida con el formato de la API
    empresa?: Empresa;
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
        const response = await fetch(urlServer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            body: JSON.stringify({
                nombre: formData.nombre,
                horaApertura: formData.horaApertura,
                horaCierre: formData.horaCierre,
                empresa: {
                    id: formData.empresa?.id,
                },
            }),
        });

        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
}