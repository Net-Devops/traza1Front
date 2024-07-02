import {
  SettingOutlined,
  LogoutOutlined,
  BankOutlined,
  FileOutlined,
  HomeOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { MenuInfo } from "rc-menu/lib/interface";
import Rutas from "../../../routes/Routes";
import { useAuth0 } from "@auth0/auth0-react";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  route: string,
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={route}>{label}</Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  //getItem("/", "HOME", "1", <HomeOutlined />),
  getItem("/empresas", "EMPRESA", "2", <BankOutlined />),
  getItem("/pedidos", "PEDIDOS", "3", <FundProjectionScreenOutlined />),
  getItem("/productos", "PRODUCTOS", "sub1", <ShoppingCartOutlined />, [
    getItem("/productos", "LISTA DE PRODUCTOS", "4"),
    getItem("/categorias", "CATEGORIAS", "5"),
  ]),
  getItem("/promociones", "PROMOCIONES", "6", <DollarCircleOutlined />),
  getItem("/empleados", "EMPLEADOS", "sub2", <ShoppingCartOutlined />, [
    getItem("/empleados", "LISTA DE EMPLEADOS", "7"),
    getItem("/roles", "ROLES", "8"),
  ]),

  getItem("/insumos", "INSUMOS", "9", <FileOutlined />),
  getItem("/compra/", "COMPRA", "10", <ShoppingCartOutlined />),
  getItem(
    "/unidadMedida",
    "Unidad de Medida",
    "11",
    <FundProjectionScreenOutlined />
  ),
  getItem(
    "/estadistica",
    "ESTADISTICA",
    "12",
    <FundProjectionScreenOutlined />
  ),
];

const App: React.FC = () => {
  const { logout } = useAuth0(); // Utiliza el hook useAuth0 para obtener la función logout
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function handleMenuClick(info: MenuInfo): void {
    console.log("Menu item clicked:", info.key);
    if (info.key === "3") {
      // Asume que el ítem de menú de cierre de sesión tiene la clave "3"
      logout({}); // Llama a la función logout sin parámetros
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Perfil
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        Ajustes
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "50px",
        }}
      >
        <div className="demo-logo" />
        <Dropdown overlay={menu}>
          <Button>
            <UserOutlined />
          </Button>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          width={"15%"}
          style={{
            background: colorBgContainer,
            height: "90vh",
            marginTop: "0.7%",
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
          />
        </Sider>
        <Layout
          style={{ padding: "0 24px 24px", marginTop: "0.7%", height: "93vh" }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: "auto", // Add this line
            }}
          >
            <Rutas />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
