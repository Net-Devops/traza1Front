import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "antd";
import { obtenerCategoriasPadre } from "../../../../service/Compra";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/Store";

const CompraCategoria = () => {
  const { sucursalId } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const carritoItems = useSelector((state: RootState) => state.cartReducer);

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
  const salirDeSucursal = () => {
    if (carritoItems.length > 0) {
      if (
        window.confirm(
          "Tienes artículos en tu carrito. ¿Estás seguro de que quieres salir? Perderás todos los artículos en tu carrito."
        )
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: "16px" }}
        onClick={salirDeSucursal} // Modificado para usar la nueva función
      >
        Salir de la sucursal
      </Button>
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
