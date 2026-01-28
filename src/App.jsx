import { useEffect, useState, useRef } from "react";
import { Route, Routes, Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme, Button, Typography, Input, Modal } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  ToolOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FireOutlined,
} from "@ant-design/icons";
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
import omegaLogo from "../src/assets/images/omega-logo.png";
import Headers from "./pages/Headers/Headers";
import { useRecoilState, RecoilRoot, useSetRecoilState } from "recoil";
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
import MudaheleSuresi from "./pages/Analizler/MudaheleAnalizi/MudaheleAnalizi.jsx";
import IsEmriAnalizi from "./pages/Analizler/IsEmriAnalizi/IsEmriAnalizi.jsx";
import { selectedMenuItemState, menuItemsState } from "./state/menuState";
import FloatButton from "./pages/components/FloatButton/index.jsx";
import RolTanimlari from "./pages/OnayIslemleri/RolTanimlari/RolTanimlari.jsx";
import OnayTanimlari from "./pages/OnayIslemleri/OnayTanimlari/OnayTanimlari.jsx";
import Onaylayicilar from "./pages/OnayIslemleri/Onaylayicilar/Onaylayicilar.jsx";
import EkipmanVeritabani from "./pages/MakineEkipman/EkipmanVeritabani/EkipmanVeritabani.jsx";
import SayacGuncelleme from "./pages/MakineEkipman/SayacGuncelleme/SayacGuncelleme.jsx";
import DurusTakibi from "./pages/MakineEkipman/DurusTakibi/DurusTakibi.jsx";
import IsTalebiKullanicilari from "./pages/YardimMasasi/IsTalebiKullanicilari/IsTalebiKullanicilari.jsx";
import KullaniciTanimlari from "./pages/Yonetim/KullaniciTanimlari/KullaniciTanimlari.jsx";
import RolTanimlari1 from "./pages/Yonetim/RolTanimlari/RolTanimlari.jsx";
import MalzemeTanimlari from "./pages/Malzeme&DepoYonetimi/MalzemeTanimlari/MalzemeTanimlari.jsx";
import MalzemeDepolari from "./pages/Malzeme&DepoYonetimi/MalzemeDepolari/MalzemeDepolari.jsx";
import MalzemeTalepleri from "./pages/SatinalmaYonetimi/MalzemeTalepleri/MalzemeTalepleri.jsx";
import SatinalmaSiparisleri from "./pages/SatinalmaYonetimi/SatinalmaSiparisleri/SatinalmaSiparisleri.jsx";
import FiyatTeklfileri from "./pages/SatinalmaYonetimi/FiyatTeklifleri/FiyatTeklifleri.jsx";
import DetarikciFirmalar from "./pages/SatinalmaYonetimi/FirmaTanimlari/FirmaTanimlari.jsx";
import SatinalmaDashboard from "./pages/SatinalmaYonetimi/Dashboard1/Dashboard.jsx";
import BakimKpi from "./pages/Analizler/BakimKpiAnalizi/BakimKpiAnalizi.jsx";
import YakitTanimlari from "./pages/YakitYonetimi/YakitTanimlari/YakitTanimlari.jsx";
import YakitGirisleri from "./pages/YakitYonetimi/YakitGirisleri/YakitGirisleri.jsx";
import YakitStoklari from "./pages/YakitYonetimi/YakitStoklari/YakitStoklari.jsx";
import YakitHareketleri from "./pages/YakitYonetimi/YakitHareketleri/YakitHareketleri.jsx";
import HizliYakitGirisi from "./pages/YakitYonetimi/HizliYakitGirisi/HizliYakitGirisi.jsx";
import YoneticiDashboard from "./pages/YonetimDashboard/Dashboard.jsx";
import MakinePuantaj from "./pages/MakineEkipman/MakinePuantaj/MakinePuantaj.jsx";
import AylikMakinePuantaj from "./pages/MakineEkipman/MakinePuantaj/MakinePuantajAylik.jsx";
import YakitTuketimiAnalizi from "./pages/Analizler/YakitTuketimiAnalizi/YakitTuketimiAnalizi.jsx";
import AxiosInstance from "./api/http";

// Malzemeler

import GirisFisleri from "./pages/Malzeme&DepoYonetimi/GirisFisleri/GirisFisleri.jsx";
import CikisFisleri from "./pages/Malzeme&DepoYonetimi/CikisFisleri/CikisFisleri.jsx";
import TransferFisleri from "./pages/Malzeme&DepoYonetimi/TransferFisleri/TransferFisleri.jsx";

// Ayarlar
import Ayarlar from "./pages/Yonetim/Ayarlar/Ayarlar.jsx";
import { t } from "i18next";
import { get } from "lodash";
// import Kurallar from "./pages/OnayIslemleri/Kurallar/Kurallar.jsx";

