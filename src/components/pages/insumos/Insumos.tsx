import { useState, useEffect } from 'react';
import { Button, Select } from 'antd';
import FormularioInsumo from '../../element/formularios/FormularioInsumo';
import TablaInsumo from '../../element/tabla/TablaInsumo';
import { getSucursal } from '../../../service/ServiceSucursal';
import { getEmpresas} from '../../../service/ServiceEmpresa';
import {Sucursal} from '../../../service/ServiceSucursal';
import {Empresas} from '../../../service/ServiceEmpresa';

const { Option } = Select;

const Insumos = () => {
  const [showFormularioInsumo, setShowFormularioInsumo] = useState(false);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('');

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

  const closeFormularioInsumo = () => {
    setShowFormularioInsumo(false);
  };

  return (
    <div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
    <h1>Insumos</h1>
    <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: '20px', margin: '10px 0' }}>
      <Select
        placeholder="Seleccione una empresa"
        style={{ width: 200 }}
        onChange={(value) => setSelectedEmpresa(value)}
      >
        {empresas.map((empresa) => (
          <Option key={empresa.id} value={empresa.id}>{empresa.nombre}</Option>
        ))}
      </Select>
      <Select
        placeholder="Seleccione una sucursal"
        style={{ width: 200 }}
        disabled={!selectedEmpresa}
        onChange={(value) => console.log('Sucursal seleccionada:', value)}
      >
        {sucursales.map((sucursal) => (
          <Option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</Option>
        ))}
      </Select>
    </div>
    <Button type="primary" onClick={() => setShowFormularioInsumo(true)}>
      Agregar Insumo
    </Button>
  </div>
  {showFormularioInsumo && <FormularioInsumo onClose={closeFormularioInsumo} />}
  <div>
    <TablaInsumo />
  </div>
</div>
  );
}

export default Insumos;