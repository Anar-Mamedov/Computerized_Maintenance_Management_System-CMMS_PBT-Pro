import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbNameMap = {
    "/": "Dashboard",
    "/isEmri1": "İş Emirleri",
    "/User": "Profil Ekranı",
    "/periyodikBakimlar": "Periyodik Bakımlar",
    "/otomatikIsEmirleri": "Otomatik İş Emirleri",
    "/raporYonetimi": "Rapor Yönetimi",
    "/analizler": "Analizler",
    "/planlamaTakvimi": "Planlama Takvimi",
    "/makine": "Ekipman Tanımları",
    "/ekipmanVeritabani": "Alt Ekipman Veritabanı",
    "/sayacGuncelleme": "Sayaç Güncelleme",
    "/personelIzinleri": "Personel İzinleri",
    "/personelNobetleri": "Personel Nöbetleri",
    "/personelCalismaPLani": "Personel Çalışma Planı",
    "/isTalebiKullanicilari": "İş Talebi Kullanıcıları",
    "/formYonetimi": "Form Yönetimi",
    "/kodYonetimi": "Kod Yönetimi",
    "/otomatikKodlar": "Otomatik Kodlar",
    "/servisOncelikSeviyeleri": "Servis Öncelik Seviyeleri",
    "/isEmriTipleri": "İş Emri Tipleri",
    "/onaylayicilar": "Onaylayıcılar",
    "/rolTanimlari": "Rol Tanımları",
    "/onayIslemleri": "Onay İşlemleri",
    "/onayTanimlari": "Onay Tanımları",
    "/projeTanimlari": "Proje Tanımları",
    "/lokasyon": "Lokasyon Tanımları",
    "/vardiyalar": "Vardiya Tanımları",
    "/bakimTanimlari": "Bakım Planları",
    "/arizaTanimlari": "Arıza Kodları",
    "/atolye": "Atölye / Ekip Tanımları",
    "/personeltanimlari": "Personel Tanımları",
    "/isTalepleri": "İş Talepleri",
    "/demo": "Demo",
    "/userid": "User ID Control",
    "/mudaheleSuresi": "Müdahale Süreleri Analizi",
    "/kullaniciTanimlari": "Kullanıcı Tanımları",
    "/RolTanimlari1": "Rol Tanımları",
    "/malzemeTanimi": "Malzeme Tanımları",
    "/malzemeDepolari": "Malzeme Depoları",
    "/malzemeGirisFisi": "Malzeme Girişleri",
    "/malzemeCikisFisi": "Malzeme Çıkışları",
    "/malzemeTransferFisi": "Malzeme Transferleri",
    "/stokSayimlari": "Stok Sayımları",
    "/hizliMaliyetlendirme": "Hızlı Maliyetlendirme",
    "/malzemeTransferOnayIslemleri": "Malzeme Transfer Onay İşlemleri",
    "/malzemeTalepleri": "Malzeme Talepleri",
    "/satinalmaSiparisleri": "Satınalma Siparişleri",
    "/fiyatTeklifleri": "Fiyat Teklifleri",
    "/tedarikciFirmalar": "Tedarikçi Firmalar",
    "/satinalmaDashboard": "Satınalma Yönetici Paneli",
    "/isEmriAnalizi": "İş Emirleri Kontrol Ekranı",
    "/bakimKpiPano": "Bakım KPI Panosu",

    // Diğer route'lar için ekleyin...
  };

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
    };
  });

  const items = [
    {
      key: "home",
      title: <Link to="/">{breadcrumbNameMap["/"]}</Link>,
    },
    ...breadcrumbItems,
  ];

  return <Breadcrumb style={{ margin: "7px 0" }} items={items} />;
};

export default Breadcrumbs;
