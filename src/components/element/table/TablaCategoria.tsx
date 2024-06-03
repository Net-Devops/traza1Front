import React, { useState, useEffect } from "react";
import { Button, Input, List, Switch, Modal, Drawer } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const CategoryInput = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState("");
  const [updateKey, setUpdateKey] = useState(Date.now());
  
  useEffect(() => {
    fetchCategories();
  }, [updateKey]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/categorias/traer-todo/"
      );
      const data = await response.json();
      const sortedCategories = data
        .map((category) => ({
          ...category,
          subCategoriaDtos: category.subCategoriaDtos
            ? category.subCategoriaDtos.sort((a, b) =>
                a.denominacion.localeCompare(b.denominacion)
              )
            : [],
        }))
        .sort((a, b) => a.denominacion.localeCompare(b.denominacion));
      setCategories(sortedCategories);

      if (selectedCategory) {
        const updatedSelectedCategory = sortedCategories.find(
          (cat) => cat.id === selectedCategory.id
        );
        setSelectedCategory(updatedSelectedCategory);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.denominacion);
  };

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory);
    setEditSubcategoryName(subcategory.denominacion);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName("");
    setEditingSubcategory(null);
    setEditSubcategoryName("");
  };

  const handleSaveEdit = async () => {
    try {
      let url, body;
      if (editingCategory) {
        url = `http://localhost:8080/api/categorias/${editingCategory.id}`;
        body = { denominacion: editCategoryName };
      } else if (editingSubcategory) {
        url = `http://localhost:8080/api/categorias/${editingSubcategory.id}`;
        body = { denominacion: editSubcategoryName };
      }
      
      console.log('Saving:', url, body); // Logging the URL and body

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      setUpdateKey(Date.now());
      fetchCategories();
      handleCancelEdit();
    } catch (error) {
      console.error("Error al editar:", error);
      Modal.error({
        title: "Error al editar",
        content: `Hubo un problema al intentar editar. Error: ${error.message}`,
      });
    }
  };

  const handleSwitchChange = async (checked, item, isSubcategory) => {
    try {
      let url, method;
      if (checked) {
        url = isSubcategory
          ? `http://localhost:8080/api/categorias/reactivate/${item.id}`
          : `http://localhost:8080/api/categorias/reactivate/${item.id}`;
        method = "POST";
      } else {
        url = isSubcategory
          ? `http://localhost:8080/api/categorias/${item.id}`
          : `http://localhost:8080/api/categorias/${item.id}`;
        method = "DELETE";
      }
      const response = await fetch(url, {
        method: method,
      });
      if (response.ok) {
        setUpdateKey(Date.now());
        fetchCategories(); // Actualizar las categorías después de modificar
      } else {
        Modal.error({
          title: "Error al realizar la operación",
          content:
            "Hubo un problema al intentar realizar la operación. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al realizar la operación:", error);
    }
  };

  const handleAddSubcategory = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/categorias/agregar/subcategoria/${categoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ denominacion: "Nueva subcategoría" }),
        }
      );
      if (response.ok) {
        setUpdateKey(Date.now());
        fetchCategories();
      } else {
        Modal.error({
          title: "Error al agregar subcategoría",
          content:
            "Hubo un problema al intentar agregar la subcategoría. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al agregar subcategoría:", error);
    }
  };

  const showDrawer = (category) => {
    setSelectedCategory(category);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSwitchChangeInDrawer = async (checked, subcategory) => {
    try {
      let url = `http://localhost:8080/api/categorias/${subcategory.id}`;
      let method = "DELETE";

      if (checked) {
        url = `http://localhost:8080/api/categorias/reactivate/${subcategory.id}`;
        method = "POST";
      }

      const response = await fetch(url, { method });

      if (response.ok) {
        setUpdateKey(Date.now());
        fetchCategories(); // Actualizar las categorías después de modificar
      } else {
        Modal.error({
          title: "Error al realizar la operación",
          content:
            "Hubo un problema al intentar realizar la operación. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al realizar la operación:", error);
    }
  };

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <List
            bordered
            dataSource={[category]}
            renderItem={(categoryItem) => (
              <List.Item
                key={categoryItem.id}
                style={{
                  padding: "3px",
                  backgroundColor: categoryItem.eliminado
                    ? "#FFB6C1"
                    : "#D3D3D3",
                }}
                actions={[
                  <Switch
                    checked={!categoryItem.eliminado}
                    onChange={(checked) =>
                      handleSwitchChange(checked, categoryItem, false)
                    }
                  />,
                  <Button
                    onClick={() => handleEditCategory(categoryItem)}
                    type="primary"
                    disabled={categoryItem.eliminado===true}
                  >
                    <EditOutlined />
                  </Button>,
                  <Button
                    onClick={() => showDrawer(categoryItem)}
                    type="primary"
                    disabled={categoryItem.eliminado===true}
                  >
                    SubCategorias
                  </Button>,
                ]}
              >
                <List.Item.Meta title={categoryItem.denominacion} />
              </List.Item>
            )}
          />
        </div>
      ))}
      {editingCategory && (
        <Modal
          title="Editar Categoría"
          visible={!!editingCategory}
          onCancel={handleCancelEdit}
          onOk={handleSaveEdit}
        >
          <Input
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
        </Modal>
      )}
      {editingSubcategory && (
        <Modal
          title="Editar Subcategoría"
          visible={!!editingSubcategory}
          onCancel={handleCancelEdit}
          onOk={handleSaveEdit}
        >
          <Input
            value={editSubcategoryName}
            onChange={(e) => setEditSubcategoryName(e.target.value)}
          />
        </Modal>
      )}
      <Drawer
        title="Categoria"
        placement="right"
        closable={false}
        onClose={onCloseDrawer}
        visible={drawerVisible}
      >
        {selectedCategory && (
          <div>
            <h1>{selectedCategory.denominacion}</h1>
            <p>
              <h2>SubCategorias:</h2>
            </p>
            <List
              style={{ padding: "3px" }}
              bordered
              dataSource={selectedCategory.subCategoriaDtos}
              renderItem={(subcategory) => (
                <List.Item
                  key={subcategory.id}
                  style={{
                    backgroundColor: subcategory.eliminado
                      ? "#FFB6C1"
                      : "#98FB98",
                  }}
                  actions={[
                    <Switch
                      checked={!subcategory.eliminado}
                      onChange={(checked) =>
                        handleSwitchChangeInDrawer(checked, subcategory)
                      }
                    />,
                    <Button
                      onClick={() => handleEditSubcategory(subcategory)}
                      type="primary"
                      disabled={subcategory.eliminado===true  }
                    >
                      <EditOutlined />
                    </Button>,
                  ]}
                >
                  {subcategory.denominacion as string}
                </List.Item>
              )}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddSubcategory(selectedCategory.id)}
              
            >
              Agregar SubCategoria
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CategoryInput;
