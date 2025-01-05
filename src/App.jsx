import { useEffect, useState, useRef } from "react";
import { Route, Routes, Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme, Button, Typography, Input, Modal } from "antd";
import { DesktopOutlined, FileOutlined, PieChartOutlined, MenuUnfoldOutlined, MenuFoldOutlined, TeamOutlined, UserOutlined, KeyOutlined } from "@ant-design/icons";
import Draggable from "react-draggable";
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
import { useRecoilState, RecoilRoot } from "recoil";
import { userState } from "./state/userState";
import PlanlamaTakvimi from "./pages/BakımVeArizaYonetimi/PlanlamaTakvimi/PlanlamaTakvimi";
import OtomatikIsEmri from "./pages/BakımVeArizaYonetimi/OtomatikIsEmrileri/Index.jsx";
import PeriyodikBakimlar1 from "./pages/BakımVeArizaYonetimi/PeriyodikBakimlar1/PeryodikBakimlar";
import RaporYonetimi from "./pages/Rapor&Formlar/RaporYonetimi/RaporYonetimi.jsx";
import ProfilEkrani from "./pages/Headers/components/ProfilEkrani/ProfilEkrani.jsx";
import Analizler from "./pages/PersonelYonetimi/PersonelKPI/Analizler.jsx";
import Dashboard1 from "./pages/Dashboard1/Dashboard.jsx";
import UserIdControl from "./pages/UserIdControl/UserIdControl.jsx";
import IsEmriTipleri from "./pages/Yonetim/IsEmriTipleri/IsEmriTipleri.jsx";
import Breadcrumbs from "./Breadcrumbs"; // Import the Breadcrumbs component
import MudaheleSuresi from "./pages/BakımVeArizaYonetimi/MudaheleAnalizi/MudaheleAnalizi.jsx";
import { selectedMenuItemState } from "./state/menuState";
import FloatButton from "./pages/components/FloatButton/index.jsx";
import RolTanimlari from "./pages/OnayIslemleri/RolTanimlari/RolTanimlari.jsx";
import OnayTanimlari from "./pages/OnayIslemleri/OnayTanimlari/OnayTanimlari.jsx";
import Onaylayicilar from "./pages/OnayIslemleri/Onaylayicilar/Onaylayicilar.jsx";
import EkipmanVeritabani from "./pages/MakineEkipman/EkipmanVeritabani/EkipmanVeritabani.jsx";
import IsTalebiKullanicilari from "./pages/YardimMasasi/IsTalebiKullanicilari/IsTalebiKullanicilari.jsx";
import KullaniciTanimlari from "./pages/Yonetim/KullaniciTanimlari/KullaniciTanimlari.jsx";
import RolTanimlari1 from "./pages/Yonetim/RolTanimlari/RolTanimlari.jsx";
import MalzemeTanimlari from "./pages/Malzeme&DepoYonetimi/MalzemeTanimlari/MalzemeTanimlari.jsx";
import Ayarlar from "./pages/Yonetim/Ayarlar/Ayarlar.jsx";
import { t } from "i18next";
// import Kurallar from "./pages/OnayIslemleri/Kurallar/Kurallar.jsx";

const { Text } = Typography;
const { TextArea } = Input;

const { Header, Content, Footer, Sider } = Layout;

