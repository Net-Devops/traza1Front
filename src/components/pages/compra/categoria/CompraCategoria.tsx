import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "antd";
import { obtenerCategoriasPadre } from "../../../../service/Compra";

const CompraCategoria = () => {
  const { sucursalId } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const idNumerico = Number(sucursalId); // Convertir sucursalId a número
      if (!isNaN(idNumerico)) {
        // Verificar si la conversión es exitosa
        const data = await obtenerCategoriasPadre(idNumerico);
        setCategorias(data);
      }
    };
    fetchData();
  }, [sucursalId]);

  const handleCategoriaClick = async (id: number) => {
    navigate(`/compra/productos/${id}`);
  };

  return (
    <div>
      <h1>Elige una categoría</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {categorias.map((categoria: { id: number; denominacion: string }) => (
          <Card
            key={categoria.id}
            onClick={() => handleCategoriaClick(categoria.id)}
            style={{ width: 300, height: 300 }}
            cover={
              <img
                alt="example"
                src={`/src/util/${categoria.denominacion}.jpeg`}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            }
          >
            <Card.Meta title={categoria.denominacion} />
          </Card>
        ))}
      </div>
    </div>
  );
};
export default CompraCategoria;
