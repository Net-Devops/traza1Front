import React, { useState, useEffect } from "react";
import {  Tree, FloatButton } from "antd";
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
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
  selectedSucursal: string | null;
};

const ArbolCategoriaPorSucursal: React.FC<CategoryInputProps> = ({ selectedEmpresa, selectedSucursal }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  
 
  const [updateKey, ] = useState<number>(Date.now());
 
  useEffect(() => {
    if (selectedEmpresa !== null && selectedSucursal !== null) {
      fetchCategories();
    }
  }, [selectedEmpresa, selectedSucursal, updateKey]);

  const fetchCategories = async () => {
    try {
      if (!selectedEmpresa || !selectedSucursal) return;

      const url = `http://localhost:8080/api/local/traerTodo/${selectedSucursal}`;
      const response = await fetch(url);
      const data: Category[] = await response.json();

      const sortedData = data.sort((a, b) => a.id - b.id);
      setCategories(sortedData);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const renderTreeNodes = (data: Category[]): React.ReactNode =>
    data.map((item) => (
      <TreeNode
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ textDecoration: item.eliminado ? 'line-through' : 'none' }}>
              {item.denominacion}
            </span>
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
      <FloatButton.Group shape="circle" style={{ right: 40 }}>
      <FloatButton icon={<CheckOutlined /> } />
      
      <FloatButton icon={<DeleteOutlined /> } />

    </FloatButton.Group>
    </div>
  );
};

export default ArbolCategoriaPorSucursal;
