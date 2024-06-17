import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { useSelector } from 'react-redux';

interface Sucursal {
  id: string;
  nombre: string;
}

const AgregarSucursalACatgoria: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>([]);
  const { empresa } = useSelector((state: any) => state);

  useEffect(() => {
    if (empresa && empresa.idEmpresa) {
      fetch(`http://localhost:8080/api/sucursal/lista-sucursal/${empresa.idEmpresa}`)
        .then(response => response.json())
        .then(data => {
          // Mapear los datos recibidos al formato de sucursal
          const formattedData: Sucursal[] = data.map((sucursal: any) => ({
            id: sucursal.id,
            nombre: sucursal.nombre,
          }));
          setSucursales(formattedData);
        })
        .catch(error => console.error("Error fetching sucursales:", error));
    }
  }, [empresa]);

  const handleChange = (selectedSucs: string[]) => {
    setSelectedSucursales(selectedSucs);
  };

  return (
    <Checkbox.Group onChange={handleChange} value={selectedSucursales}>
      {sucursales.map(sucursal => (
        <Checkbox key={sucursal.id} value={sucursal.id}>
          {sucursal.nombre}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};

export default AgregarSucursalACatgoria;
