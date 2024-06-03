// CarritoRedux.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Producto, PedidoDetalle } from "../../../entidades/compras/interface";

interface CarritoState {
  items: PedidoDetalle[];
}

const initialState: CarritoState = {
  items: [],
};

export const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    agregarAlCarrito: (state, action: PayloadAction<Producto>) => {
      const producto = action.payload;
      const detallePedidoEnCarrito = state.items.find(
        (detalle) => detalle.producto.id === producto.id
      );

      if (detallePedidoEnCarrito) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        state.items = state.items.map((detalle) =>
          detalle.producto.id === producto.id
            ? { ...detalle, cantidad: detalle.cantidad + 1 }
            : detalle
        );
      } else {
        // Si el producto no está en el carrito, lo agrega con cantidad = 1
        state.items.push({ producto, cantidad: 1 });
      }
    },
    quitarDelCarrito: (state, action: PayloadAction<number>) => {
      const productoId = action.payload;
      const detallePedidoEnCarrito = state.items.find(
        (detalle) => detalle.producto.id === productoId
      );

      if (detallePedidoEnCarrito && detallePedidoEnCarrito.cantidad > 1) {
        // Si la cantidad del producto en el carrito es mayor a 1, decrementa la cantidad
        state.items = state.items.map((detalle) =>
          detalle.producto.id === productoId
            ? { ...detalle, cantidad: detalle.cantidad - 1 }
            : detalle
        );
      } else {
        // Si la cantidad del producto en el carrito es 1, lo quita del carrito
        state.items = state.items.filter(
          (detalle) => detalle.producto.id !== productoId
        );
      }
    },
    limpiarCarrito: (state) => {
      state.items = [];
    },
  },
});

export const { agregarAlCarrito, quitarDelCarrito, limpiarCarrito } =
  carritoSlice.actions;

export default carritoSlice.reducer;
