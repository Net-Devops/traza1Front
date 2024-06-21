import React, { useState, useEffect } from 'react';
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Upload, notification, Table } from 'antd';

import { UploadFile } from 'antd/es/upload/interface';
import { crearInsumo, getUnidadMedida, unidadMedida } from '../../../service/ServiceInsumos';
import { getSucursal, Sucursal } from '../../../service/ServiceSucursal';
import { crearManufacturado } from '../../../service/ServiceProducto';

interface FormularioProductoProps {
    onClose: () => void;
    empresaId: string;
    sucursalId: string;
}

const FormularioProducto: React.FC<FormularioProductoProps> = ({ onClose, empresaId, sucursalId }) => {
    const [form] = Form.useForm();
    const [isModalVisible,] = useState(true);
    const [, setIsSwitchOn] = useState(false);
    const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [dataSource, setDataSource] = useState([]);
    const [isNestedModalVisible, setIsNestedModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedInsumosToAdd, setSelectedInsumosToAdd] = useState([]);

    useEffect(() => {
        const fetchSucursales = async () => {
            if (empresaId) {
                try {
                    const sucursalesData = await getSucursal(empresaId);
                    setSucursales(sucursalesData);
                } catch (error) {
                    console.error('Error al obtener las sucursales:', error);
                }
            }
        };
        fetchSucursales();
    }, [empresaId]);

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

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        const formattedValues = { ...values };
        let promises: Promise<{ url: string }>[] = [];

        formattedValues.unidadMedida = {
            id: values.unidadMedida,
            denominacion: values.denominacionUnidadMedida
        };
        formattedValues.sucursal = {
            id: values.sucursal,
            denominacion: values.nombreSucursal
        };
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
            // window.location.reload(); // Considera recargar los datos de manera más eficiente si es necesario

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

    const handleSwitchChange = (checked: boolean) => {
        setIsSwitchOn(checked);
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

    const getColumnSearchProps = (dataIndex: string) => ({
        // Custom filter UI can be added here
    });

    const columns = [
        {
            title: "Código",
            dataIndex: "codigo",
            key: "codigo",
            ...getColumnSearchProps("codigo"),
        },
        {
            title: "Denominación",
            dataIndex: "denominacion",
            key: "denominacion",
            ...getColumnSearchProps("denominacion"),
        },
    ];

    const insumoColumns = [
        ...columns,
        {
            title: "Cantidad",
            key: "cantidad",
            render: (_: any, record: { cantidad: number; key: any; }) => (
                <Input
                    type="number"
                    min={0}
                    value={record.cantidad}
                    onChange={(e) => handleQuantityChange(e.target.value, record.key)}
                />
            ),
        },
    ];

    const handleAddSelected = () => {
        const selectedInsumos = dataSource.filter((item: any) => selectedRowKeys.includes(item.key));
        setSelectedInsumosToAdd(selectedInsumos);
        setIsNestedModalVisible(false);
    };

    const handleQuantityChange = (value: number, key: any) => {
        const newData = [...selectedInsumosToAdd];
        const index = newData.findIndex(item => key === item.key);
        if (index !== -1) {
            newData[index].cantidad = value;
            setSelectedInsumosToAdd(newData);
        }
    };

    const handleNestedModalOk = () => {
        handleAddSelected();
    };

    const handleNestedModalCancel = () => {
        setIsNestedModalVisible(false);
    };

    const handleOpenAddInsumosModal = () => {
        setIsNestedModalVisible(true);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: any) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleInsumosCancel = () => {
        setIsNestedModalVisible(false);
    };

    return (
        <Modal title="Agregar Producto" visible={isModalVisible} onOk={onClose} onCancel={onClose} footer={null} width={800}>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: 800, justifyContent: 'center' }}
                onFinish={onFinish}
                initialValues={{
                    codigo: '',
                    denominacion: '',
                    descripcion: '',
                    preparacion: '',
                    tiempoEstimado: 0,
                    precioVenta: 0,
                    unidadMedida: '',
                    sucursal: sucursalId,
                }}
            >
                <div>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Sucursal" name="sucursal">
                                <Select disabled>
                                    {sucursales.map((sucursal) => (
                                        <Select.Option key={sucursal.id} value={sucursal.id}>
                                            {sucursal.nombre}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Código"
                                name="codigo"
                                rules={[{ required: true, message: 'El código no puede estar vacío' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Denominación"
                                name="denominacion"
                                rules={[{ required: true, message: 'La denominación no puede estar vacía' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Precio de venta"
                                name="precioVenta"
                                rules={[
                                    { required: true, message: 'Por favor, ingresa un precio de venta válido', type: 'number', min: 0 }
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} />
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
                            <Form.Item
                                label="Preparacion"
                                name="preparacion"
                                rules={[{ required: true, message: 'La preparacion no puede estar vacía' }]}
                            >
                                <Input.TextArea rows={5} />
                            </Form.Item>
                            <Form.Item
                                label="Tiempo estimado en minutos"
                                name="tiempoEstimado"
                                rules={[{ required: true, message: 'el tiempo no puede estar vacío' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" onClick={handleOpenAddInsumosModal} style={{ marginBottom: 20 }}>
                        Agregar Insumos
                    </Button>
                    <Table
                        dataSource={selectedInsumosToAdd}
                        columns={insumoColumns}
                        pagination={false}
                    />
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button type="default" style={{ marginRight: '10px' }} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Agregar
                        </Button>
                    </Form.Item>
                </div>
            </Form>

            <Modal
                title="Agregar Insumos"
                visible={isNestedModalVisible}
                onOk={handleNestedModalOk}
                onCancel={handleNestedModalCancel}
                width={1000}
                footer={[
                    <Button key="back" onClick={handleInsumosCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleNestedModalOk}>
                        Agregar Seleccionados
                    </Button>,
                ]}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            rowKey="id"
                            rowSelection={rowSelection}
                        />
                        <Button
                            type="primary"
                            onClick={handleAddSelected}
                            disabled={selectedRowKeys.length === 0}
                        >
                            Agregar Seleccionados
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </Modal>
    );
};

export default FormularioProducto;
