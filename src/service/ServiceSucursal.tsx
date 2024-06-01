export interface Sucursal {
    id?: number;
    eliminado?: boolean;
    nombre: string;
    horaApertura: string;
    horaCierre: string;
    calle: string;
    cp: string;
    numero: string;
    piso: string;
    nroDepto: string;
    localidad: string;
    provincia: string;
    pais: string;
    imagen?: string; // Añadido opcional
    idEmpresa: string;
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
    console.log("estoy en el crearSucursal");

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
                calle: formData.calle,
                cp: formData.cp,
                numero: formData.numero,
                piso: formData.piso,
                nroDepto: formData.nroDepto,
                localidad: formData.localidad,
                provincia: formData.provincia,
                pais: formData.pais,
                idEmpresa: formData.idEmpresa
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
        throw error; // Asegurarse de propagar el error para que el componente pueda manejarlo
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
export async function activarSucursal(id: string) {
    const urlServer = "http://localhost:8080/api/sucursal/reactivate" + id;
    await fetch(urlServer, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
    });
}
