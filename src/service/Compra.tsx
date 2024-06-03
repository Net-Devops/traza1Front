export const getCategorias = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/categorias/traer-todo/"
    );
    if (!response.ok) {
      throw new Error("Error al obtener las categorías");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getProductosPorCategoria = async (categoriaId: number) => {
  console.log("--------------------" + categoriaId + "-------------------");
  try {
    const response = await fetch(
      `http://localhost:8080/api/compra/productos/${categoriaId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los productos por categoría");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getProducto = async (id: number) => {
  const response = await fetch("/buscar-articulo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }

  const data = await response.json();
  return data;
};