const loginData = JSON.parse(localStorage.getItem("login")) || JSON.parse(sessionStorage.getItem("login")) || {};

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
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

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

      const filteredChildren = item.children ? filterItems(item.children).filter((child) => loginData[child.key]) : [];
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      };
    })
    .filter((item) => item.children || loginData[item.key] || (item.key === "" && item.label.props.children === "Ana Sayfa"));
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
    "Malzeme & Depo Yönetimi",
    "malzeme&depo",
    <TeamOutlined />,
    [
      getItem("Malzeme Tanımı", "malzemeTanimi", true),
      getItem("Malzeme Depoları", "malzemeDepolari", true),
      getItem("Malzeme Giriş Fişi", "malzemeGirisFisi", true),
      getItem("Malzeme Çıkış Fişi", "malzemeCikisFisi", true),
      getItem("Malzeme Transfer Fişi", "malzemeTransferFisi", true),
      getItem("Stok Sayımları", "stokSayimlari", true),
      getItem("Hızlı Maliyetlendirme", "hizliMaliyetlendirme", true),
      getItem("Malzeme Transfer Onay İşlemleri", "malzemeTransferOnayIslemleri", true),
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
      getItem("Müdahale Süresi Analizi", "mudaheleSuresi", true),
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
      getItem("Personel KPI Analizi", "analizler", true),

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
      getItem(
        "Onay İşlemleri",
        "onayIslemleri",
        "",
        [
          getItem("Onay Tanımları", "onayTanimlari", true),
          getItem("Rol Tanımları", "rolTanimlari", true),
          getItem("Onaylayıcılar", "onaylayicilar", true),
          // getItem("Kurallar", "kurallar", true),
        ],
        false
      ),
      getItem("Proje Tanımları", "projeTanimlari", true),
      getItem("Kullanıcı Tanımları", "kullaniciTanimlari", true),
      getItem("Rol Tanımları", "RolTanimlari1", true),
      getItem("Ayarlar", "Ayarlar", undefined, undefined, false),
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
    <RecoilRoot>
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
          <Route path="/ekipmanVeritabani" element={<EkipmanVeritabani />} />
          <Route path="/sayacGuncelleme" element={<Hazirlaniyor />} />
          <Route path="/personelIzinleri" element={<Hazirlaniyor />} />
          <Route path="/personelNobetleri" element={<Hazirlaniyor />} />
          <Route path="/personelCalismaPLani" element={<Hazirlaniyor />} />
          <Route path="/isTalebiKullanicilari" element={<IsTalebiKullanicilari />} />
          <Route path="/raporYonetimi" element={<Hazirlaniyor />} />
          <Route path="/formYonetimi" element={<Hazirlaniyor />} />
          <Route path="/kodYonetimi" element={<Hazirlaniyor />} />
          <Route path="/otomatikKodlar" element={<Hazirlaniyor />} />
          <Route path="/servisOncelikSeviyeleri" element={<Hazirlaniyor />} />
          <Route path="/isEmriTipleri" element={<IsEmriTipleri />} />
          <Route path="/projeTanimlari" element={<Hazirlaniyor />} />
          <Route path="/lokasyon" element={<LokasyonTanim />} />
          <Route path="/vardiyalar" element={<VardiyaTanim />} />
          <Route path="/bakimTanimlari" element={<BakimTanimlari />} />
          <Route path="/arizaTanimlari" element={<ArizaTanimlari />} />
          <Route path="/atolye" element={<AtolyeTanimlari />} />
          <Route path="/personeltanimlari" element={<PersonelTanimlari />} />
          <Route path="/isTalepleri" element={<IsTalepleri />} />
          <Route path="/demo" element={<Dashboard />} />
          <Route path="/userid" element={<UserIdControl />} />
          <Route path="/mudaheleSuresi" element={<MudaheleSuresi />} />
          <Route path="/onayTanimlari" element={<OnayTanimlari />} />
          <Route path="/rolTanimlari" element={<RolTanimlari />} />
          <Route path="/onaylayicilar" element={<Onaylayicilar />} />
          <Route path="/kullaniciTanimlari" element={<KullaniciTanimlari />} />
          <Route path="/RolTanimlari1" element={<RolTanimlari1 />} />
          <Route path="/malzemeTanimi" element={<MalzemeTanimlari />} />
          <Route path="/malzemeDepolari" element={<Hazirlaniyor />} />
          <Route path="/malzemeGirisFisi" element={<Hazirlaniyor />} />
          <Route path="/malzemeCikisFisi" element={<Hazirlaniyor />} />
          <Route path="/malzemeTransferFisi" element={<Hazirlaniyor />} />
          <Route path="/stokSayimlari" element={<Hazirlaniyor />} />
          <Route path="/hizliMaliyetlendirme" element={<Hazirlaniyor />} />
          <Route path="/malzemeTransferOnayIslemleri" element={<Hazirlaniyor />} />
          {/*<Route path="/kurallar" element={<Kurallar />} />*/}
        </Route>
      </Routes>
    </RecoilRoot>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg" collapsedWidth="0.0000000000001">
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
            <Text style={{ color: "white", marginTop: "11px" }}>v. 1.7.5</Text>
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
            <Text style={{ color: "white", marginTop: "11px" }}>v. 1.7.5</Text>
          </div>
          <MenuWrapper />
          <FloatButton /> {/*FloatButton ekranran görüntüsü alacak ve help deske göndericek*/}
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
              {collapsed ? <MenuUnfoldOutlined style={{ color: "#0066ff" }} /> : <MenuFoldOutlined style={{ color: "#0066ff" }} />}
            </Button>
          )}
          <Headers />
        </Header>
        <Content style={{ margin: mobileView ? "0 0px" : "0 16px" }}>
          <Breadcrumbs />
          <div
            style={{
              padding: mobileView ? "24px 0px" : 24,
              borderRadius: "16px",
              minHeight: 360,
              height: "calc(100vh - 132px)",
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center", padding: "10px 50px" }}>Orjin {new Date().getFullYear()} - Design & Develop by Orjin Team</Footer>
      </Layout>
    </Layout>
  );
};

const items = filterItems(rawItems);

const MenuWrapper = () => {
  const location = useLocation();
  const [disabled, setDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useRecoilState(selectedMenuItemState);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    const openKey = items.find((item) => item.children?.some((child) => `/${child.key}` === `/${currentPath}`))?.key;
    if (openKey) {
      setOpenKeys([openKey]);
    }
    setSelectedMenuItem(currentPath);
  }, [location, setSelectedMenuItem]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (items.map((item) => item.key).indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    console.log(e);
    setOpen(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const handleMenuClick = (e) => {
    if (e.key === "Ayarlar") {
      showModal();
      // Optionally, prevent "Ayarlar" from being set as selected
      setSelectedMenuItem(selectedMenuItem); // Keep the previous selection
    } else {
      setSelectedMenuItem(e.key);
    }
  };

  return (
    <div style={{ height: "calc(100vh - 115px)", overflow: "auto" }}>
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname.split("/")[1]]}
        selectedKeys={[selectedMenuItem]}
        mode="inline"
        items={items}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick}
      />
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            <div style={{ fontSize: "20px" }}>{t("ayarlar")}</div>
          </div>
        }
        centered
        open={open}
        width={800}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Ok ve Cancel düğmelerini kaldırmak için
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Ayarlar />
      </Modal>
    </div>
  );
};