const { Text } = Typography;
const { TextArea } = Input;

const { Header, Content, Footer, Sider } = Layout;

const loginData = JSON.parse(localStorage.getItem("login")) || JSON.parse(sessionStorage.getItem("login")) || {};

function getItem(labelText, key, icon, children, isClickable = true) {
  return {
    key,
    icon,
    children,
    label: isClickable ? <Link to={`/${key}`}>{labelText}</Link> : labelText,
    labelText,
    isClickable,
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

function flattenMenuItems(items) {
  const result = [];
  items.forEach((item) => {
    if (item.isClickable) {
      result.push({
        path: item.key ? `/${item.key}` : "/",
        label: item.labelText,
        key: item.key,
      });
    }
    if (item.children) {
      result.push(...flattenMenuItems(item.children));
    }
  });
  return result;
}

// Domain kontrolü menü için
const menuHostname = window.location.hostname;
const isOmegaMenu = menuHostname === "omegaerp.net" || menuHostname === "www.omegaerp.net";

const rawItems = [
  getItem("Dashboard", "", <PieChartOutlined />),
  getItem("Yönetim Dashboard", "yonetimDashboard", <PieChartOutlined />),
  // getItem("Option 1", "option1", <PieChartOutlined />),
  // getItem("Option 2", "option2", <DesktopOutlined />),
  getItem(
    "Ekipman Yönetimi",
    "makine&ekipman",
    <AppstoreOutlined />,
    [
      getItem("Ekipman Tanımları", "makine", true),
      getItem("Alt Ekipman Veritabanı", "ekipmanVeritabani", true),
      getItem("Duruş Takibi", "durusTakibi", true),
      getItem("Sayaç Güncellemeleri", "sayacGuncelleme", true),
      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Operasyon Yönetimi",
    "operasyonYonetimi",
    <AppstoreOutlined />,
    [
      getItem(
        "Makine Puantajları",
        "makinePuantajlari",
        "",
        [
          getItem("Günlük Ekipman Puantaj Girişi", "gunlukMakinePuantajGirisi", true),
          getItem("Aylık Ekipman Puantajları", "aylikMakinePuantajlari", true),
          getItem("Ekipman Puantaj Takibi", "makinePuantajTakibi", true),
        ],
        false
      ),
      getItem(
        "Personel Puantajları",
        "personelPuantajlari",
        "",
        [
          getItem("Günlük Personel Puantaj Girişi", "gunlukPersonelPuantajGirisi", true),
          getItem("Aylık Personel Puantajları", "aylikPersonelPuantajlari", true),
          getItem("Personel Puantaj Takibi", "personelPuantajTakibi", true),
        ],
        false
      ),
      getItem("Operasyon Takibi", "operasyonTakibi", true),
    ],
    false
  ),
  getItem(
    "Bakım Yönetimi",
    "bakim&ariza",
    <ToolOutlined />,
    [
      // getItem("Tom", "tom", true),
      getItem("Bakım Planları", "bakimTanimlari", true),
      getItem("Arıza Kodları", "arizaTanimlari", true),
      // getItem("İş Emri", "isemri", true),
      getItem("Bakım İş Emirleri", "isEmri1", true),
      getItem("Periyodik Bakımlar", "periyodikBakimlar", true),
      getItem("İş Talepleri", "isTalepleri", true),
      getItem("Otomatik İş Emirleri", "otomatikIsEmirleri", true),
      getItem("Planlama Takvimi", "planlamaTakvimi", true),
      getItem("İş Emirleri Kontrol Ekranı", "isEmriAnalizi", true),
      // getItem("Müdahale Süresi Analizi", "mudaheleSuresi", true),
      // getItem("Alex", "alex", true)
    ],
    false
  ),
  getItem(
    "Malzeme & Depo Yönetimi",
    "malzeme&depo",
    <InboxOutlined />,
    [
      getItem("Malzeme Tanımıları", "malzemeTanimi", true),
      getItem("Malzeme Depoları", "malzemeDepolari", true),
      getItem("Malzeme Girişleri", "malzemeGirisFisi", true),
      getItem("Malzeme Çıkışları", "malzemeCikisFisi", true),
      getItem("Malzeme Transferleri", "malzemeTransferFisi", true),
      /*  getItem("Stok Sayımları", "stokSayimlari", true),
      getItem("Hızlı Maliyetlendirme", "hizliMaliyetlendirme", true),
      getItem("Malzeme Transfer Onay İşlemleri", "malzemeTransferOnayIslemleri", true), */
      // getItem("Team 2", "team2", true)
    ],
    false
  ),

  getItem(
    "Personel Yönetimi",
    "personelYonetimi",
    <TeamOutlined />,
    [
      getItem("Atölye / Ekip Tanımları", "atolye", true),
      getItem("Personel Tanımları", "personeltanimlari", true),
      getItem("Personel İzinleri", "personelIzinleri", true),
      getItem("Personel Nöbetleri", "personelNobetleri", true),
      getItem("Personel Çalışma Planı", "personelCalismaPLani", true),

      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Satımalma Yönetimi",
    "satinalmaYonetimi",
    <ShoppingCartOutlined />,
    [
      ...(isOmegaMenu ? [] : [getItem("Satınalma Yönetici Paneli", "satinalmaDashboard", true)]),
      getItem("Malzeme Talepleri", "malzemeTalepleri", true),
      getItem("Satınalma Siparişleri", "satinalmaSiparisleri", true),
      getItem("Fiyat Teklifleri", "fiyatTeklifleri", true),
      getItem("Tedarikçi Firmalar", "tedarikciFirmalar", true),

      // getItem("Team 2", "team2", true)
    ],
    false
  ),

  getItem(
    "Yakıt Yönetimi",
    "yakitYonetimi",
    <FireOutlined />,
    [
      getItem("Yakıt Tanımları", "yakitTanimlari", true),
      getItem("Yakıt Stokları", "yakitStoklari", true),
      getItem("Yakıt Girişleri", "yakitGirisleri", true),
      getItem("Yakıt Hareketleri", "yakitHareketleri", true),
      getItem("Hızlı Yakıt Girişi", "hizliYakitGirisi", true),

      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Analizler",
    "analizler1",
    <BarChartOutlined />,
    [
      getItem("Müdahale Süreleri Analizi", "mudaheleSuresi", true),
      getItem("Personel KPI Analizi", "analizler", true),
      getItem("Bakım KPI Analizi", "bakimKpi", true),
      getItem("Yakıt Tüketimi Analizi", "yakitTuketimiAnalizi", true),

      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Rapor & Formlar",
    "rapor&formlar",
    <FileTextOutlined />,
    [
      getItem("Rapor Yönetimi", "raporYonetimi", true),
      // getItem("Form Yönetimi", "formYonetimi", true),
      // getItem("Team 2", "team2", true)
    ],
    false
  ),
  getItem(
    "Yönetim",
    "yonetim",
    <SettingOutlined />,
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
      getItem("İş Talebi Kullanıcıları", "isTalebiKullanicilari", true),
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

  // Domain'e göre kontrol
  const hostname = window.location.hostname;
  const isOmega = hostname === "omegaerp.net" || hostname === "www.omegaerp.net";

  // Lisans kontrolü fonksiyonu
  const checkLicenseExpiry = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      // Token yoksa lisans kontrolü yapma
      if (!token) {
        return;
      }

      const response = await AxiosInstance.get("GetEndDate");

      if (response && response.length > 0) {
        const licenseEndDate = new Date(response[0].ISL_DONEM_BITIS);
        const currentDate = new Date();

        // Lisans süresi dolmuş mu kontrol et
        if (licenseEndDate < currentDate) {
          // Lisans süresi dolmuş, kullanıcı verilerini temizle
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          localStorage.removeItem("login");
          sessionStorage.removeItem("login");

          // Auth sayfasına yönlendir
          window.location.href = "/auth";
        }
      }
    } catch (error) {
      console.error("Lisans kontrolü sırasında hata oluştu:", error);
    }
  };

  // localStorage'dan kullanıcı bilgilerini oku
  useEffect(() => {
    // Sayfa yüklendiğinde, kullanıcı bilgilerini localStorage'dan oku
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Recoil durumunu güncelle
    }

    // Lisans kontrolünü yap
    checkLicenseExpiry();
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
          {loginData?.Dashboard && <Route path="/" element={isOmega ? <SatinalmaDashboard /> : <Dashboard1 />} />}
          {/* <Route path="/isemri" element={<Isemri />} /> */}
          <Route path="/yonetimDashboard" element={<YoneticiDashboard />} />
          <Route path="/isEmri1" element={<IsEmri />} />
          <Route path="/User" element={<ProfilEkrani />} />
          <Route path="/periyodikBakimlar" element={<PeriyodikBakimlar1 />} />
          <Route path="/otomatikIsEmirleri" element={<OtomatikIsEmri />} />
          <Route path="/raporYonetimi" element={<RaporYonetimi />} />
          <Route path="/analizler" element={<Analizler />} />
          <Route path="/planlamaTakvimi" element={<PlanlamaTakvimi />} />
          <Route path="/makine" element={<MakineTanim />} />
          <Route path="/ekipmanVeritabani" element={<EkipmanVeritabani />} />
          <Route path="/durusTakibi" element={<DurusTakibi />} />
          <Route path="/sayacGuncelleme" element={<SayacGuncelleme />} />
          <Route path="/gunlukMakinePuantajGirisi" element={<MakinePuantaj />} />
          <Route path="/aylikMakinePuantajlari" element={<AylikMakinePuantaj />} />
          <Route path="/makinePuantajTakibi" element={<Hazirlaniyor />} />
          <Route path="/gunlukPersonelPuantajGirisi" element={<Hazirlaniyor />} />
          <Route path="/aylikPersonelPuantajlari" element={<Hazirlaniyor />} />
          <Route path="/personelPuantajTakibi" element={<Hazirlaniyor />} />
          <Route path="/operasyonTakibi" element={<Hazirlaniyor />} />
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
          <Route path="/isEmriAnalizi" element={<IsEmriAnalizi />} />
          <Route path="/onayTanimlari" element={<OnayTanimlari />} />
          <Route path="/rolTanimlari" element={<RolTanimlari />} />
          <Route path="/onaylayicilar" element={<Onaylayicilar />} />
          <Route path="/kullaniciTanimlari" element={<KullaniciTanimlari />} />
          <Route path="/RolTanimlari1" element={<RolTanimlari1 />} />
          <Route path="/malzemeTanimi" element={<MalzemeTanimlari />} />
          <Route path="/malzemeDepolari" element={<MalzemeDepolari />} />
          <Route path="/malzemeGirisFisi" element={<GirisFisleri />} />
          <Route path="/malzemeCikisFisi" element={<CikisFisleri />} />
          <Route path="/malzemeTransferFisi" element={<TransferFisleri />} />
          <Route path="/stokSayimlari" element={<Hazirlaniyor />} />
          <Route path="/hizliMaliyetlendirme" element={<Hazirlaniyor />} />
          <Route path="/malzemeTransferOnayIslemleri" element={<Hazirlaniyor />} />
          <Route path="/malzemeTalepleri" element={<MalzemeTalepleri />} />
          <Route path="/satinalmaSiparisleri" element={<SatinalmaSiparisleri />} />
          <Route path="/fiyatTeklifleri" element={<FiyatTeklfileri />} />
          <Route path="/tedarikciFirmalar" element={<DetarikciFirmalar />} />
          <Route path="/satinalmaDashboard" element={<SatinalmaDashboard />} />
          <Route path="/bakimKpi" element={<BakimKpi />} />
          <Route path="/yakitTanimlari" element={<YakitTanimlari />} />
          <Route path="/yakitStoklari" element={<YakitStoklari />} />
          <Route path="/yakitGirisleri" element={<YakitGirisleri />} />
          <Route path="/yakitHareketleri" element={<YakitHareketleri />} />
          <Route path="/hizliYakitGirisi" element={<HizliYakitGirisi />} />
          <Route path="/yakitTuketimiAnalizi" element={<YakitTuketimiAnalizi />} />
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

  // Domain'e göre logo seçimi
  const hostname = window.location.hostname;
  const isOmega = hostname === "omegaerp.net" || hostname === "www.omegaerp.net";
  const currentLogo = isOmega ? omegaLogo : logo;

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
    <>
      {isOmega && (
        <style>{`
          .ant-layout-sider-trigger {
            background: #0f1419 !important;
          }
          .ant-layout-sider-trigger svg {
            color: #e8eaed !important;
          }
          .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):not(:hover) {
            color: #e8eaed !important;
          }
          .ant-menu-dark .ant-menu-submenu-title:not(:hover) {
            color: #e8eaed !important;
          }
        `}</style>
      )}
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
              <img src={currentLogo} alt="Logo" style={logoStyle} />
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
              <img src={currentLogo} alt="Logo" style={logoStyle} />
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
    </>
  );
};

const items = filterItems(rawItems);

// Ant Design Menu için gereksiz propları temizleyen fonksiyon
function cleanItemsForMenu(items) {
  return items.map((item) => {
    const { isClickable, labelText, ...cleanItem } = item;
    if (cleanItem.children) {
      cleanItem.children = cleanItemsForMenu(cleanItem.children);
    }
    return cleanItem;
  });
}

const MenuWrapper = () => {
  const location = useLocation();
  const [disabled, setDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useRecoilState(selectedMenuItemState);
  const setMenuItems = useSetRecoilState(menuItemsState);
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

  useEffect(() => {
    setMenuItems(flattenMenuItems(items));
  }, [setMenuItems]);

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

  // Ant Design Menu'ye göndermeden önce gereksiz propları temizle
  const cleanedItems = cleanItemsForMenu(items);

  return (
    <div style={{ height: "calc(100vh - 115px)", overflow: "auto" }}>
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname.split("/")[1]]}
        selectedKeys={[selectedMenuItem]}
        mode="inline"
        items={cleanedItems}
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
