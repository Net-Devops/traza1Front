import { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import TarjetaAgregar from '../../element/tarjeta/TarjetaAgregar';
import { getSucursalId, Sucursal as sucursalInterface } from '../../../service/ServiceSucursal';
import imagenSucrusal from '../../../util/empresa.jpeg';
const { Meta } = Card;

const Sucursal = () => {
  const [sucursales, setSucursales] = useState<sucursalInterface[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getSucursalId(Number(id))
      .then((response) => {
        console.log(response); // Verifica la respuesta
        setSucursales(response);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setSucursales([]); // Asegúrate de que el estado se establece en un array vacío en caso de error
      });
  }, [id]);

  return (
    <div>
      <h1>Sucursales</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {Array.isArray(sucursales) && sucursales.map(sucursal => (
          <Card
            key={sucursal.id}
            style={{ width: 300, margin: '10px' }}
            cover={
              <img
                alt={sucursal.nombre}
                src={imagenSucrusal}
              />
            }
            actions={[
              <DeleteOutlined key="delete" />,
              <EditOutlined key="edit" />,
            ]}
            onClick={() => navigate(`/Sucursal/${sucursal.id}`)}
          >
            <Meta
              title={sucursal.nombre}
              description={sucursal.horaApertura}
            />
          </Card>
        ))}
        <TarjetaAgregar />
      </div>
    </div>
  );
}

export default Sucursal;
