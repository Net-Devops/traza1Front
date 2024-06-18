import React from "react";
import { Routes, Route } from "react-router-dom";

import Empresa from "../components/pages/empresa/Empresa";
import Sucursal from "../components/pages/sucursal/Sucursal";
import Categorias from "../components/pages/categorias/Categorias";
import Productos from "../components/pages/productos/Productos";
import Insumo from "../components/pages/insumos/Insumos";
import CompraCategoria from "../components/pages/compra/categoria/CompraCategoria";
import CompraProductos from "../components/pages/compra/productos/CompraProductos";
const Rutas: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Empresa />} />
      <Route path="/empresas" element={<Empresa />} />
      <Route path="/sucursal/:id" element={<Sucursal />} />
      <Route path="/categorias" element={<Categorias />} />

      <Route path="/productos" element={<Productos />} />
      <Route path="/insumos" element={<Insumo />} />
      <Route path="/compra/categorias" element={<CompraCategoria />} />
      <Route
        path="/compra/productos/:categoriaId"
        element={<CompraProductos />}
      />
    </Routes>
  );
};

export default Rutas;
