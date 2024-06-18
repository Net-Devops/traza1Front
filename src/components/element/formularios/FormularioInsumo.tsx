import { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Switch, Upload, notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { crearInsumo } from '../../../service/ServiceInsumos';
import { getUnidadMedida, unidadMedida } from '../../../service/ServiceInsumos';
interface FormularioInsumoProps {
    onClose: () => void;
}


const FormularioInsumo: React.FC<FormularioInsumoProps> = ({ onClose }) => {
    const [form] = Form.useForm();

    const [, setIsSwitchOn] = useState(false);
    const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);

    const handleSwitchChange = (checked: boolean) => {
        setIsSwitchOn(checked);
    };


    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);

        const formattedValues = { ...values };
        let promises = [];

        // Formatear unidadMedida como un objeto
        formattedValues.unidadMedida = {
            id: values.unidadMedida,
            denominacion: values.denominacionUnidadMedida // Usa el valor real del formulario
        };

        if (values.imagenes) {
            const files = values.imagenes; // Lista de archivos

            // Convertir cada archivo a base64

            promises = files.map((file: any) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        // Eliminar 'data:image/jpeg;base64,' del inicio de la cadena
                        const base64String = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
                        resolve({ url: base64String });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file.originFileObj);
                });
            });
        }

        Promise.all(promises)
            .then(async (imagenes) => {
                formattedValues.imagenes = imagenes;

                // Luego de convertir todas las imágenes a base64, procedemos a crear el insumo
                try {
                    const response = await crearInsumo(formattedValues); // Llama a la función de la API
                    console.log('Response: ', response);
                    form.resetFields();
                    onClose(); // Cierra el modal después de agregar un insumo
                    window.location.reload();
                    // Muestra la notificación
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
            })
            .catch((error) => console.error('Error al convertir las imágenes a base64: ', error));
    };

    const isModalVisible: boolean = true;


    function handleOk(_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        console.log('OK clicked');
        onClose();
    }


    function handleCancel(_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        console.log('Cancel clicked');
        onClose();
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }


        return e && e.fileList.map((file: any) => {
            if (file.originFileObj) {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onloadend = () => {
                    file.url = reader.result;
                };
            }
            return file;
        });
    };

    useEffect(() => {
        const fetchUnidadesMedida = async () => {
            const data = await getUnidadMedida();
            setUnidadesMedida(data);
        };

        fetchUnidadesMedida();
    }, []);

    return (
        <Modal title="Agregar Insumo" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: 600, justifyContent: 'center' }}
                onFinish={onFinish}
            >
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
                        <Form.Item label="Sucursal" name="sucursal" initialValue="">
                            <Select>
                                {unidadesMedida.map((unidad) => (
                                    <Select.Option key={unidad.id} value={unidad.id}>
                                        {unidad.denominacion}
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