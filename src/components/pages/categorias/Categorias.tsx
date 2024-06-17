import React, { useState, useEffect } from 'react';
import { Select, Button, Row, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import TablaCategoria from '../../element/table/TablaCategoria';
import NuevaCategoria from '../../element/botones/BotonAgregarCategoria';

const { Option } = Select;

export default function Categorias() {
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { empresa } = useSelector((state: any) => state);
  const navigate = useNavigate(); // Cambiado a useNavigate

  useEffect(() => {
    console.log("estado global: ", empresa);
    if (!empresa || !empresa.idEmpresa) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  }, [empresa]);

  useEffect(() => {
    if (empresa && empresa.idEmpresa) {
      fetch(`http://localhost:8080/api/sucursal/lista-sucursal/${empresa.idEmpresa}`)
        .then(response => response.json())
        .then(data => Array.isArray(data) ? setSucursales(data) : setSucursales([]))
        .catch(error => {
          console.error("Error fetching sucursales:", error);
          setSucursales([]);
        });
    }
  }, [empresa]);

  const handleSucursalChange = (value: string) => {
    setSelectedSucursal(value);
    // Aquí puedes manejar la lógica después de seleccionar una sucursal
  };

  const handleEmpresaRedirect = () => {
    navigate('/empresas'); // Cambia '/ruta-a-empresas' por la ruta real a tu página de selección de empresa
  };

  return (
    <div>
      <Modal
        title="Selecciona una Empresa"
        visible={isModalVisible}
        footer={null}
        closable={false}
      >
        <p>Por favor, selecciona una empresa para continuar.</p>
        <Button type="primary" onClick={handleEmpresaRedirect}>
          Ir a Selección de Empresa
        </Button>
      </Modal>

      {empresa && empresa.idEmpresa && (
        <>
          <Row style={{ display: 'flex', backgroundColor: '#a5a5a5', borderRadius: '8px', padding: '20px', width: '100%', margin: '0 auto' }}>
            <h1>Categorias</h1>
            <Select
                value={empresa.idSucursal} // Add null check before accessing id property
                onChange={handleSucursalChange}
                placeholder="Selecciona una sucursal"
                style={{ width: 200, marginLeft: '30%' }} // Limita el ancho del selector a 200px
            >
                {Array.isArray(sucursales) && sucursales.map((sucursal) => (
                    <Option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                    </Option>
                ))}
            </Select>
            <NuevaCategoria />
          </Row>
          <TablaCategoria />
        </>
      )}
    </div>
  );
}
