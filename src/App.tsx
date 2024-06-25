import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import Sider from "./components/element/menuLateral/Sider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
