import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { getArticulosInsumos, ArticuloInsumo, deleteInsumoXId } from '../../../service/ServiceInsumos'; // Asegúrate de que la ruta sea correcta
// import FormularioInsumo from '../formularios/FormularioInsumo'; // Asegúrate de importar el componente FormularioInsumo desde la ruta correcta
import FormularioInsumoModificar from '../formularios/FromularioInsumoModificar';
type DataIndex = keyof ArticuloInsumo;


const TablaInsumo: React.FC = () => {



  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<ArticuloInsumo[]>([]); // Estado para almacenar los datos
  const [, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | null>(null); // Estado para almacenar los datos del insumo seleccionado

  useEffect(() => {
    // Llamar a getArticulosInsumos cuando el componente se monta
    getArticulosInsumos().then(setData);
  }, []);

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
  ): TableColumnType<ArticuloInsumo> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
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
      record[dataIndex]
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
  const showDeleteConfirm = async (id: string) => {
    // Show a confirmation dialog...
    console.log(id);
    
    // If the user confirms, delete the insumo
    await deleteInsumoXId(id);
    window.location.reload();
};
  const handleEdit = (record: ArticuloInsumo) => {
    if (record.id) {
      setSelectedInsumo(record);
      setModalVisible(true);
    } else {
      console.error("El ID del insumo es nulo o no está definido.");
    }
  };
  const columns: TableColumnsType<ArticuloInsumo> = [
    {
      title: 'Codigo',
      dataIndex: 'codigo',
      key: 'codigo',
      width: '20%',
      ...getColumnSearchProps('codigo'),
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['descend', 'ascend'],
      },
    
    {
      title: 'Denominacion',
      dataIndex: 'denominacion',
      key: 'denominacion',
      ...getColumnSearchProps('denominacion'),
      sorter: (a, b) => a.denominacion.localeCompare(b.denominacion),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Precio de Compra',
      dataIndex: 'precioCompra',
      key: 'precioCompra',
      ...getColumnSearchProps('precioCompra'),
      sorter: (a, b) => a.precioCompra - b.precioCompra,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Precio de Venta',
      dataIndex: 'precioVenta',
      key: 'precioVenta',
      ...getColumnSearchProps('precioVenta'),
      sorter: (a, b) => a.precioVenta - b.precioVenta,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Stock Actual',
      dataIndex: 'stockActual',
      key: 'stockActual',
      ...getColumnSearchProps('stockActual'),
      sorter: (a, b) => a.stockActual - b.stockActual,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Stock Maximo',
      dataIndex: 'stockMaximo',
      key: 'stockMaximo',
      ...getColumnSearchProps('stockMaximo'),
      sorter: (a, b) => a.stockMaximo - b.stockMaximo,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Es para Elaborar',
      dataIndex: 'esParaElaborar',
      key: 'esParaElaborar',
      render: (esParaElaborar: boolean) => esParaElaborar ? 'Sí' : 'No',
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_text: string, record: ArticuloInsumo) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined /></a>
          <a onClick={() => showDeleteConfirm(record.id.toString())}><DeleteOutlined /></a>
        </Space>
      ),
    },
  ];

  const handleModalClose = () => {
    setModalVisible(false);
  };


  return (
    <>
      <Table
        columns={columns}
        dataSource={data.map(item => ({ ...item, key: item.id }))}
        pagination={{ pageSizeOptions: ['5', '10', '20', '30', '50', '100'], showSizeChanger: true }}
      />
    {selectedInsumo && <FormularioInsumoModificar onClose={handleModalClose}  id={selectedInsumo.id} />}
    </>
  );
}
export default TablaInsumo;