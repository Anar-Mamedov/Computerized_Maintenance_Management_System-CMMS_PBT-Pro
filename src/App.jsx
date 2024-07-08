import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  Link,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Button,
  Typography,
  Input,
} from "antd";
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
// import Isemri from "./pages/DashboardAnalytics2/Isemri";
import IsEmri from "./pages/BakımVeArizaYonetimi/IsEmri/IsEmri";
import MakineTanim from "./pages/MakineEkipman/MakineTanim/MakineTanim";
import LokasyonTanim from "./pages/Yonetim/LokasyonTanimlari/LokasyonTanimlari";
import VardiyaTanim from "./pages/Yonetim/VardiyaTanimlari/VardiyaTanimlari";
import Dashboard from "./pages/Dashboard/Dashboard";
import BakimTanimlari from "./pages/BakımVeArizaYonetimi/BakimTanimlari/BakimTanimlari";
import ArizaTanimlari from "./pages/BakımVeArizaYonetimi/ArizaTanimlari/ArizaTanimlari";
import AtolyeTanimlari from "./pages/PersonelYonetimi/AtolyeTanimlari/AtolyeTanimlari";
import PersonelTanimlari from "./pages/PersonelYonetimi/PersonelTanimlari/PersonelTanimlari";
import IsTalepleri from "./pages/YardimMasasi/IsTalepleri/IsTalepleri";
import Hazirlaniyor from "./pages/Hazirlaniyor";
import Auth from "./pages/Auth/Auth";
import logo from "../src/assets/images/logoBeyaz.png";
import Headers from "./pages/Headers/Headers";
import { useRecoilState } from "recoil";
import { userState } from "./state/userState";
import PlanlamaTakvimi from "./pages/BakımVeArizaYonetimi/PlanlamaTakvimi/PlanlamaTakvimi";
import OtomatikIsEmri from "./pages/BakımVeArizaYonetimi/OtomatikIsEmri/OtomatikIsEmri";
import PeriyodikBakimlar1 from "./pages/BakımVeArizaYonetimi/PeriyodikBakimlar1/PeryodikBakimlar";
import RaporYonetimi from "./pages/Rapor&Formlar/RaporYonetimi/RaporYonetimi.jsx";
import ProfilEkrani from "./pages/Headers/components/ProfilEkrani/ProfilEkrani.jsx";
import Analizler from "./pages/PersonelYonetimi/PersonelKPI/Analizler.jsx";
import Dashboard1 from "./pages/Dashboard1/Dashboard.jsx";

const { Text } = Typography;
const { TextArea } = Input;

const { Header, Content, Footer, Sider } = Layout;

const loginData = JSON.parse(localStorage.getItem("login")) || {};

function getItem(label, key, icon, children, isClickable = true) {
  return {
    key,
    icon,
    children,
    label: isClickable ? <Link to={`/${key}`}>{label}</Link> : label,
  };
}

function filterItems(items) {
  // LocalStorage'dan token kontrolü
  const token = localStorage.getItem("token");

  // Token yoksa, hiçbir filtreleme yapmadan tüm öğeleri döndür
  if (!token) {
    return items;
  }

  // Token varsa, filtreleme işlemini gerçekleştir
  return items
    .map((item) => {
      // "Ana Sayfa" için özel durumu kontrol et
      if (item.key === "" && item.label.props.children === "Ana Sayfa") {
        return item; // "Ana Sayfa" her zaman görünür
      }

      const filteredChildren = item.children
        ? filterItems(item.children).filter((child) => loginData[child.key])
        : [];
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      };
    })
    .filter(
      (item) =>
        item.children ||
        loginData[item.key] ||
        (item.key === "" && item.label.props.children === "Ana Sayfa")
    );
}

