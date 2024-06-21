import { useEffect, useRef, useState } from 'react';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

import { deleteProductoXId } from '../../../service/ServiceProducto';
import { getProductoXSucursal } from '../../../service/ServiceProducto';

interface DataType {
  id: number;
  codigo: string;
  imagen: string;
  denominacion: string;
  precioVenta: number;
  descripcion: string;
  tiempoEstimadoCocina: string;
}

type DataIndex = keyof DataType;

interface Props {
  empresaId: string; // Assuming empresaId is a string, adjust the type as necessary
  sucursalId: string;
}

const App: React.FC<Props> = ({ empresaId, sucursalId }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setData([]); // Clear the data before fetching new products
      try {
        const data = await getProductoXSucursal(sucursalId); // Use sucursalId from props
        setData(data);
      } catch (error) {
        console.error("Error al obtener los productos por sucursal:", error);
      }
    };

    fetchData();
  }, [sucursalId]);

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

  const showDeleteConfirm = async (id: string) => {
    // Show a confirmation dialog...
    console.log(id);
    
    // If the user confirms, delete the insumo
    await deleteProductoXId(id);
   
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
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

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Codigo',
      dataIndex: 'codigo',
      key: 'codigo',
      ...getColumnSearchProps('codigo'),
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Imagen',
      dataIndex: 'url',
      key: 'image', // Identificador único para la columna
      render: (text, record) => (
        <img src={`http://localhost:8080/images/${record.imagen}`} style={{ width: '50px' }} alt="Imagen" />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'denominacion',
      key: 'denominacion',
      ...getColumnSearchProps('denominacion'),
      sorter: (a, b) => a.denominacion.localeCompare(b.denominacion),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Precio',
      dataIndex: 'precioVenta',
      key: 'precioVenta',
      ...getColumnSearchProps('precioVenta'),
      sorter: (a, b) => a.precioVenta - b.precioVenta,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Descripcion',
      dataIndex: 'descripcion',
      key: 'descripcion',
      ...getColumnSearchProps('descripcion'),
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tiempo Estimado Minutos',
      dataIndex: 'tiempoEstimadoCocina',
      key: 'tiempoEstimadoCocina',
      ...getColumnSearchProps('tiempoEstimadoCocina'),
      sorter: (a, b) => a.tiempoEstimadoCocina.localeCompare(b.tiempoEstimadoCocina),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_text: string, record: DataType) => (
        <Space size="middle">
          {/* <a onClick={() => handleEdit(record)}><EditOutlined /></a> */}
          <a onClick={() => showDeleteConfirm(record.id.toString())}><DeleteOutlined /></a>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      pagination={{ pageSizeOptions: ['5', '10', '20', '30', '50', '100'], showSizeChanger: true }} 
    />
  );
};

export default App;
