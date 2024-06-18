import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import AgregarSucursalACatgoria from '../transfer/TransferCategoria'; // Suponiendo que TransferSucursales es el componente para seleccionar sucursales


export default function BotonAgregarCategoria() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', selectedSucursales);
      values.sucursales = selectedSucursales;
      await createCategory(values);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSucursales([]);
  };

  const createCategory = async (values) => {
    try {
      // Convertir los IDs de sucursales en objetos con un campo "id"
      const sucursalesObj = values.sucursales.map(id => ({ id }));
  
      // Asignar la lista de objetos de sucursales al valor "sucursales"
      values.sucursales = sucursalesObj;
  
      const response = await fetch('http://localhost:8080/api/categorias/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={{ width: 200, marginLeft: '30%' }}>
        Nueva Categoria
      </Button>
      <Modal title="Agregar Categoria" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} name="form_in_modal">
          <Form.Item
            name="denominacion"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese la denominación de la categoría!',
              },
            ]}
          >
            <Input placeholder="Nombre de la categoría" />
          </Form.Item>
          <AgregarSucursalACatgoria setSelectedSucursales={setSelectedSucursales} />
        </Form>
      </Modal>
    </>
  );
}
