import { useState, useEffect } from "react";
import { EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Card, Switch, Modal, Row, Col, Carousel } from "antd"; // Importa Carousel de Ant Design
import { useNavigate, useParams } from "react-router-dom";
import TarjetaAgregar from "../../element/tarjeta/TarjetaAgregar";
import {
  eliminarSucursal,
  getSucursalId,
  Sucursal as sucursalInterface,
} from "../../../service/ServiceSucursal";
import imagenSucursal from "../../../util/empresa.jpeg";
import { useSelector, useDispatch } from "react-redux";
import { EmpresaSlice } from "../../../redux/slice/empresa/EmpresaRedux";
const { Meta } = Card;
const { info } = Modal;

const Sucursal = () => {
  const empresa = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log(empresa);

  const [sucursales, setSucursales] = useState<sucursalInterface[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSwitchChange = async (checked, sucursalId, event) => {
    event.stopPropagation();
    if (checked) {
      await eliminarSucursal(sucursalId);
    }
    setSucursales((prevSucursales) =>
      prevSucursales.map((sucursal) =>
        sucursal.id === sucursalId ? { ...sucursal, eliminado: checked } : sucursal
      )
    );
  };

  useEffect(() => {
    getSucursalId(Number(id))
      .then((response) => {
        console.log(response);
        setSucursales(response);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setSucursales([]);
      });
  }, [id]);

  const showInfo = () => {
    info({
      title: 'Sucursal deshabilitada',
      content: 'Para ingresar a la sucursal, primero debes habilitarla.',
      okText: 'Aceptar',
      onOk() {},
    });
  };

  const handleCardClick = (sucursal: sucursalInterface) => {
    if (sucursal.eliminado) {
      showInfo();
    } else {
      dispatch(EmpresaSlice.actions.setIdSucursal(sucursal.id || null));
      navigate("/productos");
    }
  };

  return (
    <div>
      <h1>Sucursales</h1>
      <Carousel 
        style={{ width: "100%" }} 
        autoplay 
        prevArrow={<LeftOutlined style={{ fontSize: '24px', color: '#08c', cursor: 'pointer' }} />}
        nextArrow={<RightOutlined style={{ fontSize: '24px', color: '#08c', cursor: 'pointer' }} />}
      >
        {Array.isArray(sucursales) &&
          sucursales.map((sucursal, index) => (
            index % 3 === 0 ? (
              <div key={sucursal.id}>
                <Row gutter={16}>
                  {sucursales.slice(index, index + 4).map((sucursal) => (
                    <Col key={sucursal.id} span={5}>
                      <Card
                        style={{ marginBottom: 10, backgroundColor: sucursal.eliminado ? 'red' : 'white' }}
                        onClick={() => handleCardClick(sucursal)}
                        cover={<img alt={sucursal.nombre} src={imagenSucursal} />}
                        actions={[
                          <Switch 
                            checked={sucursal.eliminado}
                            onChange={(checked, event) => handleSwitchChange(checked, sucursal.id, event)}
                            onClick={(e) => e.stopPropagation()}
                          />,
                          <EditOutlined 
                            key="edit" 
                            disabled={sucursal.eliminado} 
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />,
                        ]}
                      >
                        <Meta
                          title={sucursal.nombre}
                          description={sucursal.horaApertura}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : null
          ))}
      </Carousel>
      <TarjetaAgregar />
    </div>
  );
};

export default Sucursal;
