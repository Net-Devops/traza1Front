import  { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import TarjetaAgregar from '../../element/tarjeta/TarjetaAgregar';
import { getEmpresas, Empresas as EmpresasInterface } from '../../../service/ServiceEmpresa';
import imagenEmpresa from '../../../util/empresa.jpeg';
const { Meta } = Card;

const Empresa = () => {
  const [empresas, setEmpresas] = useState<EmpresasInterface[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getEmpresas().then(setEmpresas);
  }, []);

  return (
    <div>
      <h1>Empresa</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {empresas.map((empresa) => (
          <Card
            key={empresa.id}
            style={{ width: 300, margin: '10px' }}
            cover={
              <img
                alt={empresa.nombre}
                src={imagenEmpresa}
              />
            }
            actions={[
              <DeleteOutlined key="delete" />,
              <EditOutlined key="edit" />,
            ]}
            onClick={() => navigate(`/sucursal/${empresa.id}`)}
          >
            <Meta
              title={empresa.nombre}
              description={empresa.razonSocial}
            />
          </Card>
        ))}
        <TarjetaAgregar />
      </div>
    </div>
  );
}
export default Empresa;