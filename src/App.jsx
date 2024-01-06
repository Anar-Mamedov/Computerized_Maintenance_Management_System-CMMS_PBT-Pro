import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme, ConfigProvider, Button } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  UserOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import Isemri from "./pages/DashboardAnalytics2/Isemri";
import MakineTanim from "./pages/MakineEkipman/MakineTanim/MakineTanim";
import LokasyonTanim from "./pages/Yonetim/LokasyonTanimlari/LokasyonTanimlari";
import trTR from "antd/es/locale/tr_TR";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, isClickable = true) {
  return {
    key,
    icon,
    children,
    label: isClickable ? <Link to={`/${key}`}>{label}</Link> : label,
  };
}

const items = [
  // getItem("Option 1", "option1", <PieChartOutlined />),
  // getItem("Option 2", "option2", <DesktopOutlined />),
  getItem(
    "Bakım ve Arıza Yönetimi",
    "bakim&ariza",
    <UserOutlined />,
    [
      // getItem("Tom", "tom", true),
      getItem("İş Emri", "isemri", true),
      // getItem("Alex", "alex", true)
    ],
    false
  ),
  getItem(
    "Makine & Ekipman Yönetimi",
    "makine&ekipman",
    <TeamOutlined />,
    [
      getItem("Makine Tanım", "makine", true),
      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Yönetim",
    "yonetim",
    <KeyOutlined />,
    [
      getItem("Lokasyon Tanımları", "lokasyon", true),
      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  // getItem("Files", "files", <FileOutlined />),
];

// const Option1Page = () => <div>Option 1 Content</div>;
// const BillPage = () => <div>Bill is a cat.</div>;
// Diğer sayfa bileşenlerinizi burada tanımlayın...

// diğer menüyü açtığımda diğer menüyü kapatıyor ve sayfa yüklendiğinde açık olan menüyü açık bırakıyor

const MenuWrapper = () => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    const openKey = items.find((item) => item.children?.some((child) => `/${child.key}` === `/${currentPath}`))?.key;
    if (openKey) {
      setOpenKeys([openKey]);
    }
  }, [location]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (items.map((item) => item.key).indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={[location.pathname.split("/")[1]]}
      mode="inline"
      items={items}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
    />
  );
};

// diğer menüyü açtığımda diğer menüyü kapatıyor ve sayfa yüklendiğinde açık olan menüyü açık bırakıyor sonu

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Ekran boyutu değişikliklerini dinle
  window.addEventListener("resize", () => {
    setMobileView(window.innerWidth < 768);
  });

  return (
    <ConfigProvider locale={trTR}>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          {(mobileView && (
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              breakpoint="lg"
              collapsedWidth="0.0000000000001">
              <div className="demo-logo-vertical" />
              <MenuWrapper />
            </Sider>
          )) || (
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
              <div className="demo-logo-vertical" />
              <MenuWrapper />
            </Sider>
          )}

          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer, display: "flex", alignItems: "center" }}>
              {mobileView && (
                <Button
                  onClick={toggleCollapsed}
                  style={{
                    padding: "0 24px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "10px",
                  }}>
                  {collapsed ? (
                    <MenuUnfoldOutlined style={{ color: "#0066ff" }} />
                  ) : (
                    <MenuFoldOutlined style={{ color: "#0066ff" }} />
                  )}
                </Button>
              )}
            </Header>
            {(mobileView && (
              <Content style={{ margin: "0 0px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>{/* Breadcrumb içeriği */}</Breadcrumb>
                <div style={{ padding: "24px 0px", minHeight: 360, background: colorBgContainer }}>
                  <Routes>
                    <Route path="/isemri" element={<Isemri />} />
                    <Route path="/makine" element={<MakineTanim />} />
                    <Route path="/lokasyon" element={<LokasyonTanim />} />
                    {/* Diğer Route'lar */}
                  </Routes>
                </div>
              </Content>
            )) || (
              <Content style={{ margin: "0 16px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>{/* Breadcrumb içeriği */}</Breadcrumb>
                <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                  <Routes>
                    <Route path="/isemri" element={<Isemri />} />
                    <Route path="/makine" element={<MakineTanim />} />
                    <Route path="/lokasyon" element={<LokasyonTanim />} />
                    {/* Diğer Route'lar */}
                  </Routes>
                </div>
              </Content>
            )}

            <Footer style={{ textAlign: "center" }}>
              Orjin {new Date().getFullYear()} - Design & Develop by Orjin Team
            </Footer>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
