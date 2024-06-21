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
  tiposPromocion: { value: string; label: string }[];
  selectedSucursalId?: number;
}

const handleSearch = (
  _setSelectedKeys: (keys: string[]) => void,
  _selectedKeys: string[],
  confirm: () => void
) => {
  confirm();
};

const handleReset = (clearFilters: () => void) => {
  clearFilters();
};

const FormularioPromocion: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  tiposPromocion,
  selectedSucursalId,
}) => {
  const [selectedArticulos, setSelectedArticulos] = useState<string[]>([]);
  const [selectedArticulosData, setSelectedArticulosData] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [filterDenominacion, setFilterDenominacion] = useState<string>("");
  const [filterCodigo, setFilterCodigo] = useState<string>("");

  const handleArticuloSelect = (
    selectedRowKeys: React.Key[],
    selectedRows: any[]
  ) => {
    setSelectedArticulos(selectedRowKeys as string[]);
    setSelectedArticulosData(selectedRows);
  };

  const setFieldValue = (_arg0: string, value: string | Dayjs): void => {
    if (typeof value === "string") {
      value = dayjs(value);
    }
    // Add logic as needed
  };

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
        id: 0, // Ensure this is correctly set based on your backend logic
        denominacion: formValues.denominacion,
        fechaDesde: formValues.fechaDesde.format("YYYY-MM-DD"),
        fechaHasta: formValues.fechaHasta.format("YYYY-MM-DD"),
        horaDesde: formValues.horaDesde.format("HH:mm"),
        horaHasta: formValues.horaHasta.format("HH:mm"),
        descripcionDescuento: formValues.descripcionDescuento,
        precioPromocional: formValues.precioPromocional,
        imagen: formValues.imagen,
        sucursales: [{ id: selectedSucursalId }],
        promocionDetalles: selectedArticulosData.map((articulo) => ({
          cantidad: articulo.cantidad,
          articuloManufacturado: { id: articulo.id },
        })),
      };
      await savePromocion(promocionData);
      form.resetFields(); // Limpia los campos del formulario
      onCancel();
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
    }
  };

  const [form] = Form.useForm();

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
          <Input
            placeholder="Buscar Denominación"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(setSelectedKeys, selectedKeys, confirm)
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(setSelectedKeys, selectedKeys, confirm)
              }
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
      onFilter: (value: string, record: any) =>
        record.denominacion.toLowerCase().includes(value.toLowerCase()),
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
          <Input
            placeholder="Buscar Código"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(setSelectedKeys, selectedKeys, confirm)
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(setSelectedKeys, selectedKeys, confirm)
              }
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
      onFilter: (value: string, record: any) =>
        record.codigo.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Precio Venta",
      dataIndex: "precioVenta",
      key: "precioVenta",
    },
    {
      title: "Acción",
      key: "accion",
      render: (_text: string, record: any) => (
        <Button
          type="link"
          onClick={() => handleAddArticulo(record)}
          disabled={selectedArticulos.includes(record.id)}
        >
          Agregar
        </Button>
      ),
    },
  ];

  const handleAddArticulo = (articulo: any) => {
    setSelectedArticulosData((prevData) => [...prevData, articulo]);
    setSelectedArticulos((prevKeys) => [...prevKeys, articulo.id]);
  };

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
                    message: "Por favor ingresa la fecha desde",
                  },
                ]}
              >
                <DatePicker
                  onChange={(value) => setFieldValue("fechaDesde", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Fecha Hasta:"
                name="fechaHasta"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la fecha hasta",
                  },
                ]}
              >
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
                    message: "Por favor ingresa la hora desde",
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
                    message: "Por favor ingresa la hora hasta",
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
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la descripción del descuento",
                  },
                ]}
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
                              "El precio promocional debe ser mayor a 0"
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

              <Form.Item label="Imagen:" name="imagen">
                <Input style={{ width: "100%" }} />
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
                render: (_text: string, record: any) => (
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
                                new Error("La cantidad debe ser mayor a 0")
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
            dataSource={articulos.filter(
              (articulo) =>
                articulo.denominacion
                  .toLowerCase()
                  .includes(filterDenominacion.toLowerCase()) &&
                articulo.codigo
                  .toLowerCase()
                  .includes(filterCodigo.toLowerCase())
            )}
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
