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
import dayjs from "dayjs";
import {
  fetchArticulosManufacturados,
  fetchPromocionById,
  actualizarPromocion,
  Promocion,
  eliminarDetallesPromocion,
} from "../../../service/PromocionService";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  promocionId: number | null;
  tiposPromocion: { value: string; label: string }[];
  selectedSucursalId?: number;
}

const FormularioActualizacionPromocion: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  promocionId,
  tiposPromocion,
  selectedSucursalId,
}) => {
  const [form] = Form.useForm();
  const [selectedArticulos, setSelectedArticulos] = useState<string[]>([]);
  const [selectedArticulosData, setSelectedArticulosData] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);

  useEffect(() => {
    if (selectedSucursalId) {
      fetchArticulosManufacturados(selectedSucursalId)
        .then(setArticulos)
        .catch(console.error);
    }
  }, [selectedSucursalId]);

  useEffect(() => {
    console.log("-------------id promocion " + promocionId);
    if (promocionId) {
      fetchPromocionById(promocionId).then((data) => {
        form.setFieldsValue({
          denominacion: data.denominacion,
          fechaDesde: dayjs(data.fechaDesde),
          fechaHasta: dayjs(data.fechaHasta),
          horaDesde: dayjs(data.horaDesde, "HH:mm"),
          horaHasta: dayjs(data.horaHasta, "HH:mm"),
          descripcionDescuento: data.descripcionDescuento,
          precioPromocional: data.precioPromocional,
          tipoPromocion: data.tipoPromocion,
        });
        setSelectedArticulosData(
          data.promocionDetalles.map((detalle: any) => ({
            ...detalle.articuloManufacturado,
            cantidad: detalle.cantidad,
          }))
        );
        setSelectedArticulos(
          data.promocionDetalles.map(
            (detalle: any) => detalle.articuloManufacturado.id
          )
        );
      });
    }
  }, [promocionId]);

  const handleArticuloSelect = (
    selectedRowKeys: React.Key[],
    selectedRows: any[]
  ) => {
    setSelectedArticulos(selectedRowKeys as string[]);
    setSelectedArticulosData(selectedRows);
  };

  const handleCantidadChange = (id: string, cantidad: number) => {
    setSelectedArticulosData((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const handleButtonClick = async () => {
    try {
      const formValues = await form.validateFields();
      const promocionData: Promocion = {
        id: promocionId!,
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
      await eliminarDetallesPromocion(promocionId!);
      await actualizarPromocion(promocionId!, promocionData);
      onCancel();
      onSubmit(promocionData); // Asegúrate de llamar a onSubmit aquí
    } catch (error) {
      console.error("Error al actualizar la promoción:", error);
    }
  };

  const columns = [
    {
      title: "Denominación",
      dataIndex: "denominacion",
      key: "denominacion",
    },
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
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
      title="Actualizar Promoción"
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
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
              <DatePicker style={{ width: "100%" }} />
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
              <DatePicker style={{ width: "100%" }} />
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
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
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
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
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
                          new Error("El precio promocional debe ser mayor a 0")
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

        <Row gutter={16}>
          <Col span={24}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={articulos}
              pagination={false}
              rowSelection={{
                selectedRowKeys: selectedArticulos,
                onChange: handleArticuloSelect,
              }}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Table
              rowKey="id"
              columns={[
                {
                  title: "Artículo",
                  dataIndex: "denominacion",
                  key: "denominacion",
                },
                {
                  title: "Cantidad",
                  key: "cantidad",
                  render: (_text: string, record: any) => (
                    <InputNumber
                      min={1}
                      value={record.cantidad}
                      onChange={(value) =>
                        handleCantidadChange(record.id, value || 1)
                      }
                    />
                  ),
                },
              ]}
              dataSource={selectedArticulosData}
              pagination={false}
            />
          </Col>
        </Row>

        <Row gutter={16} justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Space>
              <Button onClick={onCancel}>Cancelar</Button>
              <Button type="primary" onClick={handleButtonClick}>
                Guardar
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default FormularioActualizacionPromocion;
