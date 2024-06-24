import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Switch, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Empleado } from '../../../service/EmpleadoService';
import { getInsumoXSucursal } from '../../../service/ServiceInsumos';
import FormularioEmpleadoModificar from '../formularios/FormularioEmpleadoModificar';
// Asegúrate de que FormularioEmpleadoModificar esté importado correctamente si se va a utilizar

type DataIndex = keyof Empleado;
type TablaEmpleadosProps = {
  empresaId?: string; // Asumiendo que empresaId podría no usarse
  sucursalId: string;
};

const TablaEmpleados: React.FC<TablaEmpleadosProps> = ({ sucursalId }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<Empleado[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Empleado | null>(null);

  const [showFormularioEmpleado, setShowFormularioEmpleado] = useState(false);

  useEffect(() => {
    fetchData();
  }, [sucursalId]);

  const fetchData = async () => {
    try {
      const data = await getInsumoXSucursal(sucursalId);
      setData(data);
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Empleado> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters || (() => { }))}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record [dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

//   const handleSwitchChange = async (checked: boolean, record: ArticuloInsumo) => {
//     try {
//       if (checked) {
//         await activarInsumoXId(record.id.toString());
//       } else {
//         await deleteInsumoXId(record.id.toString());
//       }
//       // Actualizar los datos después de cambiar el estado
//       const updatedData = await getInsumoXSucursal(sucursalId);
//       setData(updatedData);
//     } catch (error) {
//       console.error('Error al actualizar el estado del insumo:', error);
//     }
//   };

  const handleEdit = (record: Empleado) => {
    if (record.id) {
      setSelectedEmpleado(record);
      setIsModalVisible(true);
    } else {
      console.error("El ID del empleado es nulo o no está definido.");
    }
  };

  const handleEditStock = (record: Empleado) => {
    if (record.id) {
      setCurrentRecord(record);
      setIsModalVisible(true);
    } else {
      console.error("El ID del empleado es nulo o no está definido.");
    }
  };

  const handleCloseStock = async () => {
    setIsModalVisible(false);
    setCurrentRecord(null);

    try {
      // Actualizar los datos después de cerrar el formulario de stock
      const updatedData = await getInsumoXSucursal(sucursalId);
      setData(updatedData);
    } catch (error) {
      console.error('Error al obtener los insumos actualizados:', error);
    }
  };

  const handleModalClose = async () => {
    setModalVisible(false);
    setSelectedEmpleado(null);

    try {
      // Actualizar los datos después de cerrar el formulario de edición de insumo
      const updatedData = await getInsumoXSucursal(sucursalId);
      setData(updatedData);
    } catch (error) {
      console.error('Error al obtener los insumos actualizados:', error);
    }
  };

  const columns: TableColumnsType<Empleado> = [
    {
        title: 'Imagen',
        dataIndex: 'url',
        key: 'image',
        render: (_text, record) => (
          <img src={`http://localhost:8080/images/${record.imagen}`} style={{ width: '50px' }} alt="Imagen" />
        ),
      },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      ...getColumnSearchProps('nombre'),
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
      ...getColumnSearchProps('apellido'),
      sorter: (a, b) => a.apellido - b.apellido,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) => a.email - b.email,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Telefono',
      dataIndex: 'telefono',
      key: 'telefono',
      ...getColumnSearchProps('telefono'),
      sorter: (a, b) => a.telefono - b.telefono,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      ...getColumnSearchProps('rol'),
      sorter: (a, b) => a.rol - b.rol,
      sortDirections: ['descend', 'ascend'],
    },
 
   
    {
      title: 'Acción',
      key: 'action',
      render: (_text: string, record: Empleado) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined /></a>
          <Switch
            checked={!record.eliminado}
            // onChange={(checked) => handleSwitchChange(checked, record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
     <Table
        columns={columns}
        dataSource={data.map(item => ({ ...item, key: item.id }))}
        pagination={{ pageSizeOptions: ['5', '10', '20', '30', '50', '100'], showSizeChanger: true }}
      />
     {showFormularioEmpleado && selectedEmpleado && (
        <FormularioEmpleadoModificar
          visible={showFormularioEmpleado}
          onClose={() => setShowFormularioEmpleado(false)}
          onSubmit={(values) => {
            // Handle the submit action
            console.log('Submitted values:', values);
            setShowFormularioEmpleado(false);
          }}
          initialValues={selectedEmpleado}
          sucursalId={sucursalId}
          productoId={selectedEmpleado.id.toString()}
        />
      )}
     
    </>
  );
}

export default TablaEmpleados;
