import { Route, Routes } from "react-router-dom";
import Login from "../components/pages/login-crear/login";
import RegistroCliente from "../components/pages/login-crear/CrearUsuarioCliente";
import ErrorPage from "../components/User/ErrorPage";
import CallbackPage from "../components/auth0/CallbackPage";

const RutasSinSidebar: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
      <Route path="/callback" element={<CallbackPage />} />
      {/* <Route path="*" element={<ErrorPage />} /> */}
    </Routes>
  );
};
export default RutasSinSidebar;
