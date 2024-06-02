import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategorias } from "../../../../service/Compra"; // Asegúrate de importar tu servicio

const CompraCategoria = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategorias();
      setCategorias(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Elige una categoría</h1>
      <div>
        {categorias.map((categoria: { id: number; denominacion: string }) => (
          <button
            key={categoria.id}
            onClick={() => navigate(`/compra/productos/${categoria.id}`)}
          >
            {categoria.denominacion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompraCategoria;