const rawItems = [
  getItem("Ana Sayfa", "", <PieChartOutlined />),
  // getItem("Option 1", "option1", <PieChartOutlined />),
  // getItem("Option 2", "option2", <DesktopOutlined />),
  getItem(
    "Makine & Ekipman Yönetimi",
    "makine&ekipman",
    <TeamOutlined />,
    [
      getItem("Makine Tanım", "makine", true),
      getItem("Ekipman Veritabanı", "ekipmanVeritabani", true),
      getItem("Sayaç Güncelleme", "sayacGuncelleme", true),
      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Bakım ve Arıza Yönetimi",
    "bakim&ariza",
    <UserOutlined />,
    [
      // getItem("Tom", "tom", true),
      getItem("Bakım Tanımları", "bakimTanimlari", true),
      getItem("Arıza Tanımları", "arizaTanimlari", true),
      // getItem("İş Emri", "isemri", true),
      getItem("İş Emirleri", "isEmri1", true),
      getItem("Periyodik Bakımlar", "periyodikBakimlar", true),
      getItem("Otomatik İş Emirleri", "otomatikIsEmirleri", true),
      getItem("Planlama Takvimi", "planlamaTakvimi", true),
      // getItem("Alex", "alex", true)
    ],
    false
  ),
  getItem(
    "Personel Yönetimi",
    "personelYonetimi",
    <UserOutlined />,
    [
      getItem("Atölye Tanımları", "atolye", true),
      getItem("Personel Tanımları", "personeltanimlari", true),
      getItem("Personel İzinleri", "personelIzinleri", true),
      getItem("Personel Nöbetleri", "personelNobetleri", true),
      getItem("Personel Çalışma Planı", "personelCalismaPLani", true),
      getItem("Personel KPI", "analizler", true),

      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Yardım Masası",
    "yardimMasasi",
    <KeyOutlined />,
    [
      getItem("İş Talepleri", "isTalepleri", true),
      getItem("İş Talebi Kullanıcıları", "isTalebiKullanicilari", true),
      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Rapor & Formlar",
    "rapor&formlar",
    <KeyOutlined />,
    [
      getItem("Rapor Yönetimi", "raporYonetimi", true),
      getItem("Form Yönetimi", "formYonetimi", true),
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
      getItem("Vardiya Tanımları", "vardiyalar", true),
      getItem("Kod Yönetimi", "kodYonetimi", true),
      getItem("Otomatik Kodlar", "otomatikKodlar", true),
      getItem("Servis Öncelik Seviyeleri", "servisOncelikSeviyeleri", true),
      getItem("İş Emri Tipleri", "isEmriTipleri", true),
      getItem("Onaylayıcılar", "onaylayicilar", true),
      getItem("Proje Tanımları", "projeTanimlari", true),
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
// diğer menüyü açtığımda diğer menüyü kapatıyor ve sayfa yüklendiğinde açık olan menüyü açık bırakıyor sonu

export default function App() {
  const [user, setUser] = useRecoilState(userState);

  // localStorage'dan kullanıcı bilgilerini oku
  useEffect(() => {
    // Sayfa yüklendiğinde, kullanıcı bilgilerini localStorage'dan oku
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Recoil durumunu güncelle
    }
  }, [setUser]);
  // localStorage'dan kullanıcı bilgilerini oku son

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <BaseLayout />
          </ProtectedRoute>
        }
      >
        {loginData?.Dashboard && <Route path="/" element={<Dashboard1 />} />}
        {/* <Route path="/isemri" element={<Isemri />} /> */}
        <Route path="/isEmri1" element={<IsEmri />} />
        <Route path="/User" element={<ProfilEkrani />} />
        <Route path="/periyodikBakimlar" element={<PeriyodikBakimlar1 />} />
        <Route path="/otomatikIsEmirleri" element={<OtomatikIsEmri />} />
        <Route path="/raporYonetimi" element={<RaporYonetimi />} />
        <Route path="/analizler" element={<Analizler />} />
        <Route path="/planlamaTakvimi" element={<PlanlamaTakvimi />} />
        <Route path="/makine" element={<MakineTanim />} />
        <Route path="/ekipmanVeritabani" element={<Hazirlaniyor />} />
        <Route path="/sayacGuncelleme" element={<Hazirlaniyor />} />
        <Route path="/personelIzinleri" element={<Hazirlaniyor />} />
        <Route path="/personelNobetleri" element={<Hazirlaniyor />} />
        <Route path="/personelCalismaPLani" element={<Hazirlaniyor />} />
        <Route path="/isTalebiKullanicilari" element={<Hazirlaniyor />} />
        <Route path="/raporYonetimi" element={<Hazirlaniyor />} />
        <Route path="/formYonetimi" element={<Hazirlaniyor />} />
        <Route path="/kodYonetimi" element={<Hazirlaniyor />} />
        <Route path="/otomatikKodlar" element={<Hazirlaniyor />} />
        <Route path="/servisOncelikSeviyeleri" element={<Hazirlaniyor />} />
        <Route path="/isEmriTipleri" element={<Hazirlaniyor />} />
        <Route path="/onaylayicilar" element={<Hazirlaniyor />} />
        <Route path="/projeTanimlari" element={<Hazirlaniyor />} />
        <Route path="/lokasyon" element={<LokasyonTanim />} />
        <Route path="/vardiyalar" element={<VardiyaTanim />} />
        <Route path="/bakimTanimlari" element={<BakimTanimlari />} />
        <Route path="/arizaTanimlari" element={<ArizaTanimlari />} />
        <Route path="/atolye" element={<AtolyeTanimlari />} />
        <Route path="/personeltanimlari" element={<PersonelTanimlari />} />
        <Route path="/isTalepleri" element={<IsTalepleri />} />
        <Route path="/demo" element={<Dashboard1 />} />
      </Route>
    </Routes>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to={"/auth"} replace />;
  }

  return children;
};

const BaseLayout = () => {
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

  const logoStyle = {
    marginTop: "20px", // Yukarıda 20 piksellik boşluk bırakın
    maxWidth: "100px", // Genişliği sabit tutun
    width: "80%", // Genişliği sabit tutun
    // marginBottom: "20px", // Aşağıda 20 piksellik boşluk bırakın
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {(mobileView && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          collapsedWidth="0.0000000000001"
        >
          <div
            className="demo-logo-vertical"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "flex-end",
              marginBottom: "20px",
              columnGap: "5px",
            }}
          >
            <img src={logo} alt="Logo" style={logoStyle} />
            <Text style={{ color: "white", marginTop: "11px" }}>v. 1.5.0</Text>
          </div>
          <MenuWrapper />
        </Sider>
      )) || (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={250} // Genişletilmiş durumda Sider'ın genişliği
          collapsedWidth={70} // Daraltılmış durumda Sider'ın genişliği
          breakpoint="lg" // breakpoint="lg" olduğunda collapsedWidth değerini kullanır
        >
          <div
            className="demo-logo-vertical"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "flex-end",
              marginBottom: "20px",
              columnGap: "5px",
            }}
          >
            <img src={logo} alt="Logo" style={logoStyle} />
            <Text style={{ color: "white", marginTop: "11px" }}>v. 1.5.0</Text>
          </div>
          <MenuWrapper />
        </Sider>
      )}

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
          }}
        >
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
              }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined style={{ color: "#0066ff" }} />
              ) : (
                <MenuFoldOutlined style={{ color: "#0066ff" }} />
              )}
            </Button>
          )}
          <Headers />
        </Header>
        <Content style={{ margin: mobileView ? "0 0px" : "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <div
            style={{
              padding: mobileView ? "24px 0px" : 24,
              borderRadius: "16px",
              minHeight: 360,
              height: "calc(100vh - 129px)",
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center", padding: "10px 50px" }}>
          Orjin {new Date().getFullYear()} - Design & Develop by Orjin Team
        </Footer>
      </Layout>
    </Layout>
  );
};

const items = filterItems(rawItems);

const MenuWrapper = () => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    const openKey = items.find((item) =>
      item.children?.some((child) => `/${child.key}` === `/${currentPath}`)
    )?.key;
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
    <div style={{ height: "calc(100vh - 115px)", overflow: "auto" }}>
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname.split("/")[1]]}
        mode="inline"
        items={items}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
