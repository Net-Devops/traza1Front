import { useEffect, useState } from "react";
import { Select } from "antd";

import { getSucursal } from "../../../service/ServiceSucursal";
import { getEmpresas } from "../../../service/ServiceEmpresa";
import { Sucursal } from "../../../service/ServiceSucursal";
import { Empresas } from "../../../service/ServiceEmpresa";

const { Option } = Select;

const Promociones = () => {
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    const fetchSucursales = async () => {
      if (selectedEmpresa) {
        const sucursalesData = await getSucursal(selectedEmpresa);
        setSucursales(sucursalesData);
      }
    };

    fetchSucursales();
  }, [selectedEmpresa]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1>PROMOCIONES</h1>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "10px 0",
          }}
        >
          <Select
            placeholder="Seleccione una empresa"
            style={{ width: 200 }}
            onChange={(value) => setSelectedEmpresa(value)}
          >
            {empresas.map((empresa) => (
              <Option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Seleccione una sucursal"
            style={{ width: 200 }}
            disabled={!selectedEmpresa}
            onChange={(value) => console.log("Sucursal seleccionada:", value)}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div></div>
    </div>
  );
};
export default Promociones;
