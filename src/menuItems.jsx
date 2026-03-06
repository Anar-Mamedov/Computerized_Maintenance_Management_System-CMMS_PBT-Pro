import { Link } from "react-router-dom";
import {
  PieChartOutlined,
  TeamOutlined,
  ToolOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FireOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";

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

// Domain kontrolü menü için
const menuHostname = window.location.hostname;
const isOmegaMenu = menuHostname === "omegaerp.net" || menuHostname === "www.omegaerp.net";

export const rawItems = [
  getItem("Dashboard", "", <PieChartOutlined />),
  getItem(
    "Ekipman Yönetimi",
    "makine&ekipman",
    <AppstoreOutlined />,
    [
      getItem("Ekipman Tanımları", "makine", true),
      getItem("Alt Ekipman Veritabanı", "ekipmanVeritabani", true),
      getItem("Duruş Takibi", "durusTakibi", true),
      getItem("Sayaç Güncellemeleri", "sayacGuncelleme", true),
      getItem("Ekipman Transferi", "ekipmanTransferi", true),
    ],
    false
  ),
  getItem(
    "Operasyon Yönetimi",
    "operasyonYonetimi",
    <AppstoreOutlined />,
    [
      getItem("Günlük Ekipman Puantaj Girişi", "gunlukMakinePuantajGirisi", true),
      getItem("Aylık Ekipman Puantajları", "aylikMakinePuantajlari", true),
      getItem("Ekipman Puantaj Takibi", "makinePuantajTakibi", true),
      getItem("Operasyon Takibi", "operasyonTakibi", true),
    ],
    false
  ),
  getItem(
    "Bakım Yönetimi",
    "bakim&ariza",
    <ToolOutlined />,
    [
      getItem("Bakım Planları", "bakimTanimlari", true),
      getItem("Arıza Kodları", "arizaTanimlari", true),
      getItem("Bakım İş Emirleri", "isEmri1", true),
      getItem("Periyodik Bakımlar", "periyodikBakimlar", true),
      getItem("İş Talepleri", "isTalepleri", true),
      getItem("Otomatik İş Emirleri", "otomatikIsEmirleri", true),
      getItem("Planlama Takvimi", "planlamaTakvimi", true),
      getItem("İş Emirleri Kontrol Ekranı", "isEmriAnalizi", true),
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
      getItem("Stok Sayımları", "stokSayimlariFisListe", true),
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
    ],
    false
  ),
  getItem(
    "Satınalma Yönetimi",
    "satinalmaYonetimi",
    <ShoppingCartOutlined />,
    [
      getItem("Satınalma Yönetici Paneli", "satinalmaDashboard", true),
      getItem("Malzeme Talepleri", "malzemeTalepleri", true),
      getItem("Satınalma Siparişleri", "satinalmaSiparisleri", true),
      getItem("Fiyat Teklifleri", "fiyatTeklifleri", true),
      getItem("Tedarikçi Firmalar", "tedarikciFirmalar", true),
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
    ],
    false
  ),
  getItem(
    "Proje Yönetimi",
    "projeYonetimi",
    <CalculatorOutlined />,
    [getItem("Proje Tanımları", "projeTanimlari2", true), getItem("Proje İlerleme İşlemleri", "projeIlerleme", true), getItem("Proje Yönetimi", "projeYonetimiListe", true)],
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
    ],
    false
  ),
  getItem("Rapor & Formlar", "rapor&formlar", <FileTextOutlined />, [getItem("Rapor Yönetimi", "raporYonetimi", true)], false),
  getItem(
    "Yönetim",
    "yonetim",
    <SettingOutlined />,
    [
      getItem("Doküman Yönetimi", "dokumanYonetimi", true),
      getItem("Resim Yönetimi", "resimYonetimi", true),
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
        [getItem("Onay Tanımları", "onayTanimlari", true), getItem("Rol Tanımları", "rolTanimlari", true), getItem("Onaylayıcılar", "onaylayicilar", true)],
        false
      ),
      getItem("Proje Tanımları", "projeTanimlari", true),
      getItem("Kullanıcı Tanımları", "kullaniciTanimlari", true),
      getItem("Rol Tanımları", "RolTanimlari1", true),
      getItem("İş Talebi Kullanıcıları", "isTalebiKullanicilari", true),
      getItem("Ayarlar", "Ayarlar", undefined, undefined, false),
    ],
    false
  ),
];
