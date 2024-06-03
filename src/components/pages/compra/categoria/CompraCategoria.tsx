import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerCategoriasPadre,
  tieneSubCategorias,
} from "../../../../service/Compra"; // Importa tus funciones

const CompraCategoria = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerCategoriasPadre(); // Usa obtenerCategoriasPadre
      setCategorias(data);
    };
    fetchData();
  }, []);

  const handleCategoriaClick = async (id: number) => {
    const tieneSubs = await tieneSubCategorias(id); // Verifica si la categoría tiene subcategorías
    if (tieneSubs) {
      // Si la categoría tiene subcategorías, navega a la vista de subcategorías
      navigate(`/compra/subcategorias/${id}`);
    } else {
      // Si la categoría no tiene subcategorías, navega a la vista de productos
      navigate(`/compra/productos/${id}`);
    }
  };

  return (
    <div>
      <h1>Elige una categoría</h1>
      <div>
        {categorias.map((categoria: { id: number; denominacion: string }) => (
          <button
            key={categoria.id}
            onClick={() => handleCategoriaClick(categoria.id)} // Usa handleCategoriaClick
          >
            {categoria.denominacion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompraCategoria;
