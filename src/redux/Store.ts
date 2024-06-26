import empresaReducer from "./slice/EmpresaRedux";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    empresa: empresaReducer,
  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
