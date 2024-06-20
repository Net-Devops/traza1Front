import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Table,
  InputNumber,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  fetchArticulosManufacturados,
  savePromocion,
  Promocion,
} from "../../../service/PromocionService";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  articulosManufacturados: any[]; // Asegúrate de definir correctamente esta interfaz
  tiposPromocion: { value: string; label: string }[]; // Asegúrate de definir correctamente esta interfaz
  selectedSucursalId?: number; // Agrega esta línea
}

const handleSearch = (selectedKeys: string[], confirm: () => void) => {
  confirm();
};

const handleReset = (clearFilters: () => void) => {
  clearFilters();
};

const columns = [
  {
    title: "Denominación",
    dataIndex: "denominacion",
    key: "denominacion",
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: (keys: string[]) => void;
      selectedKeys: string[];
      confirm: () => void;
      clearFilters: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input.Search
          placeholder="Buscar Denominación"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onSearch={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    onFilter: (
      value: string,
      record: { denominacion: { toString: () => string } }
    ) =>
      record.denominacion
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    title: "Descripción",
    dataIndex: "descripcion",
    key: "descripcion",
  },
  {
    title: "Código",
    dataIndex: "codigo",
    key: "codigo",
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: (keys: string[]) => void;
      selectedKeys: string[];
      confirm: () => void;
      clearFilters: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input.Search
          placeholder="Buscar Código"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onSearch={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value: string, record: { codigo: { toString: () => string } }) =>
      record.codigo.toString().toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Precio Venta",
    dataIndex: "precioVenta",
    key: "precioVenta",
  },
  // Agrega aquí las demás columnas que necesites
];

const FormularioPromocion: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  tiposPromocion,
  selectedSucursalId, // Agrega esta línea
}) => {
  const [selectedArticulos, setSelectedArticulos] = useState<string[]>([]);
  const [selectedArticulosData, setSelectedArticulosData] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]); // Nuevo estado para los artículos

  const handleArticuloSelect = (
    selectedRowKeys: React.Key[],
    selectedRows: any[]
  ) => {
    setSelectedArticulos(selectedRowKeys as string[]);
    setSelectedArticulosData(selectedRows);
  };

  function setFieldValue(_arg0: string, value: string | Dayjs): void {
    if (typeof value === "string") {
      value = dayjs(value); // Convert the string value to a Dayjs object
    }
    // Rest of the function code
  }

  const handleCantidadChange = (id: string, cantidad: number) => {
    setSelectedArticulosData((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  useEffect(() => {
    if (selectedSucursalId) {
      fetchArticulosManufacturados(selectedSucursalId)
        .then(setArticulos)
        .catch(console.error);
    }
  }, [selectedSucursalId]);

  const handleButtonClick = async () => {
    try {
      const formValues = await form.validateFields();
      const promocionData: Promocion = {
        id: 0, // Add the id property with a default value
        denominacion: formValues.denominacion,
        fechaDesde: formValues.fechaDesde.format("YYYY-MM-DD"),
        fechaHasta: formValues.fechaHasta.format("YYYY-MM-DD"),
        horaDesde: formValues.horaDesde.format("HH:mm"),
        horaHasta: formValues.horaHasta.format("HH:mm"),
        descripcionDescuento: formValues.descripcionDescuento,
        precioPromocional: formValues.precioPromocional,
        sucursales: [{ id: selectedSucursalId }],
        promocionDetalles: selectedArticulosData.map((articulo) => ({
          cantidad: articulo.cantidad,
          articuloManufacturado: { id: articulo.id },
        })),
      };
      await savePromocion(promocionData);
      onCancel();
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
    }
  };

  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Crear Promoción"
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Denominación:"
                name="denominacion"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la denominación",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Fecha Desde:"
                name="fechaDesde"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la denominación",
                  },
                ]}
              >
                <DatePicker
                  onChange={(value) => setFieldValue("fechaDesde", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Fecha Hasta:" name="fechaHasta">
                <DatePicker
                  onChange={(value) => setFieldValue("fechaHasta", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Hora Desde:"
                name="horaDesde"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la denominación",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  onChange={(value) =>
                    setFieldValue("horaDesde", value.format("HH:mm"))
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Hora Hasta:"
                name="horaHasta"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la denominación",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  onChange={(value) =>
                    setFieldValue("horaHasta", value.format("HH:mm"))
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Descripción Descuento:"
                name="descripcionDescuento"
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Precio Promocional:"
                name="precioPromocional"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa el precio promocional",
                  },
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "El precio promocional debe ser un número mayor a 0"
                            )
                          ),
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>

              <Form.Item label="Tipo Promoción:" name="tipoPromocion">
                <Select style={{ width: "100%" }}>
                  {tiposPromocion.map((tipo) => (
                    <Option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Form.Item label="Artículos Manufacturados:" style={{ width: "100%" }}>
          <Table
            dataSource={selectedArticulosData}
            columns={[
              {
                title: "Artículo",
                dataIndex: "denominacion",
                key: "denominacion",
              },
              { title: "Código", dataIndex: "codigo", key: "codigo" },
              {
                title: "Precio Venta",
                dataIndex: "precioVenta",
                key: "precioVenta",
              },
              {
                title: "Cantidad",
                dataIndex: "cantidad",
                key: "cantidad",
                render: (text: string, record: any) => (
                  <Form.Item
                    name={`cantidad_${record.id}`}
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingresa la cantidad",
                      },
                      {
                        validator: (_, value) =>
                          value > 0
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "La cantidad debe ser un número positivo"
                                )
                              ),
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      value={record.cantidad}
                      onChange={(value) =>
                        handleCantidadChange(record.id, value)
                      }
                    />
                  </Form.Item>
                ),
              },
            ]}
          />
          <Table
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedArticulos,
              onChange: handleArticuloSelect,
            }}
            columns={columns}
            dataSource={articulos}
            rowKey="id"
          />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleButtonClick}>
            Cargar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioPromocion;
