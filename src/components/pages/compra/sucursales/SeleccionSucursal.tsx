import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerSucursalesActivas,
  Sucursal,
} from "../../../../service/ServiceSucursal"; // Asumiendo que tienes una función para obtener las sucursales
import { Button, Select } from "antd";

const SeleccionSucursal = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSucursales = async () => {
      const data = await obtenerSucursalesActivas();
      setSucursales(data);
    };
    fetchSucursales();
  }, []);

  //   const handleSeleccionar = () => {
  //     navigate(`/compra/categorias`, {
  //       state: { sucursal: sucursalSeleccionada },
  //     });
  //   };

  const handleSeleccionar = () => {
    navigate(`/compra/categorias/${sucursalSeleccionada}`);
  };

  return (
    <div>
      <h1>Selecciona una sucursal</h1>
      <Select
        style={{ width: 200 }}
        placeholder="Selecciona una sucursal"
        onChange={(value) => setSucursalSeleccionada(value)}
      >
        {sucursales.map((sucursal) => (
          <Select.Option key={sucursal.id} value={sucursal.id}>
            {sucursal.nombre}
          </Select.Option>
        ))}
      </Select>
      <Button onClick={handleSeleccionar} disabled={!sucursalSeleccionada}>
        Continuar
      </Button>
    </div>
  );
};

export default SeleccionSucursal;
