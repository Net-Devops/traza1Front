export interface Empleado {
    id: number;
    nombre?: string;
    apellido?: string;
    fechaNacimiento?: string;
    telefono?: string;
    rol?: string;
    imagen?: string;
    sucursales?: Sucursal[];
    eliminado?: boolean;
  }
  export interface Sucursal {
    id?: number;
    nombre?: string;
    eliminado?: boolean;
  }