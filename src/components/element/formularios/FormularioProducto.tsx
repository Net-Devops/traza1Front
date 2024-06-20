import  { useEffect, useState, useRef, } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Upload,
  Table,
  Select,
  Row,
  Col,
  Space,
} from "antd";
import axios from "axios";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { ValueType } from "rc-input/lib/interface";

const { Option } = Select;

const NestedModals = () => {
  const searchInput = useRef();

  const [isMainModalVisible, setIsMainModalVisible] = useState(false);
  const [isNestedModalVisible, setIsNestedModalVisible] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [selectedInsumosToAdd, setSelectedInsumosToAdd] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [formValues, setFormValues] = useState({
    denominacion: "",
    descripcion: "",
    codigo: "",
    precioVenta: "",
    imagenes: "",
    unidadMedida: Number,
    tiempoEstimado: "",
    preparacion: "",
  });

  const handleQuantityChange = (value: string, key: any) => {
    setSelectedInsumosToAdd((prevItems) =>
      prevItems.map((item) =>
        item.key === key ? { ...item, cantidad: parseInt(value, 10) || 0 } : item
      )
    );
  };

  const handleAddSelected = () => {
    const selectedToAdd = insumos.filter((insumo) => selectedRowKeys.includes(insumo.id));
    const filteredToAdd = selectedToAdd.filter((item) => 
      !selectedInsumosToAdd.some((selectedItem) => selectedItem.id === item.id)
    );

    setSelectedInsumosToAdd((prevItems) => [
      ...prevItems,
      ...filteredToAdd.map((item) => ({ ...item, cantidad: 0 })),
    ]);
    setSelectedRowKeys([]);
  };

  const handleOpenAddInsumosModal = () => {
    setIsNestedModalVisible(false);
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (value: NumberConstructor, field: string) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleSearch = (selectedKeys: SetStateAction<string>[], confirm: () => void, dataIndex: SetStateAction<string>) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: SetStateAction<string>) => ({
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
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: { [x: string]: { toString: () => string; }; }) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text: { toString: () => string; }) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/articulos/insumos/")
      .then((response) => {
        const dataWithKeys = response.data.map((item: { id: { toString: () => any; }; }) => ({
          ...item,
          key: item.id.toString(),
        }));
        setInsumos(dataWithKeys);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const columns = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      ...getColumnSearchProps("codigo"),
    },
    {
      title: "Denominación",
      dataIndex: "denominacion",
      key: "denominacion",
      ...getColumnSearchProps("denominacion"),
    },
  ];

  const insumoColumns = [
    ...columns,
    {
      title: "Cantidad",
      key: "cantidad",
      render: (_: any, record: { cantidad: ValueType; key: any; }) => (
        <Input
          type="number"
          min={0}
          value={record.cantidad}
          onChange={(e) => handleQuantityChange(e.target.value, record.key)}
        />
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: SetStateAction<never[]>) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const showMainModal = () => {
    setIsMainModalVisible(true);
  };

  const handleMainModalOk = () => {
    const imagenes = formValues.imagenes ? formValues.imagenes.fileList.map((file: { url: any; thumbUrl: any; }) => ({ url: file.url || file.thumbUrl })) : [];
  
    // Transform form data to match API structure
    const formData = {
      denominacion: formValues.denominacion,
      descripcion: formValues.descripcion,
      codigo: formValues.codigo,
      precioVenta: parseFloat(formValues.precioVenta),
      unidadMedida: {
        id: formValues.unidadMedida,
      },
      imagenes: imagenes,
      tiempoEstimadoMinutos: parseInt(formValues.tiempoEstimado, 10),
      preparacion: formValues.preparacion,
    articuloManufacturadoDetalles: selectedInsumosToAdd.map(insumo => ({
        cantidad: insumo.cantidad,
        articuloInsumo: {
            id: insumo.id || 0, // Add a default value for 'id' if it is undefined or null
        },
    })),
    };

    // Send POST request
    axios.post("http://localhost:8080/api/articulos/manufacturados/", formData)
      .then(response => {
        console.log("Data submitted successfully:", response.data);
        setIsMainModalVisible(false);
        window.location.reload();
      })
      .catch(error => {
        console.error("There was an error submitting the data:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      });
  };

  const handleMainModalCancel = () => {
    setIsMainModalVisible(false);
  };

  const showNestedModal = () => {
    setIsNestedModalVisible(true);
  };

  const handleNestedModalOk = () => {
    setIsNestedModalVisible(false);
  };

  const handleNestedModalCancel = () => {
    setIsNestedModalVisible(false);
  };

  const normFile = (e: { fileList: any; }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleInsumosCancel = () => {
    setIsNestedModalVisible(false);
  };

  const selectedInsumosColumns = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
    },
    {
      title: "Denominación",
      dataIndex: "denominacion",
      key: "denominacion",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Unidad",
      dataIndex: ["unidadMedida", "denominacion"],
      key: "unidad",
    },
    {
      title: "Acción",
      key: "accion",
      render: (_: any, record: any) => (
        <Button onClick={() => handleRemove(record)}>Eliminar</Button>
      ),
    },
  ];

  let dataSource = [...insumos];

  if (searchText && searchedColumn) {
    dataSource = dataSource.filter((insumo) =>
      insumo[searchedColumn]
        ? insumo[searchedColumn].toString().toLowerCase().includes(searchText.toLowerCase())
        : ""
    );
  }

  const handleRemove = (record: { key: any; }) => {
    setSelectedInsumosToAdd((prevItems) =>
      prevItems.filter((item) => item.key !== record.key)
    );
  };

  return (
    <div>
      <Button type="primary" onClick={showMainModal}>
        Agregar Productos
      </Button>
      <Modal
        title="Productos"
        visible={isMainModalVisible}
        onOk={handleMainModalOk}
        onCancel={handleMainModalCancel}
        width={800}
      >
        <Form layout="vertical">
          <Form.Item label="Código">
            <Input
              placeholder="Código"
              name="codigo"
              value={formValues.codigo}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item label="Denominación">
            <Input
              placeholder="Denominación"
              name="denominacion"
              value={formValues.denominacion}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item label="Descripción">
            <Input
              placeholder="Descripción"
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item label="Preparación">
            <Input
              placeholder="Preparación"
              name="preparacion"
              value={formValues.preparacion}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item label="Tiempo Estimado en Minutos">
            <Input
              placeholder="Tiempo Estimado en Minutos"
              name="tiempoEstimado"
              value={formValues.tiempoEstimado}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item label="Precio de Venta">
            <Input
              placeholder="Precio de Venta"
              name="precioVenta"
              value={formValues.precioVenta}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item label="Unidad de Medida">
            <Select
              placeholder="Unidad de Medida"
              value={formValues.unidadMedida}
              onChange={(value) => handleSelectChange(value, "unidadMedida")}
              style={{ width: "100%" }}
            >
              <Option value={1}>kg</Option>
    <Option value={2}>litro</Option>
              
            </Select>
          </Form.Item>

          <Form.Item
            label="Imagenes"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card">
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>

          <Form.Item label="Insumos Seleccionados">
            <Table
              dataSource={selectedInsumosToAdd}
              columns={selectedInsumosColumns}
              rowKey="id"
              pagination={false}
            />
          </Form.Item>
        </Form>

        <Button type="primary" onClick={showNestedModal}>
          Agregar Insumos
        </Button>
        <Modal
          title="Agregar Insumos"
          visible={isNestedModalVisible}
          onOk={handleNestedModalOk}
          onCancel={handleNestedModalCancel}
          width={1000}
          footer={[
            <Button key="back" onClick={handleInsumosCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleOpenAddInsumosModal}>
              Agregar Insumos
            </Button>,
          ]}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                rowSelection={rowSelection}
              />
              <Button
                type="primary"
                onClick={handleAddSelected}
                disabled={selectedRowKeys.length === 0}
              >
                Agregar Seleccionados
              </Button>
              <Table
                dataSource={selectedInsumosToAdd}
                columns={insumoColumns}
                pagination={false}
                style={{ marginTop: 20 }}
              />
            </Col>
          </Row>
        </Modal>
      </Modal>
    </div>
  );
};

export default NestedModals;
