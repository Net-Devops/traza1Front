import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerSubCategorias } from "../../../../service/Compra"; // Importa tus funciones

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
      <div>
        {subcategorias.map(
          (subcategoria: { id: number; denominacion: string }) => (
            <button
              key={subcategoria.id}
              onClick={() => handleSubcategoriaClick(subcategoria.id)} // Usa handleSubcategoriaClick
            >
              {subcategoria.denominacion}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default CompraSubCategoria;
