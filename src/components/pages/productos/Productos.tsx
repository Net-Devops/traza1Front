
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

const ProductosPage: React.FC = () => {
  const { empresa } = useSelector((state: any) => state);

  useEffect(() => {
    console.log("estado global: ", empresa);
  }, [empresa]);

  return (
    <div>
      <h1>Productos</h1>
      <div>
        {/* Asegúrate de que "empresa" es un objeto y tiene las propiedades que estás tratando de acceder */}
        <p>Empresa: {empresa.idEmpresa}</p>
        <p>Sucursal: {empresa.idSucursal}</p>
    
        {/* Agrega más campos según sea necesario */}
      </div>
    </div>
  );
};

export default ProductosPage;