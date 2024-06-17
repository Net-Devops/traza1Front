import { useState } from 'react';
import { Button } from 'antd';
import FormularioInsumo from '../../element/formularios/FormularioInsumo';
import TablaInsumo from '../../element/tabla/TablaInsumo';

const Insumos = () => {
  const [showFormularioInsumo, setShowFormularioInsumo] = useState(false);

  const closeFormularioInsumo = () => {
    setShowFormularioInsumo(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Insumos</h1>
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