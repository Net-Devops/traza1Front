import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Tree, Switch } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const { TreeNode } = Tree;
type Category = {
  id: number;
  denominacion: string;

};
const CategoryInput = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState("");
  const [updateKey, setUpdateKey] = useState(Date.now());
  const [addSubcategoryModalVisible, setAddSubcategoryModalVisible] =
    useState(false);
  const [denominacion, setDenominacion] = useState("");


  const [selectedParentCategory, setSelectedParentCategory] =
    useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [updateKey]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/categorias/traer-todo/"
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setEditCategoryName(category.denominacion);
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
      if (editingCategory === null) {
        throw new Error("No se puede editar la categoría seleccionada");
      }
      url = `http://localhost:8080/api/categorias/${editingCategory.id}`;
      body = { denominacion: editCategoryName };

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
        content: `Hubo un problema al intentar editar. Error: ${error}`,
      });
    }
  };

  const handleSwitchChange = async (checked: any, item: any) => {
    try {
      let url, method;
      if (checked) {
        url = `http://localhost:8080/api/categorias/reactivate/${item.id}`;
        method = "POST";
      } else {
        url = `http://localhost:8080/api/categorias/${item.id}`;
        method = "DELETE";
      }
      const response = await fetch(url, { method });
      if (response.ok) {
        setUpdateKey(Date.now());
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

  const openAddSubcategoryModal = (category: any) => {
    setSelectedParentCategory(category);
    setAddSubcategoryModalVisible(true);
  };

  const handleAddSubcategory = async () => {
    try {
      if (selectedParentCategory === null)
        throw new Error("No se ha seleccionado una categoría padre");
      
      const response = await fetch(
        `http://localhost:8080/api/categorias/agregar/subcategoria/${selectedParentCategory.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ denominacion: denominacion }),
        }
      );
      if (response.ok) {
        setUpdateKey(Date.now());
        setAddSubcategoryModalVisible(false);
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

  const handleCancelAddSubcategory = () => {
    setAddSubcategoryModalVisible(false);
    setSelectedParentCategory(null);
  };

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => (
      <TreeNode
        title={
          <div>
            <span>{item.denominacion}</span>
            <Switch
              checked={!item.eliminado}
              onChange={(checked) => handleSwitchChange(checked, item)}
              style={{ marginLeft: 10 }}
            />
            <Button
              onClick={() => handleEditCategory(item)}
              type="primary"
              icon={<EditOutlined />}
              disabled={item.eliminado}
              style={{ marginLeft: 10 }}
            />
            <Button
              onClick={() => openAddSubcategoryModal(item)}
              type="primary"
              icon={<PlusOutlined />}
              disabled={item.eliminado}
              style={{ marginLeft: 10 }}
            />
          </div>
        }
        key={item.id}
      >
        {item.subCategoriaDtos &&
          item.subCategoriaDtos.length > 0 &&
          renderTreeNodes(item.subCategoriaDtos)}
        {item.subSubCategoriaDtos &&
          item.subSubCategoriaDtos.length > 0 &&
          renderTreeNodes(item.subSubCategoriaDtos)}
      </TreeNode>
    ));
  return (
    <div>
      <Tree>{renderTreeNodes(categories)}</Tree>
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
      <Modal
        title="Agregar SubCategoría"
        visible={addSubcategoryModalVisible}
        onCancel={handleCancelAddSubcategory}
        onOk={handleAddSubcategory}
      >
        <p>
          ¿Desea agregar una nueva subcategoría a{" "}
          {selectedParentCategory?.denominacion}?
        </p>
        <Input
          placeholder="Ingrese la denominación de la subcategoría"
          onChange={(e) => setDenominacion(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default CategoryInput;
