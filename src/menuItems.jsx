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

function getItem(labelText, key, icon, children, isClickable = true, modulePermissionKey = null) {
  return {
    key,
    icon,
    children,
    label: isClickable ? <Link to={`/${key}`}>{labelText}</Link> : labelText,
    labelText,
    isClickable,
    modulePermissionKey,
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
      getItem("Ekipman Tanımları", "makine", true, undefined, true, "KLL_WEB_MAKINE"),
      getItem("Alt Ekipman Veritabanı", "ekipmanVeritabani", true, undefined, true, "KLL_WEB_EKIPMAN"),
      getItem("Duruş Takibi", "durusTakibi", true, undefined, true, "KLL_WEB_EKIPMAN"),
      getItem("Sayaç Güncellemeleri", "sayacGuncelleme", true, undefined, true, "KLL_WEB_SAYAC"),
      getItem("Ekipman Transferi", "ekipmanTransferi", true, undefined, true),
      getItem("Amortisman Takibi", "amortisman", true, undefined, true),
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
    false,
    "KLL_WEB_OPERASYON_MODUL"
  ),
  getItem(
    "Bakım Yönetimi",
    "bakim&ariza",
    <ToolOutlined />,
    [
      getItem("Bakım Planları", "bakimTanimlari", true, undefined, true, "KLL_WEB_BAKIM"),
      getItem("Arıza Kodları", "arizaTanimlari", true, undefined, true, "KLL_WEB_ARIZA"),
      getItem("Bakım İş Emirleri", "isEmri1", true, undefined, true, "KLL_WEB_ISEMRI"),
      getItem("Periyodik Bakımlar", "periyodikBakimlar", true, undefined, true, "KLL_WEB_PBAKIM"),
      getItem("İş Talepleri", "isTalepleri", true, undefined, true, "KLL_ISTALEBI_KUL"),
      getItem("Otomatik İş Emirleri", "otomatikIsEmirleri", true, undefined, true, "KLL_WEB_OTOIS"),
      getItem("Planlama Takvimi", "planlamaTakvimi", true, undefined, true, "KLL_WEB_PTAKVIM"),
      getItem("İş Emirleri Kontrol Ekranı", "isEmriAnalizi", true, undefined, true, "KLL_WEB_ISEMRI"),
    ],
    false
  ),
  getItem(
    "Malzeme & Depo Yönetimi",
    "malzeme&depo",
    <InboxOutlined />,
    [
      getItem("Malzeme Tanımıları", "malzemeTanimi", true, undefined, true, "KLL_WEB_MALZEME"),
      getItem("Malzeme Depoları", "malzemeDepolari", true, undefined, true, "KLL_WEB_MALDEPO"),
      getItem("Malzeme Girişleri", "malzemeGirisFisi", true, undefined, true, "KLL_WEB_MALGIRIS"),
      getItem("Malzeme Çıkışları", "malzemeCikisFisi", true, undefined, true, "KLL_WEB_MALCIKIS"),
      getItem("Malzeme Transferleri", "malzemeTransferFisi", true, undefined, true, "KLL_WEB_TRANSFER"),
      getItem("Stok Sayımları", "stokSayimlariFisListe", true),
    ],
    false
  ),
  getItem(
    "Personel Yönetimi",
    "personelYonetimi",
    <TeamOutlined />,
    [
      getItem("Atölye / Ekip Tanımları", "atolye", true, undefined, true, "KLL_WEB_ATOLYE"),
      getItem("Personel Tanımları", "personeltanimlari", true, undefined, true, "KLL_WEB_PERTANIM"),
      getItem("Personel İzinleri", "personelIzinleri", true, undefined, true, "KLL_WEB_PERIZIN"),
      getItem("Personel Nöbetleri", "personelNobetleri", true, undefined, true, "KLL_WEB_PERNOBET"),
      getItem("Personel Çalışma Planı", "personelCalismaPLani", true, undefined, true, "KLL_WEB_PERPLAN"),
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
    false,
    "KLL_WEB_SATINALMA_MODUL"
  ),
  getItem(
    "Yakıt Yönetimi",
    "yakitYonetimi",
    <FireOutlined />,
    [
      getItem("Yakıt Tanımları", "yakitTanimlari", true),
      getItem("Yakıt Depoları / Tanklar", "yakitStoklari", true),
      getItem("Yakıt İşlemleri", "yakitGirisleri", true),
      getItem("Yakıt Hareketleri", "yakitHareketleri", true),
      getItem("Hızlı Yakıt İşlemleri", "hizliYakitGirisi", true),
    ],
    false,
    "KLL_WEB_YAKIT_MODUL"
  ),
  getItem(
    "Proje Yönetimi",
    "projeYonetimi",
    <CalculatorOutlined />,
    [getItem("Proje Tanımları", "projeTanimlari2", true), getItem("Proje İlerleme İşlemleri", "projeIlerleme", true), getItem("Proje Yönetimi", "projeYonetimiListe", true)],
    false,
    "KLL_WEB_PROJE_MODUL"
  ),
  getItem(
    "Firma ve Sözleşme Yönetimi",
    "firmaVeSozlesmeYonetimi",
    <ShoppingCartOutlined />,
    [
      getItem("Firma Sözleşmeleri", "firmaSozlesme", true),
      getItem("Firma Tanımları", "firmaTanimlari", true),
    ],
    false,
    "KLL_WEB_FIRMA_SOZLESME_MODUL"
  ),
  getItem(
    "Analizler",
    "analizler1",
    <BarChartOutlined />,
    [
      getItem("Müdahale Süreleri Analizi", "mudaheleSuresi", true, undefined, true, "KLL_WEB_MUDANALIZ"),
      getItem("Personel KPI Analizi", "analizler", true, undefined, true, "KLL_WEB_ANALIZ"),
      getItem("Bakım KPI Analizi", "bakimKpi", true),
    ],
    false
  ),
  getItem("Rapor & Formlar", "rapor&formlar", <FileTextOutlined />, [getItem("Rapor Yönetimi", "raporYonetimi", true, undefined, true, "KLL_WEB_RAPOR")], false),
  getItem(
    "Yönetim",
    "yonetim",
    <SettingOutlined />,
    [
      getItem("Doküman Yönetimi", "dokumanYonetimi", true),
      getItem("Resim Yönetimi", "resimYonetimi", true),
      getItem("Lokasyon Tanımları", "lokasyon", true, undefined, true, "KLL_WEB_LOKASYON"),
      getItem("Vardiya Tanımları", "vardiyalar", true, undefined, true, "KLL_WEB_VARDIYA"),
      getItem("Ekipman Aylık Çalışma Süreleri", "ekipmanAylikCalismaSureleri", true),
      getItem("Kod Yönetimi", "kodYonetimi", true, undefined, true, "KLL_WEB_KOD"),
      getItem("Otomatik Kodlar", "otomatikKodlar", true, undefined, true, "KLL_WEB_OTOKOD"),
      getItem("Servis Öncelik Seviyeleri", "servisOncelikSeviyeleri", true, undefined, true, "KLL_WEB_SERVIS"),
      getItem("İş Emri Tipleri", "isEmriTipleri", true, undefined, true, "KLL_WEB_ISEMRITIP"),
      getItem(
        "Onay İşlemleri",
        "onayIslemleri",
        "",
        [
          getItem("Onay Tanımları", "onayTanimlari", true, undefined, true, "KLL_WEB_ONAY"),
          getItem("Rol Tanımları", "rolTanimlari", true, undefined, true, "KLL_WEB_ONAY"),
          getItem("Onaylayıcılar", "onaylayicilar", true, undefined, true, "KLL_WEB_ONAY"),
        ],
        false
      ),
      getItem("Proje Tanımları", "projeTanimlari", true, undefined, true, "KLL_WEB_PROJE"),
      getItem("Kullanıcı Tanımları", "kullaniciTanimlari", true, undefined, true, "KLL_WEB_KULLANICI"),
      getItem("Rol Tanımları", "RolTanimlari1", true, undefined, true, "KLL_WEB_ROL"),
      getItem("İş Talebi Kullanıcıları", "isTalebiKullanicilari", true, undefined, true, "KLL_WEB_ISTKUL"),
      getItem("Ayarlar", "Ayarlar", undefined, undefined, false, "KLL_WEB_AYARLAR"),
    ],
    false
  ),
];
