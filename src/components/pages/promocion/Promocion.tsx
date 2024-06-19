import { useEffect, useState } from "react";
import { Select, Card, Button, Modal, Table } from "antd";

import { getSucursal } from "../../../service/ServiceSucursal";
import { getEmpresas } from "../../../service/ServiceEmpresa";
import { Sucursal } from "../../../service/ServiceSucursal";
import { Empresas } from "../../../service/ServiceEmpresa";
import {
  promocionesPorSucursal,
  Promocion,
  PromocionDetalle,
  Articulo,
} from "../../../service/PromocionService";

const { Option } = Select;

const Promociones = () => {
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [promociones, setPromociones] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPromocionDetail, setSelectedPromocionDetail] = useState(null);

  const columns = [
    {
      title: "Denominación del artículo",
      dataIndex: "articulo",
      key: "articulo",
      render: (articulo: Articulo) => articulo.denominacion,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
  ];

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

  const handleSucursalChange = async (value: string) => {
    const promocionesData = await promocionesPorSucursal(Number(value));
    setPromociones(promocionesData);
  };
  const handleShowDetail = async (promocionId: number) => {
    const detalle = await PromocionDetalle(promocionId);
    setSelectedPromocionDetail(detalle);
    setIsModalVisible(true);
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
            onChange={handleSucursalChange}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </Option>
            ))}
          </Select>
          <div>
            {promociones.map((promocion: Promocion) => (
              <Card title={promocion.denominacion} style={{ width: 300 }}>
                <p>{promocion.descripcionDescuento}</p>
                <Button onClick={() => handleShowDetail(promocion.id)}>
                  Detalle
                </Button>
                {/* Añade más detalles de la promoción aquí */}
              </Card>
            ))}
          </div>
          <Modal
            title="Detalle de la promoción"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            {/* Aquí puedes renderizar los detalles de la promoción seleccionada */}
            {selectedPromocionDetail && (
              <Table dataSource={selectedPromocionDetail} columns={columns} />
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default Promociones;
