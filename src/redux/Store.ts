import empresaReducer from "./slice/EmpresaRedux";
import { configureStore } from "@reduxjs/toolkit";
import { carritoSlice } from "./slice";
import domicilioReducer from "./slice/domicilioSilice";
export const store = configureStore({
  reducer: {
    empresa: empresaReducer,
    cartReducer: carritoSlice.reducer,
    domicilio: domicilioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
