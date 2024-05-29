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

    const handleOk = async () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleSubmit = async (values: any) => {
        const { horaApertura, horaCierre, ...rest } = values;
        const sucursal: Sucursal = { 
            ...rest, 
            empresa: { id },
            horaApertura: horaApertura.format('HH:mm'), // Formatear la hora de apertura
            horaCierre: horaCierre.format('HH:mm'), // Formatear la hora de cierre
        }; 
        await crearSucursal(sucursal); // Llamar a la función crearSucursal
        handleOk();
        window.location.reload();
    };

    return (
        <Modal title="Agregar Sucursal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <Form
                form={form} // Pasar la instancia del formulario al componente Form
                layout="vertical"
                disabled={componentDisabled}
                style={{ maxWidth: 600 }}
                initialValues={{ empresa: { id } }}
                onFinish={handleSubmit} // Manejar el evento de envío del formulario
            >
              
                <Form.Item label="Nombre" name="nombre">
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Horario de Apertura" name="horaApertura">
                            <TimePicker format='HH:mm' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Horario de Cierre"name="horaCierre">
                            <TimePicker format='HH:mm' />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Calle">
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item label="Número">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Código Postal">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Piso">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="N° de Depto">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Localidad">
                    <Input />
                </Form.Item>
                <Form.Item label="Provincia">
                    <Input />
                </Form.Item>
                <Form.Item label="País">
                    <Input />
                </Form.Item>
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload action="/upload.do" listType="picture-card">
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
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