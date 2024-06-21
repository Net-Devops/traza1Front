import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Table,
    InputNumber,
    Button,
    Row,
    Col,
    Space,
    Upload,
    UploadFile,
    notification,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getInsumoXSucursal, getUnidadMedida, unidadMedida } from "../../../service/ServiceInsumos";
import TextArea from "antd/es/input/TextArea";
import { ArticuloProducto, crearManufacturado } from "../../../service/ServiceProducto";

const { Option } = Select;

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialValues: any;
    sucursalId?: string;
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

const FormularioProducto: React.FC<Props> = ({
    visible,
    onClose,
    onSubmit,
    initialValues,
    sucursalId,
}) => {
    const [selectedInsumos, setSelectedInsumos] = useState<string[]>([]);
    const [selectedInsumosData, setSelectedInsumosData] = useState<any[]>([]);
    const [insumos, setInsumos] = useState<any[]>([]);
    const [filterDenominacion, setFilterDenominacion] = useState<string>("");
    const [filterCodigo, setFilterCodigo] = useState<string>("");
    const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);
    useEffect(() => {
        const fetchUnidadesMedida = async () => {
            try {
                const data = await getUnidadMedida();
                setUnidadesMedida(data);
            } catch (error) {
                console.error('Error al obtener las unidades de medida:', error);
            }
        };
        fetchUnidadesMedida();
    }, []);

    const handleInsumosSelect = (
        selectedRowKeys: React.Key[],
        selectedRows: any[]
    ) => {
        setSelectedInsumos(selectedRowKeys as string[]);
        setSelectedInsumosData(selectedRows);
    };

    const setFieldValue = (_arg0: string, value: string | Dayjs): void => {
        if (typeof value === "string") {
            value = dayjs(value);
        }
        // Add logic as needed
    };

    const handleCantidadChange = (id: string, cantidad: number) => {
        setSelectedInsumosData((prevState) =>
            prevState.map((item) => (item.id === id ? { ...item, cantidad } : item))
        );
    };

    useEffect(() => {
        if (sucursalId) {
            getInsumoXSucursal(sucursalId)
                .then(setInsumos)
                .catch(console.error);
        }
    }, [sucursalId]);

    const handleButtonClick = async (values: any) => {
        console.log('Received values of form: ', values);
        const formattedValues = { ...values };
        let promises: Promise<{ url: string }>[] = [];

        formattedValues.unidadMedida = {
            id: values.unidadMedida,
            denominacion: unidadesMedida.find(u => u.id === values.unidadMedida)?.denominacion
        };
        formattedValues.sucursal = {
            id: sucursalId,
            denominacion: "" // You might want to fill this with actual data if available
        };
        formattedValues.articuloManufacturadoDetalles = selectedInsumosData.map(insumo => ({
            cantidad: insumo.cantidad,
            articuloInsumo: {
                id: insumo.id
            }
        }));

        if (values.imagenes) {
            const files: UploadFile[] = values.imagenes;

            promises = files.map((file) => {
                return new Promise<{ url: string }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
                        resolve({ url: base64String });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file.originFileObj as File);
                });
            });
        }

        try {
            const imagenes = await Promise.all(promises);
            formattedValues.imagenes = imagenes;
            const response = await crearManufacturado(formattedValues);
            console.log('Response: ', response);
            form.resetFields();
            onClose();
            notification.open({
                message: (
                    <span>
                        <CheckCircleOutlined style={{ color: 'green' }} /> Agregado correctamente
                    </span>
                ),
            });
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList.map((file: any) => {
            if (file.originFileObj) {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onloadend = () => {
                    file.url = reader.result as string;
                };
            }
            return file;
        });
    };

    const [form] = Form.useForm();

    const columns = [
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
            title: "Acción",
            key: "accion",
            render: (_text: string, record: any) => (
                <Button
                    type="link"
                    onClick={() => handleAddArticulo(record)}
                    disabled={selectedInsumos.includes(record.id)}
                >
                    Agregar
                </Button>
            ),
        },
    ];

    const handleAddArticulo = (articulo: any) => {
        setSelectedInsumosData((prevData) => [...prevData, articulo]);
        setSelectedInsumos((prevKeys) => [...prevKeys, articulo.id]);
    };

    return (
        <Modal
            visible={visible}
            title="Crear Promoción"
            onCancel={onClose}
            footer={null}
            width={1000}
        >
            <Form
                form={form}
                initialValues={initialValues}
                onFinish={handleButtonClick}
                layout="vertical"
            >
                <div>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Codigo:"
                                name="codigo"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor ingresa el codigo",
                                    },
                                ]}
                            >
                                <Input style={{ width: "100%" }} />
                            </Form.Item>
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
                                label="Descripción:"
                                name="descripcion"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor ingresa la descripción",
                                    },
                                ]}
                            >
                                <Input style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Preparación:"
                                name="preparacion"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor ingresa la preparacion",
                                    },
                                ]}
                            >
                                <TextArea rows={3} style={{ width: "100%" }} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tiempo estimado en minutos:"
                                        name="tiempoEstimadoCocina"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Por favor ingresa el tiempo de preparacion",
                                            },
                                        ]}
                                    >
                                        <Input style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Unidad de Medida"
                                        name="unidadMedida"
                                        rules={[{ required: true, message: 'Por favor, selecciona una unidad de medida' }]}
                                    >
                                        <Select>
                                            {unidadesMedida.map((unidad) => (
                                                <Select.Option key={unidad.id} value={unidad.id}>
                                                    {unidad.denominacion}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="Precio de venta:"
                                name="precioVenta"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor ingresa el precio de venta",
                                    },
                                ]}
                            >
                                <Input style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                label="Foto"
                                name="imagenes"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload action="/upload.do" listType="picture-card" beforeUpload={() => false}>
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Foto</div>
                                    </button>
                                </Upload>
                            </Form.Item>

                        </Col>

                        <Col span={12}>
                            <Form.Item label="Artículos Manufacturados:" style={{ width: "100%" }}>
                                <Table
                                    dataSource={selectedInsumosData}
                                    columns={[
                                        { title: "Código", dataIndex: "codigo", key: "codigo" },
                                        {
                                            title: "Artículo",
                                            dataIndex: "denominacion",
                                            key: "denominacion",
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
                                    pagination={{ pageSize: 3 }}
                                />
                                <Table
                                    rowSelection={{
                                        type: "checkbox",
                                        selectedRowKeys: selectedInsumos,
                                        onChange: handleInsumosSelect,
                                    }}
                                    columns={columns}
                                    dataSource={insumos.filter(
                                        (insumo) =>
                                            insumo.denominacion
                                                .toLowerCase()
                                                .includes(filterDenominacion.toLowerCase()) &&
                                            insumo.codigo
                                                .toLowerCase()
                                                .includes(filterCodigo.toLowerCase())
                                    )}
                                    rowKey="id"
                                    pagination={{ pageSize: 3 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" onClick={() => form.submit()}>
                        Cargar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormularioProducto;


