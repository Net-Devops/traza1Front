import React from "react";
import { Routes, Route } from "react-router-dom";
import Empresa from "../components/pages/empresa/Empresa";
import Sucursal from "../components/pages/sucursal/Sucursal";
import Categorias from "../components/pages/categorias/Categorias";
import Productos from "../components/pages/productos/Productos";
import Insumo from "../components/pages/insumos/Insumos";

import UnidadMedida from "../components/pages/unidadMedida/UnidadMedida";
import CategoriasPorSucursal from "../components/pages/categorias/CategoriasPorSucursal";
import Promocion from "../components/pages/promocion/Promocion";



import Pedidos from "../components/pages/pedidos/Pedidos";


const Rutas: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Empresa />} />
      <Route path="/empresas" element={<Empresa />} />
      <Route path="/sucursal/:id" element={<Sucursal />} />
      <Route path="/categorias" element={<Categorias />} />

   

      <Route
        path="/categorias/porSucursal"
        element={<CategoriasPorSucursal />}
      />

      <Route path="/productos" element={<Productos />} />
      <Route path="/insumos" element={<Insumo />} />
      <Route path="/unidadMedida" element={<UnidadMedida />} />
    
     
      <Route path="/promociones" element={<Promocion />} />
      <Route path="/Pedidos" element={<Pedidos />} />
      
    </Routes>
  );
};

export default Rutas;
