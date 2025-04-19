import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbNameMap = {
    "/": "Ana Sayfa",
    "/isEmri1": "İş Emirleri",
    "/User": "Profil Ekranı",
    "/periyodikBakimlar": "Periyodik Bakımlar",
    "/otomatikIsEmirleri": "Otomatik İş Emirleri",
    "/raporYonetimi": "Rapor Yönetimi",
    "/analizler": "Analizler",
    "/planlamaTakvimi": "Planlama Takvimi",
    "/makine": "Makine Tanım",
    "/ekipmanVeritabani": "Ekipman Veritabanı",
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
    "/bakimTanimlari": "Bakım Tanımları",
    "/arizaTanimlari": "Arıza Tanımları",
    "/atolye": "Atölye Tanımları",
    "/personeltanimlari": "Personel Tanımları",
    "/isTalepleri": "İş Talepleri",
    "/demo": "Demo",
    "/userid": "User ID Control",
    "/mudaheleSuresi": "Müdahale Süreleri Analizi",
    "/kullaniciTanimlari": "Kullanıcı Tanımları",
    "/RolTanimlari1": "Rol Tanımları",
    "/malzemeTanimi": "Malzeme Tanımları",
    "/malzemeDepolari": "Malzeme Depoları",
    "/malzemeGirisFisi": "Malzeme Giriş Fişi",
    "/malzemeCikisFisi": "Malzeme Çıkış Fişi",
    "/malzemeTransferFisi": "Malzeme Transfer Fişi",
    "/stokSayimlari": "Stok Sayımları",
    "/hizliMaliyetlendirme": "Hızlı Maliyetlendirme",
    "/malzemeTransferOnayIslemleri": "Malzeme Transfer Onay İşlemleri",

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
