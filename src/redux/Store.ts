import { configureStore } from "@reduxjs/toolkit";
import empresaReducer from "./slice/empresa/EmpresaRedux";
import carritoReducer from "./slice/carrito/CarritoRedux";
const store = configureStore({
  reducer: {
    empresa: empresaReducer,
    carrito: carritoReducer,
  },
});

export default store;
