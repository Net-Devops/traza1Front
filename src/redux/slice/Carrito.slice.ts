import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Pedido, Producto } from "../../types/compras/interface";
import { realizarPedido, createPreferenceMP } from "../../service/Compra";

interface PedidoDetalleAddState {
  id: number;
  producto: Producto;
  cantidad: number;
}
interface PedidoDetalleRemoveState {
  id: number;
}

const initialState: PedidoDetalleAddState[] = [];

export const enviarPedido = createAsyncThunk(
  "carrito/enviarPedido",
  async (_, { getState }) => {
    const state = getState() as { cartReducer: PedidoDetalleAddState[] };
    const pedidoDetalle = state.cartReducer;

    const pedido: Pedido = {
      // Aquí puedes agregar cualquier otra propiedad que necesites en tu pedido
      fechaPedido: new Date().toISOString(),
      total: pedidoDetalle.reduce(
        (sum, item) => sum + item.producto.precioVenta * item.cantidad,
        0
      ),

      pedidoDetalle,
    };

    const data = await realizarPedido(pedido);
    if (data) {
      const preferenceMP = await createPreferenceMP(data);
      console.log("preferenciaMp:", preferenceMP);

      // Devuelve el preferenceId
      return preferenceMP.id;
    } else {
      console.error("Error al realizar el pedido");
      throw new Error("Error al realizar el pedido");
    }
  }
);

export const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    addToCarrito: (state, action: PayloadAction<PedidoDetalleAddState>) => {
      const { id, cantidad } = action.payload;
      const productoExistente = state.find((item) => item.id === id);

      if (productoExistente) {
        // Si el producto ya existe en el carrito, aumenta su cantidad
        productoExistente.cantidad += cantidad;
      } else {
        // Si el producto no existe en el carrito, lo agrega
        state.push(action.payload);
      }
    },
    removeToCarrito: (
      state,
      action: PayloadAction<PedidoDetalleRemoveState>
    ) => {
      const { id } = action.payload;
      const index = state.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    incrementarCantidad: (
      state,
      action: PayloadAction<PedidoDetalleRemoveState>
    ) => {
      const { id } = action.payload;
      const productoExistente = state.find((item) => item.id === id);
      if (productoExistente) {
        productoExistente.cantidad += 1;
      }
    },
    decrementarCantidad: (
      state,
      action: PayloadAction<PedidoDetalleRemoveState>
    ) => {
      const { id } = action.payload;
      const productoExistente = state.find((item) => item.id === id);
      if (productoExistente && productoExistente.cantidad > 1) {
        productoExistente.cantidad -= 1;
      }
    },
    cambiarCantidad: (
      state,
      action: PayloadAction<{ id: number; cantidad: number }>
    ) => {
      const { id, cantidad } = action.payload;
      const productoExistente = state.find((item) => item.id === id);
      if (productoExistente) {
        productoExistente.cantidad = cantidad;
      }
    },
    limpiarCarrito: () => {
      return initialState;
    },
  },
});

export const {
  addToCarrito,
  removeToCarrito,
  limpiarCarrito,
  decrementarCantidad,
  incrementarCantidad,
  cambiarCantidad,
} = carritoSlice.actions;
