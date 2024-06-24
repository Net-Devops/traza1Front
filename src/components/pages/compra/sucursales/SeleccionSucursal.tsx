import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerSucursalesActivas,
  Sucursal,
} from "../../../../service/ServiceSucursal";
import { Card } from "antd";

const SeleccionSucursal = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSucursales = async () => {
      const data = await obtenerSucursalesActivas();
      setSucursales(data);
    };
    fetchSucursales();
  }, []);

  const handleSeleccionar = (idSucursal: string) => {
    navigate(`/compra/categorias/${idSucursal}`);
  };

  return (
    <div>
      <h1>Selecciona una sucursal</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {sucursales.map((sucursal) => (
          <Card
            key={sucursal.id}
            style={{ width: 300, cursor: "pointer" }}
            onClick={() => handleSeleccionar(String(sucursal.id))}
            bordered={false}
          >
            <img
              src={
                sucursal.imagen ||
                "http://localhost:8080/images/sin-imagen-sucursal.png"
              } // Reemplaza "ruta/a/imagen/por/defecto.jpg" con la ruta real de tu imagen por defecto
              alt={`Sucursal ${sucursal.nombre}`}
              style={{ width: "100%", height: "auto" }}
            />
            <p> {sucursal.nombre}</p>
            <p>
              Hora: {sucursal.horaApertura} a {sucursal.horaCierre}
            </p>
            <p>
              Domicilio: {sucursal.calle} n°: {sucursal.numero}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeleccionSucursal;
