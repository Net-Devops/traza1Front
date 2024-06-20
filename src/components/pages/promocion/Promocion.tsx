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
  ArticuloManufacturado,
  fetchArticulosManufacturados,
} from "../../../service/PromocionService";
import FormularioPromocion from "./FormularioPromocion";

const { Option } = Select;

const Promociones = () => {
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [promociones, setPromociones] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promocionDetail, setPromocionDetail] = useState<
    ArticuloManufacturado[]
  >([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [articulosManufacturados, setArticulosManufacturados] = useState([]);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(0);

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
    setSelectedSucursalId(Number(value));
    const promocionesData = await promocionesPorSucursal(Number(value));
    setPromociones(promocionesData);
  };
  const handleShowDetail = async (promocionId: number) => {
    const detalle = await PromocionDetalle(promocionId);
    setPromocionDetail(detalle);
    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleCreatePromotion = async () => {
    if (selectedSucursalId !== null) {
      try {
        const articulos = await fetchArticulosManufacturados(
          selectedSucursalId
        );
        setArticulosManufacturados(articulos);
        setIsFormVisible(true);
      } catch (error) {
        console.error("Error fetching articulos manufacturados:", error);
      }
    } else {
      console.error("No se seleccionó ninguna sucursal");
    }
  };

  const handleSubmitPromocion = async (values: any) => {
    // Lógica para enviar la promoción al backend
    console.log("Submit values:", values); // Aquí puedes enviar los datos al backend si es necesario
  };

  const columns = [
    {
      title: "Imagen",
      dataIndex: "articuloManufacturadoDto",
      key: "imagen",
      render: (articuloManufacturadoDto: any) =>
        articuloManufacturadoDto.imagenes &&
        articuloManufacturadoDto.imagenes.length > 0 ? (
          <img
            src={articuloManufacturadoDto.imagenes[0]}
            alt={articuloManufacturadoDto.denominacion}
            style={{ width: "50px" }}
          />
        ) : (
          "No image"
        ),
    },
    {
      title: "Denominación",
      dataIndex: "articuloManufacturadoDto",
      key: "denominacion",
      render: (articuloManufacturadoDto: any) =>
        articuloManufacturadoDto.denominacion,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
  ];

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
        </div>
        <Button
          type="primary"
          onClick={handleCreatePromotion}
          style={{ marginBottom: "10px" }}
        >
          Crear Promoción
        </Button>
      </div>
      <div>
        {promociones.map((promocion: Promocion) => (
          <Card title={promocion.denominacion} style={{ width: 300 }}>
            <p>{promocion.descripcionDescuento}</p>
            <Button onClick={() => handleShowDetail(promocion.id)}>
              Detalle
            </Button>
          </Card>
        ))}
      </div>
      <Modal
        title="Detalles de la promoción"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Table dataSource={promocionDetail} columns={columns} />
      </Modal>
      <FormularioPromocion
        visible={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        onSubmit={handleSubmitPromocion}
        initialValues={undefined}
        articulosManufacturados={articulosManufacturados}
        tiposPromocion={[]}
        selectedSucursalId={selectedSucursalId}
      />
    </div>
  );
};
export default Promociones;
