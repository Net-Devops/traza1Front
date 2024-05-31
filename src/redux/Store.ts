import { configureStore } from "@reduxjs/toolkit"
import empresaReducer from "./slice/empresa/EmpresaRedux"
const store =configureStore({
    reducer: {
         empresa: empresaReducer
    }
});

export default store;