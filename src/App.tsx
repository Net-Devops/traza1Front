import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import Sider from "./components/element/menuLateral/Sider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Sider />
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
