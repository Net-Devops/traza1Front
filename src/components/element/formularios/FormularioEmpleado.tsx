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
    Upload,
    UploadFile,
    notification,
} from "antd";

import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';




interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialValues: any;
    sucursalId?: string;

}


const FormularioEmpleado: React.FC<Props> = ({
    visible,
    onClose,

    initialValues,
    sucursalId,
}) => {

    const [selectedInsumos, setSelectedInsumos] = useState<string[]>([]);
    const [selectedInsumosData, setSelectedInsumosData] = useState<any[]>([]);

    const handleButtonClick = async (values: any) => {
        if (selectedInsumosData.length === 0) {
            alert("Debe haber al menos un artículo en la tabla");
            return;
        }
        const allRecordsHaveQuantity = selectedInsumosData.every(
            (record) => record.cantidad > 0
        );

        if (!allRecordsHaveQuantity) {
            alert("Todos los artículos deben tener una cantidad");
            return;
        }

        console.log('Received values of form: ', values);
        const formattedValues = { ...values };
        let promises: Promise<{ url: string }>[] = [];


        formattedValues.sucursal = {
            id: sucursalId,
            denominacion: "" // You might want to fill this with actual data if available
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
            // const response = await crearManufacturado(formattedValues);
            // console.log('Response: ', response);
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




    return (
        <Modal
            visible={visible}
            title="Agregar Empleado"
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

                    <Form.Item
                        label="Nombre:"
                        name="nombre"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa el Nombre",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Apellido:"
                        name="apellido"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa el apellido",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Email:"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa un email",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Telefono:"
                        name="telefono"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa un telefono",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Rol:"
                        name="rol"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa un rol",
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

export default FormularioEmpleado;


