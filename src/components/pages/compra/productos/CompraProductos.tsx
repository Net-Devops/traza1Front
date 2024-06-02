import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductosPorCategoria } from "../../../../service/Compra";

const CompraProductos = () => {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductosPorCategoria(Number(categoriaId));
      setProductos(data);
    };
    fetchData();
  }, [categoriaId]);

  const verDetalle = (productoId: number) => {
    navigate(`/compra/productos/${categoriaId}/${productoId}`);
  };

  return (
    <div>
      <h1>Productos</h1>
      <div>
        {productos.map((producto: { id: number; denominacion: string }) => (
          <div key={producto.id}>
            {producto.denominacion}
            <button onClick={() => verDetalle(producto.id)}>
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompraProductos;
