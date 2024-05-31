import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card, Switch } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import TarjetaAgregar from "../../element/tarjeta/TarjetaAgregar";
import {
  eliminarSucursal,
  getSucursalId,
  Sucursal as sucursalInterface,
} from "../../../service/ServiceSucursal";
import imagenSucrusal from "../../../util/empresa.jpeg";
import { useSelector, useDispatch } from "react-redux";
import { EmpresaSlice } from "../../../redux/slice/empresa/EmpresaRedux";
const { Meta } = Card;

const Sucursal = () => {
  const empresa = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log(empresa);

  const [sucursales, setSucursales] = useState<sucursalInterface[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSwitchChange = async (checked, sucursalId, event) => {
    event.stopPropagation(); // Detener la propagación del clic
    // Aquí puedes llamar a una función para actualizar el estado eliminado en el backend
    if (checked) {
      await eliminarSucursal(sucursalId);
    }

    // Actualiza el estado local de la sucursal
    setSucursales((prevSucursales) =>
      prevSucursales.map((sucursal) =>
        sucursal.id === sucursalId ? { ...sucursal, eliminado: checked } : sucursal
      )
    );
  };

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

  const handleCardClick = (sucursal) => {
    if (sucursal.eliminado) {
      alert("Para ingresar a la sucursal, primero debes habilitarla.");
    } else {
      dispatch(EmpresaSlice.actions.setIdSucursal(sucursal.id || null));
      navigate("/productos");
    }
  };

  return (
    <div>
      <h1>Sucursales</h1>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {Array.isArray(sucursales) &&
          sucursales.map((sucursal) => (
            <Card
              key={sucursal.id}
              style={{ width: 300, margin: "10px", backgroundColor: sucursal.eliminado ? 'red' : 'white' }}
              onClick={() => handleCardClick(sucursal)}
              cover={<img alt={sucursal.nombre} src={imagenSucrusal} />}
              actions={[
                <Switch 
                  checked={sucursal.eliminado}
                  onChange={(checked, event) => handleSwitchChange(checked, sucursal.id, event)}
                  onClick={(e) => e.stopPropagation()} // Detener la propagación del clic
                />,
                <EditOutlined 
                  key="edit" 
                  disabled={sucursal.eliminado} 
                  onClick={(e) => {
                    e.stopPropagation(); // Detener la propagación del clic
                    // Agregar aquí el código para manejar la acción de edición
                  }}
                />,
              ]}
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
};

export default Sucursal;
