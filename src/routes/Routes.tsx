import React from "react";
import { Routes, Route } from "react-router-dom";
import Empresa from "../components/pages/empresa/Empresa";
import Sucursal from "../components/pages/sucursal/Sucursal";
import Categorias from "../components/pages/categorias/Categorias";
import Productos from "../components/pages/productos/Productos";
import Insumo from "../components/pages/insumos/Insumos";
import CompraCategoria from "../components/pages/compra/categoria/CompraCategoria";
import CompraProductos from "../components/pages/compra/productos/CompraProductos";
import UnidadMedida from "../components/pages/unidadMedida/UnidadMedida";
import CategoriasPorSucursal from "../components/pages/categorias/CategoriasPorSucursal";
import Promocion from "../components/pages/promocion/Promocion";
import Pedidos from "../components/pages/pedidos/Pedidos";
import SeleccionSucursal from "../components/pages/compra/sucursales/SeleccionSucursal";
import Login from "../components/pages/login-crear/login";
import RegistroCliente from "../components/pages/login-crear/CrearUsuarioCliente";

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
      <Route path="/compra" element={<SeleccionSucursal />} />
      <Route
        path="/compra/categorias/:sucursalId"
        element={<CompraCategoria />}
      />
      <Route
        path="/compra/productos/:categoriaId"
        element={<CompraProductos />}
      />
      <Route path="/promociones" element={<Promocion />} />
      <Route path="/Pedidos" element={<Pedidos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
    </Routes>
  );
};

export default Rutas;
