import React, { useState, useEffect } from 'react';
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Switch, Upload, notification } from 'antd';
import { FormInstance } from 'antd/es/form';
import { UploadFile } from 'antd/es/upload/interface';
import { crearInsumo, getUnidadMedida, unidadMedida } from '../../../service/ServiceInsumos';
import { getSucursal, Sucursal } from '../../../service/ServiceSucursal';
import { crearManufacturado } from '../../../service/ServiceProducto';
interface FormularioInsumoProps {
    onClose: () => void;
    empresaId: string;
    sucursalId: string;
}

const FormularioInsumo: React.FC<FormularioInsumoProps> = ({ onClose, empresaId, sucursalId }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [, setIsSwitchOn] = useState(false);
    const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

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
            let response; // Declaración de la variable fuera del bloque condicional
            if (values.esParaElaborar) {
                response = await crearInsumo(formattedValues);
            } else {
                response = await crearInsumo(formattedValues);
                formattedValues.articuloManufacturadoDetalles = {
                    cantidad: 1,
                    articuloInsumo: {
                        id: response.id
                    }
                };
                response = await crearManufacturado(formattedValues);
            }
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

    return (
        <Modal title="Agregar Insumo" visible={isModalVisible} onOk={onClose} onCancel={onClose} footer={null}>
            <Form form={form} layout="vertical" style={{ maxWidth: 600, justifyContent: 'center' }} onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Codigo" name="codigo" initialValue="">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Stock actual" name="stockActual" initialValue={0}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Precio de venta" name="precioVenta" initialValue={0}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Unidad de Medida" name="unidadMedida" initialValue="">
                            <Select>
                                {unidadesMedida.map((unidad) => (
                                    <Select.Option key={unidad.id} value={unidad.id}>
                                        {unidad.denominacion}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Foto" name="imagenes" valuePropName="fileList" getValueFromEvent={normFile}>
                            <Upload action="/upload.do" listType="picture-card" beforeUpload={() => false}>
                                <button style={{ border: 0, background: 'none' }} type="button">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Foto</div>
                                </button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Denominación" name="denominacion" initialValue="">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Stock maximo" name="stockMaximo" initialValue={0}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Precio de compra" name="precioCompra" initialValue={0}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Sucursal" name="sucursal" initialValue={sucursalId}>
                            <Select disabled>
                                {sucursales.map((sucursal) => (
                                    <Select.Option key={sucursal.id} value={sucursal.id}>
                                        {sucursal.nombre}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Es para elaborar" name="esParaElaborar" valuePropName="checked" initialValue={false}>
                            <Switch onChange={handleSwitchChange} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="default" style={{ marginRight: '10px' }} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Agregar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormularioInsumo;
