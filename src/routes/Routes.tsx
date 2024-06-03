import React from 'react';
import { Route, Routes } from 'react-router-dom';





import Empresa from '../components/pages/empresa/Empresa';
import Sucursal from '../components/pages/sucursal/Sucursal';
import Categorias from '../components/pages/categorias/Categorias'
import Productos from '../components/pages/productos/Productos';

const Rutas: React.FC = () => {
    return (
      
            <Routes>
             
             <Route path="/" element={<Empresa/>} />
              <Route path='/empresas' element={<Empresa/>}/>
              <Route path="/sucursal/:id" element={<Sucursal/>} />
              <Route path="/categorias" element={<Categorias/>} />
             
              
              <Route path='/productos' element={<Productos/>}/>
            </Routes>
       
      
    );
  }
  
  export default Rutas;