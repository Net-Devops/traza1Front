import { useEffect, useState } from "react";
import { Select, Card, Button, Modal, Table, Switch } from "antd";
import { getSucursal } from "../../../service/ServiceSucursal";
import { getEmpresas } from "../../../service/ServiceEmpresa";
import { Sucursal } from "../../../service/ServiceSucursal";
import { Empresas } from "../../../service/ServiceEmpresa";
import {
  promocionesPorSucursal,
  Promocion,
  PromocionDetalle,
  ArticuloManufacturado,
} from "../../../service/PromocionService";
import FormularioPromocion from "./FormularioPromocion";
import FormularioActualizacionPromocion from "./FormularioActualizacion"; // Importar el formulario de actualización
import {
  savePromocion,
  togglePromocion,
} from "../../../service/PromocionService";

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
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false); // Estado para la visibilidad del formulario de actualización
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(0);
  const [selectedPromocionId, setSelectedPromocionId] = useState<number | null>(
    null
  ); // Estado para el ID de la promoción seleccionada

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
        setIsFormVisible(true);
      } catch (error) {
        console.error("Error fetching articulos manufacturados:", error);
      }
    } else {
      console.error("No se seleccionó ninguna sucursal");
    }
  };

  const handleSubmitPromocion = async (values: any) => {
    try {
      const response = await savePromocion(values);
      if (response) {
        console.log("Promoción guardada con éxito:", response);
        setIsFormVisible(false); // Cierra el formulario si se guarda con éxito
        handleSucursalChange(selectedSucursalId.toString()); // Recarga las promociones
      }
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
    }
  };

  const handleTogglePromotion = async (
    promocionId: number,
    checked: boolean
  ) => {
    try {
      const response = await togglePromocion(promocionId);
      if (response) {
        console.log(
          `Promoción ID: ${promocionId}, Estado: ${
            checked ? "Habilitado" : "Deshabilitado"
          }`
        );
        // Aquí puedes actualizar el estado de las promociones si es necesario
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la promoción:", error);
    }
  };

  const handleEditPromotion = (promocionId: number) => {
    setSelectedPromocionId(promocionId); // Establece el ID de la promoción seleccionada
    setIsUpdateFormVisible(true); // Muestra el formulario de actualización
  };

  const handleUpdatePromotion = async (values: any) => {
    try {
      const response = await savePromocion({
        ...values,
        id: selectedPromocionId,
      });
      if (response) {
        console.log("Promoción actualizada con éxito:", response);
        setIsUpdateFormVisible(false); // Cierra el formulario si se actualiza con éxito
        handleSucursalChange(selectedSucursalId.toString()); // Recarga las promociones
      }
    } catch (error) {
      console.error("Error al actualizar la promoción:", error);
    }
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {promociones.map((promocion: Promocion) => (
          <Card
            key={promocion.id}
            title={promocion.denominacion}
            style={{
              width: 300,
              marginBottom: "10px",
              backgroundColor: promocion.eliminado ? "lightgray" : "white",
            }}
          >
            <p>{promocion.descripcionDescuento}</p>
            <Button onClick={() => handleShowDetail(promocion.id)}>
              Detalle
            </Button>
            <Button onClick={() => handleEditPromotion(promocion.id)}>
              Modificar
            </Button>
            <Switch
              defaultChecked={!promocion.eliminado}
              onChange={(checked) =>
                handleTogglePromotion(promocion.id, checked)
              }
            />
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
        tiposPromocion={[]}
        selectedSucursalId={selectedSucursalId}
      />
      {selectedPromocionId !== null && (
        <FormularioActualizacionPromocion
          visible={isUpdateFormVisible}
          onCancel={() => setIsUpdateFormVisible(false)}
          promocionId={selectedPromocionId}
          onSubmit={handleUpdatePromotion}
          selectedSucursalId={selectedSucursalId}
          tiposPromocion={[]}
        />
      )}
    </div>
  );
};

export default Promociones;
