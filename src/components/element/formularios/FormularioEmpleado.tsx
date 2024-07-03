import { Modal, Form, Input, Select, Button, notification } from "antd";

import { CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

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
  const [imagenBase64, setImagenBase64] = useState<string | undefined>(
    undefined
  );
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const base64String = (reader.result as string).replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          setImagenBase64(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = async (values: any) => {
    console.log("Received values of form: ", values);
    const formattedValues = { ...values };

    formattedValues.sucursal = {
      id: sucursalId,
      denominacion: "", // You might want to fill this with actual data if available
    };

    try {
      formattedValues.imagen = imagenBase64;

      // Realizar la petición POST a la API
      const response = await fetch("http://localhost:8080/api/empleado/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (response.ok) {
        notification.open({
          message: (
            <span>
              <CheckCircleOutlined style={{ color: "green" }} /> Agregado
              correctamente
            </span>
          ),
        });
        form.resetFields();
        onClose();
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error: ", error);
      notification.error({
        message: "Error",
        description: "Hubo un problema al agregar el empleado.",
      });
    }
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
                message: "Por favor selecciona un rol",
              },
            ]}
          >
            <Select style={{ width: "100%" }}>
              <Select.Option value="EMPLEADO_REPARTIDOR">
                EMPLEADO_REPARTIDOR
              </Select.Option>
              <Select.Option value="EMPLEADO_COCINA">
                EMPLEADO_COCINA
              </Select.Option>
              <Select.Option value="CLIENTE">CLIENTE</Select.Option>
              <Select.Option value="ADMINISTRADOR">ADMINISTRADOR</Select.Option>
              <Select.Option value="EMPLEADO_CAJA">EMPLEADO_CAJA</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Imagen:" name="imagen">
            <Input type="file" onChange={handleImagenChange} accept="image/*" />
          </Form.Item>

          {imagenBase64 && (
            <div style={{ marginTop: 20 }}>
              <img src={imagenBase64} alt="Preview" style={{ maxWidth: 200 }} />
            </div>
          )}
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
