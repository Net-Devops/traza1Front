import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sider from "./components/element/menuLateral/Sider";
import Rutas from "./routes/Routes"; // Asegúrate de importar correctamente el componente de rutas

const AppContent = () => {
  const location = useLocation();
  const noSiderRoutes = ["/login", "/registro-cliente"];

  return (
    <>
      {!noSiderRoutes.includes(location.pathname) && <Sider />}
      <Rutas />
      <ToastContainer />
    </>
  );
};

const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  </React.StrictMode>
);

// Utiliza ReactDOM.render para renderizar la aplicación
ReactDOM.render(<App />, document.getElementById("root"));
