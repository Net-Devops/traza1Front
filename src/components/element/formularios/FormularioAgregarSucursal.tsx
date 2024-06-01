import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    TimePicker,
    Upload,
    notification,
} from 'antd';
import { useParams } from 'react-router-dom';
import { Sucursal, crearSucursal } from '../../../service/ServiceSucursal';

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

interface FormularioAgregarEmpresaProps {
    onClose: () => void;
}

const FormularioAgregarSucursal: React.FC<FormularioAgregarEmpresaProps> = ({ onClose }) => {
    const [componentDisabled] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm(); // Usar el hook useForm

    const handleOk = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleSubmit = async (values: any) => {
        try {
            const { horaApertura, horaCierre, ...rest } = values;
            const sucursal: Sucursal = { 
                ...rest, 
                empresa: { id },
                
                horaApertura: horaApertura.format('HH:mm'), // Formatear la hora de apertura
                horaCierre: horaCierre.format('HH:mm'), // Formatear la hora de cierre
                

            }; 
            await crearSucursal(sucursal); // Llamar a la función crearSucursal
            notification.success({
                message: 'Sucursal agregada',
                description: 'Sucursal agregada correctamente',
            });
            handleOk();
            window.location.reload();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'La sucursal no fue agregada, revise los datos',
            });
        }
    };

    return (
        <Modal
            title="Agregar Sucursal"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800} // Aumentar el ancho del modal
        >
            <Form
                form={form} // Pasar la instancia del formulario al componente Form
                layout="vertical"
                disabled={componentDisabled}
                initialValues={{ empresa: { id } }}
                onFinish={handleSubmit} // Manejar el evento de envío del formulario
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Horario de Apertura" name="horaApertura" rules={[{ required: true, message: 'Por favor ingrese el horario de apertura' }]}>
                                    <TimePicker format='HH:mm' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Horario de Cierre" name="horaCierre" rules={[{ required: true, message: 'Por favor ingrese el horario de cierre' }]}>
                                    <TimePicker format='HH:mm' />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="País" name="pais" rules={[{ required: true, message: 'Por favor ingrese el país' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Provincia" name="provincia" rules={[{ required: true, message: 'Por favor ingrese la provincia' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Localidad" name="localidad" rules={[{ required: true, message: 'Por favor ingrese la localidad' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Calle" name="calle" rules={[{ required: true, message: 'Por favor ingrese la calle' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item label="Número" name="numero" rules={[{ required: true, message: 'Por favor ingrese el número' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Código Postal" name="codigoPostal" rules={[{ required: true, message: 'Por favor ingrese el código postal' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Piso" name="piso">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="N° de Depto" name="depto">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    
                    <Col span={12}>
                        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                            <Upload action="/upload.do" listType="picture-card">
                                <button style={{ border: 0, background: 'none' }} type="button">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="default" style={{ marginRight: '10px' }} onClick={handleCancel}>
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

export default FormularioAgregarSucursal;
