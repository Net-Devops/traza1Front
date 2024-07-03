import { useState, useEffect } from "react";
import { Button, Select } from "antd";
import TablaEmpleado from "../../element/tabla/TablaEmpleados";
import { getSucursal } from "../../../service/ServiceSucursal";
import { getEmpresas } from "../../../service/ServiceEmpresa";
import { Sucursal } from "../../../service/ServiceSucursal";
import { Empresas } from "../../../service/ServiceEmpresa";
import FormularioEmpleado from "../../element/formularios/FormularioEmpleado";

const { Option } = Select;

const Empleados = () => {
  const [showFormularioEmpleado, setShowFormularioEmpleado] = useState(false);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState("");

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

  const handleOpenFormularioEmpleado = () => {
    setShowFormularioEmpleado(true);
  };

  const closeFormularioEmpleado = () => {
    setShowFormularioEmpleado(false);
  };

  const handleFormSubmit = (values: any) => {
    // Implementa la lógica para manejar el envío del formulario
    console.log(values);
    closeFormularioEmpleado();
    // Aquí puedes agregar lógica para actualizar la lista de empleados automáticamente
    // Por ejemplo, si `TablaEmpleado` es capaz de manejar cambios en `sucursalId`, debería actualizar automáticamente
  };

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
        <h1>Empleados</h1>
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
            onChange={(value) => setSelectedSucursal(value)}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
        </div>
        {/* Botón para agregar empleado solo se muestra cuando ambos empresa y sucursal están seleccionados */}
        {selectedEmpresa && selectedSucursal && (
          <Button
            type="primary"
            onClick={handleOpenFormularioEmpleado}
            id={`empresa-${selectedEmpresa}-sucursal-${selectedSucursal}`}
          >
            Agregar Empleado
          </Button>
        )}
      </div>
      <FormularioEmpleado
        visible={showFormularioEmpleado}
        onClose={closeFormularioEmpleado}
        onSubmit={handleFormSubmit}
        initialValues={null}
        sucursalId={selectedSucursal}
      />
      <div>
        {selectedSucursal ? (
          <TablaEmpleado sucursalId={selectedSucursal} />
        ) : (
          <p>Por favor, seleccione la sucursal para ver los empleados.</p>
        )}
      </div>
    </div>
  );
};

export default Empleados;
