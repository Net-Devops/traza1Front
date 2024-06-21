import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Tree, Switch } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const { TreeNode } = Tree;

type Category = {
  id: number;
  denominacion: string;
  eliminado?: boolean;
  subCategoriaDtos?: Category[];
  subSubCategoriaDtos?: Category[];
  sucursalId?: string;
};

type CategoryInputProps = {
  selectedEmpresa: string | null;
};

const TablaCategoria: React.FC<CategoryInputProps> = ({ selectedEmpresa }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editingSubcategory, setEditingSubcategory] = useState<Category | null>(
    null
  );
  const [editSubcategoryName, setEditSubcategoryName] = useState<string>("");
  const [updateKey, setUpdateKey] = useState<number>(Date.now());
  const [addSubcategoryModalVisible, setAddSubcategoryModalVisible] =
    useState<boolean>(false);
  const [denominacion, setDenominacion] = useState<string>("");

  const [selectedParentCategory, setSelectedParentCategory] =
    useState<Category | null>(null);
    const [treeKey, setTreeKey] = useState<number>(Date.now());

  useEffect(() => {
    if (selectedEmpresa) {
      fetchCategories();
    }
  }, [selectedEmpresa, updateKey]);

  const fetchCategories = async () => {
    try {
      if (!selectedEmpresa) return;

      const url = `http://localhost:8080/api/categorias/porEmpresa/${selectedEmpresa}`;
      const response = await fetch(url);
      const data: Category[] = await response.json();

      const sortedData = data.sort((a, b) => a.id - b.id);
      setCategories(sortedData);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
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
      if (editingCategory === null) {
        throw new Error("No se puede editar la categoría seleccionada");
      }

      const url = `http://localhost:8080/api/categorias/${editingCategory.id}/denominacion`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: editCategoryName, // Envía el string directamente sin convertir a JSON
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      setUpdateKey(Date.now());
      handleCancelEdit();
    } catch (error) {
      console.error("Error al editar:", error);
      Modal.error({
        title: "Error al editar",
        content: `Hubo un problema al intentar editar. Error: ${error}`,
      });
    }
  };

  const handleSwitchChange = async (item: Category) => {
    try {
      const url = `http://localhost:8080/api/categorias/${item.id}/eliminado`;
      const response = await fetch(url, { method: "PUT" });
      if (response.ok) {
        // Actualiza el estado categories con el valor actualizado de eliminado
        const updatedCategories = categories.map((category) =>
          category.id === item.id ? { ...category, eliminado: !category.eliminado } : category
        );
        setCategories(updatedCategories);
        setUpdateKey(Date.now());
        console.log("Categoría actualizada:", item.eliminado);
      } else {
        Modal.error({
          title: "Error al realizar la operación",
          content: "Hubo un problema al intentar realizar la operación. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al realizar la operación:", error);
    }
  };

  const openAddSubcategoryModal = (category: Category) => {
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

  const renderTreeNodes = (data: Category[]): React.ReactNode =>
    data.map((item) => (
      <TreeNode
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ textDecoration: item.eliminado ? 'line-through' : 'none' }}>
              {item.denominacion}
            </span>
            <Switch
              checked={!item.eliminado}
              onChange={() => handleSwitchChange(item)}
              style={{ marginLeft: 10, backgroundColor: item.eliminado ? 'red' : 'green' }}
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
        style={{ color: item.eliminado ? 'gray' : 'inherit' }}
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

export default TablaCategoria;
