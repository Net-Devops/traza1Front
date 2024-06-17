import  { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Upload,
  Button,
  Switch,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  modificarInsumoId,
  getInsumoXId,
  getUnidadMedida,
} from "../../../service/ServiceInsumos";

interface FormularioInsumoProps {
  onClose: () => void;
  id: number;
}

interface ImageData {
  id: string;
  name: string;
  status: string;
  url: string;
}
interface unidadMedida {
  id: number;
  denominacion: string;
}

const FormularioInsumoModificar: React.FC<FormularioInsumoProps> = ({
  onClose,
  id,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(null);
  const [form] = Form.useForm();
  const [images, setImages] = useState<ImageData[]>([]);
  const [, setIsSwitchOn] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState<unidadMedida[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInsumoXId(id.toString());
        setFormData(data);
        console.log("data: ", data);

        form.setFieldsValue(data);
        form.setFieldsValue({ unidadMedida: data.unidadMedida.id }); // Set the unit of measure in the form
        setIsModalVisible(true);

        const imagesData = data.imagenes.map(
          (img: { id: string; url: string }) => ({
            id: img.id,
            name: `image-${img.id}.jpeg`,
            status: "done",
            url: img.url,
          })
        );

        setImages(imagesData);
      } catch (error) {
        console.error("Error al obtener datos del insumo:", error);
      }
    };

    fetchData();
  }, [id, form]);
  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      const data = await getUnidadMedida();
      setUnidadesMedida(data);
    };

    fetchUnidadesMedida();
  }, []);
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const onFinish = async (values: any) => {
  try {
    let uploadedImages = [];
    // Si se han subido nuevas imágenes, procesarlas
    if (values.uploadImagenes) {
      uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        values.uploadImagenes.map(async (file: any) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Eliminar 'data:image/jpeg;base64,' del inicio de la cadena
              const base64String = (reader.result as string).replace(
                /^data:image\/\w+;base64,/,
                ""
              );
              resolve({ url: base64String });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file.originFileObj);
          });
        })
      );
    }

    // Si hay imágenes existentes, agregarlas a las imágenes subidas
    if (images.length > 0) {
      const existingImages = images.map((image) => ({
        url: image.url,
      }));
      uploadedImages = [...uploadedImages, ...existingImages];
    }

    values.uploadImagenes = uploadedImages;

    // Convert the unidadMedida string to an object
    const unidadMedidaMap: { [key: string]: string } = {
      
      // Add more mappings as needed
    };
    values.unidadMedida = {
      id: values.unidadMedida,
      denominacion: unidadMedidaMap[values.unidadMedida],
    };

    console.log("values:", values);

    await modificarInsumoId(values, formData.id);
    onClose();
  } catch (error) {
    console.error("Error al modificar insumo:", error);
  }
  setIsModalVisible(false);
  onClose();
  window.location.reload();

};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };

  const handleDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const [, setUnidadMedida] = useState({
    id: "",
    denominacion: "",
  });

  const handleUnidadMedidaChange = (value: string) => {
    // Update the unidadMedida state
    setUnidadMedida({ id: value, denominacion: "kilogramo" });
  };
  return (
    <Modal
      title="Modificar Insumo"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Codigo" name="codigo">
              <Input />
            </Form.Item>
            <Form.Item label="Stock actual" name="stockActual">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Precio de venta" name="precioVenta">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Unidad de Medida" name="unidadMedida">
              <Select onChange={handleUnidadMedidaChange}>
                {unidadesMedida.map((unidad) => (
                  <Select.Option value={unidad.id}>
                    {unidad.denominacion}
                  </Select.Option>
                ))}{" "}
                // Map the units of measure to create the Select options
              </Select>
            </Form.Item>
            <Form.Item label="Foto">
              <Image.PreviewGroup>
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <Image
                      src={`data:image/jpeg;base64,${image.url}`}
                      alt={image.name}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <button
                      onClick={() => handleDelete(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(255, 255, 255, 0.7)",
                        border: "none",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </Image.PreviewGroup>
            </Form.Item>
            <Form.Item
              label="Agregar Foto"
              name="uploadImagenes"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload listType="picture-card" beforeUpload={() => false}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Denominación" name="denominacion">
              <Input />
            </Form.Item>
            <Form.Item label="Stock máximo" name="stockMaximo">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Precio de compra" name="precioCompra">
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Es para elaborar"
              name="esParaElaborar"
              valuePropName="checked"
            >
              <Switch onChange={setIsSwitchOn} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="default"
            style={{ marginRight: "10px" }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Modificar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioInsumoModificar;