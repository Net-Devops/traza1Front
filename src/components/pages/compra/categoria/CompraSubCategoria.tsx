import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerSubCategorias } from "../../../../service/Compra"; // Importa tus funciones
import { Card } from 'antd';
const CompraSubCategoria = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el id de la categoría padre de los parámetros de la ruta
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerSubCategorias(Number(id)); // Convierte el id a un número antes de pasarlo a obtenerSubCategorias
      setSubcategorias(data);
    };
    fetchData();
  }, [id]);

  const handleSubcategoriaClick = (id: number) => {
    // Navega a la vista de productos de la subcategoría
    navigate(`/compra/productos/${id}`);
  };

  return (
    <div>
      <h1>Elige una subcategoría</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {subcategorias.map((subcategoria: { id: number; denominacion: string }) => (
          <Card
            key={subcategoria.id}
            onClick={() => handleSubcategoriaClick(subcategoria.id)}
            style={{ width: 300, height: 300 }}
           cover={<img alt="example" src={`/src/util/${subcategoria.denominacion}.jpeg`} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
          >
            <Card.Meta title={subcategoria.denominacion} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompraSubCategoria;
