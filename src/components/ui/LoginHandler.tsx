import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import EmpleadoService from "../../service/auth0Service/EmpleadoService";
import SucursalService from "../../service/auth0Service/SucursalService";
import { RolEmpleado } from "../../types/usuario/Usuario";

const LoginHandler: React.FC = () => {
  console.log("-----prueba1---->");
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  console.log("-----prueba2---->");
  const navigate = useNavigate();
  const empleadoService = new EmpleadoService();
  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchEmpleado = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const sucursalService = new SucursalService();
          const token = await getAccessTokenSilently();
          console.log(token);
          console.log("url:  " + url + user.email);
          const empleado = await empleadoService.getEmpleadoByEmail(
            `${url}`,
            user.email,
            token
          );

          console.log("--------->" + empleado.sucursal.id + " " + empleado.rol);
          if (empleado.rol === RolEmpleado.ADMINISTRADOR) {
            localStorage.setItem("rol", empleado.rol);
            localStorage.removeItem("sucursal_id");
            localStorage.removeItem("selectedSucursalNombre");
            navigate("/unidadMedida");
          } else if (
            empleado.rol === RolEmpleado.EMPLEADO_COCINA ||
            empleado.rol === RolEmpleado.EMPLEADO_REPARTIDOR
          ) {
            localStorage.removeItem("sucursal_id");
            localStorage.removeItem("selectedSucursalNombre");
            localStorage.setItem(
              "sucursal_id",
              empleado.sucursal.id.toString()
            );
            localStorage.setItem("rol", empleado.rol);
            const sucursal = await sucursalService.getById(
              `${import.meta.env.VITE_API_URL}`,
              empleado.sucursal.id,
              token
            );
            localStorage.setItem("selectedSucursalNombre", sucursal.nombre);
            navigate("/unidadMedida");
          } else if (!empleado) {
            navigate("/");
          }
        } catch (error) {
          console.error("Error al obtener el empleado:", error);
          navigate("/unidadMedida");
        }
      } else {
        navigate("/");
      }
    };

    fetchEmpleado();
  }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

  return <div>Cargando...</div>;
};

export default LoginHandler;
