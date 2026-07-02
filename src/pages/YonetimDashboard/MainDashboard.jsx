import React, { useState, useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import { Button, Checkbox, Popover, Typography, Switch, Tooltip, ConfigProvider, Tabs, DatePicker, Select, Space } from "antd";
import { DownOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import trTR from "antd/lib/locale/tr_TR";
import { useForm, FormProvider } from "react-hook-form";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./../../AppContext.jsx";
import AxiosInstance from "../../api/http.jsx";
import dayjs from "dayjs";

// --- WIDGET IMPORTLARI ---
import Component3 from "./components/Component3.jsx";
import Component2 from "./components/Component2.jsx";
import Component1 from "./components/Component1.jsx";
import Component4 from "./components/Component4.jsx";
import Component5 from "./components/Component5.jsx";
import Component6 from "./components/Component6.jsx";
import LokasyonBazindaIsTalepleri from "./components/LokasyonBazindaIsTalepleri.jsx";
import IsEmirleriOzetTablosu from "./components/IsEmirleriOzetTablosu.jsx";
import ArizaliMakineler from "./components/ArizaliMakineler.jsx";
import MakineTiplerineGore from "./components/MakineTiplerineGore.jsx";
import TamamlanmaOranlari from "./components/TamamlanmaOranlari.jsx";
import AylikBakimMaliyetleri from "./components/AylikBakimMaliyetleri.jsx";
import IsEmriZamanDagilimi from "./components/IsEmriZamanDagilimi.jsx";
import PersonelBazindaIsGucu from "./components/PersonelBazindaIsGucu.jsx";
import ToplamHarcananIsGucu from "./components/ToplamHarcananIsGucu.jsx";
import CustomDashboards from "./components/CustomDashboards.jsx";
import PersonelKPITablosu from "./components/PersonelKPITablosu.jsx";
import IsEmriTipleri from "./components/IsEmriTipleri.jsx";
import IsTalebiTipleri from "./components/IsTalebiTipleri.jsx";
import OnayIstekleriTablo from "./components/OnayIstekleriTablo.jsx";
import Component20 from "./components/Component20.jsx";
import Component21 from "./components/Component21.jsx";
import Component22 from "./components/Component22.jsx";
import Component23 from "./components/Component23.jsx";
import Component24 from "./components/Component24.jsx";
import Component25 from "./components/Component25.jsx";
import Component26 from "./components/Component26.jsx";
import Component27 from "./components/Component27.jsx";
import Component28 from "./components/Component28.jsx";
import Component29 from "./components/Component29.jsx";
import Component30 from "./components/Component30.jsx";
import Component31 from "./components/Component31.jsx";
import Component32 from "./components/Component32.jsx";
import Component33 from "./components/Component33.jsx";
import Component34 from "./components/Component34.jsx";
import Component35 from "./components/Component35.jsx";
import Component36 from "./components/Component36.jsx";
import Component37 from "./components/Component37.jsx";
import Component38 from "./components/Component38.jsx";
import Component39 from "./components/Component39.jsx";
import Component40 from "./components/Component40.jsx";
import Component41 from "./components/Component41.jsx";
import Component42 from "./components/Component42.jsx";
import Component43 from "./components/Component43.jsx";
import Component44 from "./components/Component44.jsx";
import ToplamCalismaSaati from "./components/ToplamCalismaSaati.jsx";
import AcikIsEmirleri from "./components/AcikIsEmri.jsx";
import ToplamSatinalmaMaliyeti from "./components/ToplamSatinalmaMaliyeti.jsx";
import ToplamMalzemeMaliyeti from "./components/ToplamMalzemeMaliyeti.jsx";
import KritikStokKalemi from "./components/KritikStokKalemi.jsx";
import BekleyenOnaylar from "./components/BekleyenOnaylar.jsx";

// --- YENİ EKLENEN HARİCİ DASHBOARDLAR ---
// NOT: Bu dosya yollarını kendi proje yapına göre kontrol etmelisin.
import SatinalmaDashboard from "../SatinalmaYonetimi/Dashboard1/Dashboard.jsx"; 
import BakimDashboard from "../Analizler/BakimKpiAnalizi/BakimKpiAnalizi.jsx";
import ProjeYonetimi from "../ProjeYonetimi/ProjeYonetimiListe.jsx";

import "./custom-gridstack.css"; 

const { Text } = Typography;
const { RangePicker } = DatePicker;

// Sadece bu tablar GridStack kullanır
const GRID_TABS = ["yonetici", "makine"];

const widgetTitles = {
  widget1: "Toplam Maliyet",
  widget2: "Aktif Ekipman",
  widget3: "Aktif Personel",
  widget4: "Yakıt Tüketimi",
  widget5: "Yıllık Maliyet Grafiği",
  widget6: "Lokasyon Bazında İş Talepleri ve İş Emirleri Dağılımı",
  widget7: "İş Emri Analizi",
  widget8: "Arızalı Makineler",
  widget9: "Makine Tiplerine Göre Envanter Dağılımı",
  widget10: "Tamamlanmış İş Talepleri ve İş Emirleri Oranları",
  widget11: "Maliyet Kayıtları",
  widget12: "İş Emirlerinin Zaman Dağılımı",
  widget13: "Personel Bazında İş Gücü",
  widget14: "Toplam Harcanan İş Gücü",
  widget15: "Maliyet Dağılımı (Yıl İçinde)",
  widget16: "İş Emri Tipleri",
  widget17: "İş Talebi Tipleri",
  widget18: "Bekleyen Onaylarım",
  widget32: "Toplam Ekipman",
  widget33: "Aktif",
  widget34: "Bakımda",
  widget35: "Serviste",
  widget36: "Pasif",
  widget37: "Ortalama Kullanım",
  widget38: "Kritik Ekipmanlar",
  widget39: "Hızlı Özet",
  widget40: "En Yüksek Maliyetli 4 Ekipman",
  widget41: "Yaklaşan Periyodik Bakımlar",
  widget42: "Ortalama Kullanım",
  widget43: "Ortalama Kullanım",
  widget44: "Lokasyon Performansı Özeti",
  widget45: "Toplam Çalışma Saati",
  widget46: "Açık İş Emri",
  widget47: "Toplam Satınalma Maliyeti",
  widget48: "Toplam Malzeme Maliyeti",
  widget49: "Kritik Stok Kalemi",
  widget50: "Bekleyen Onaylar",
};

const widgetDefaults = {
  widget1: { width: 3, height: 2, minW: 3, minH: 1 },
  widget2: { width: 3, height: 2, minW: 3, minH: 1 },
  widget3: { width: 3, height: 2, minW: 3, minH: 1 },
  widget4: { width: 3, height: 2, minW: 3, minH: 1 },
  widget45: { width: 3, height: 2, minW: 3, minH: 1 },
  widget46: { width: 3, height: 2, minW: 3, minH: 1 },
  widget47: { width: 3, height: 2, minW: 3, minH: 1 },
  widget48: { width: 3, height: 2, minW: 3, minH: 1 },
  widget49: { width: 3, height: 2, minW: 3, minH: 1 },
  widget50: { width: 3, height: 2, minW: 3, minH: 1 },
  widget5: { width: 6, height: 3, minW: 3, minH: 2 },
  widget16: { width: 5, height: 3, minW: 3, minH: 2 },
  widget10: { width: 7, height: 3, minW: 3, minH: 2 },
  widget17: { width: 5, height: 3, minW: 3, minH: 2 },
  widget7: { width: 7, height: 3, minW: 3, minH: 2 },
  widget6: { width: 5, height: 4, minW: 3, minH: 2 },
  widget44: { width: 5, height: 4, minW: 3, minH: 2 },
  widget11: { width: 6, height: 3, minW: 3, minH: 2 },
  widget8: { width: 5, height: 3, minW: 3, minH: 2 },
  widget13: { width: 7, height: 3, minW: 3, minH: 2 },
  widget9: { width: 7, height: 3, minW: 3, minH: 2 },
  widget14: { width: 5, height: 3, minW: 3, minH: 2 },
  widget15: { width: 6, height: 3, minW: 3, minH: 2 },
  widget12: { width: 12, height: 3, minW: 3, minH: 2 },
  widget18: { width: 6, height: 3, minW: 3, minH: 2 },
  widget32: { width: 3, height: 1, minW: 3, minH: 1 },
  widget33: { width: 3, height: 1, minW: 3, minH: 1 },
  widget34: { width: 3, height: 1, minW: 3, minH: 1 },
  widget35: { width: 3, height: 1, minW: 3, minH: 1 },
  widget36: { width: 3, height: 1, minW: 3, minH: 1 },
  widget37: { width: 3, height: 1, minW: 3, minH: 1 },
  widget38: { width: 6, height: 3, minW: 3, minH: 2 },
  widget39: { width: 6, height: 3, minW: 3, minH: 2 },
  widget40: { width: 6, height: 3, minW: 3, minH: 2 },
  widget41: { width: 6, height: 3, minW: 3, minH: 2 },
  widget42: { width: 6, height: 3, minW: 3, minH: 2 },
  widget43: { width: 6, height: 3, minW: 3, minH: 2 },
};

const tabConfigurations = {
  "yonetici": [
    // --- ÜST SATIR ---
    { id: "widget1", x: 0, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget2", x: 2, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget3", x: 4, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget4", x: 6, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget45", x: 8, y: 0, width: 4, height: 1, minW: 2, minH: 1 },

    // --- 2. SATIR ÖZET KARTLAR (Görseldeki İkinci 5 Kart) ---
    { id: "widget46", x: 0, y: 2, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget47", x: 2, y: 2, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget48", x: 4, y: 2, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget49", x: 6, y: 2, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget50", x: 8, y: 2, width: 4, height: 1, minW: 2, minH: 1 },

    { id: "widget5", x: 0, y: 5, ...widgetDefaults["widget5"] },
    { id: "widget11", x: 7, y: 5, ...widgetDefaults["widget11"] },

    { id: "widget18", x: 0, y: 5, ...widgetDefaults["widget18"] },
    { id: "widget15", x: 7, y: 5, ...widgetDefaults["widget15"] },

    // --- ALT SATIR (Footer) ---
    { id: "widget6", x: 0, y: 50, width: 12, height: 3, minW: 2, minH: 2 },

    // --- EN ALT SATIR (Footer) ---
    { id: "widget44", x: 0, y: 50, width: 12, height: 3, minW: 2, minH: 2 },
  ],
  "makine": [
    // --- 1. SATIR (KÜÇÜK İSTATİSTİKLER) ---
    // Her biri 2 birim genişlik. Toplam 12 birim.
    { id: "widget32", x: 0, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, 
    { id: "widget33", x: 2, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, 
    { id: "widget34", x: 4, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, 
    { id: "widget35", x: 6, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget36", x: 8, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget37", x: 10, y: 0, width: 2, height: 1, minW: 2, minH: 1 },

    // --- 2. SATIR ---
    // Y: 1'den başlar. Genişlikleri 6 olduğu için 0 ve 6. koordinata koyarız.
    { id: "widget42", x: 0, y: 1, ...widgetDefaults["widget42"] }, // Sol
    { id: "widget39", x: 6, y: 1, ...widgetDefaults["widget39"] }, // Sağ (Önceki x:4 yanlıştı, x:6 olmalı)

    // --- 3. SATIR ---
    // Y: 4'ten başlar (Üsttekiler h:3 olduğu için 1+3=4).
    { id: "widget38", x: 0, y: 4, ...widgetDefaults["widget38"] }, // Sol
    { id: "widget40", x: 6, y: 4, ...widgetDefaults["widget40"] }, // Sol

    // --- 4. SATIR ---
    // Y: 7'den başlar (4+3=7).
    { id: "widget43", x: 0, y: 7, ...widgetDefaults["widget43"] }, // Sol
    { id: "widget41", x: 6, y: 7, ...widgetDefaults["widget41"] }, // Sağ
],
};

const defaultItems = tabConfigurations["yonetici"];

function MainDashboard() {
  const [gridInstance, setGridInstance] = useState(null);
  const [reorganize, setReorganize] = useState();
  const [updateApi, setUpdateApi] = useState(false);
  const [activeTab, setActiveTab] = useState("yonetici"); 
  const [loading, setLoading] = useState(false);
  const [lokasyonOptions, setLokasyonOptions] = useState([]);
const [lokasyonLoading, setLoadingLokasyon] = useState(false);

  const [checkedWidgets, setCheckedWidgets] = useState({
    widget1: false, widget2: false, widget3: false, widget4: false,
    widget5: false, widget6: false, widget7: false, widget8: false,
    widget9: false, widget10: false, widget11: false, widget12: false,
    widget13: false, widget14: false, widget15: false, widget16: false,
    widget17: false, widget18: false, widget32: false,
    widget33: false, widget34: false, widget35: false, widget36: false,
    widget37: false, widget38: false, widget39: false, widget40: false,
    widget41: false, widget42: false, widget43: false, widget44: false,
    widget45: false, widget46: false, widget47: false, widget48: false,
    widget49: false, widget50: false,
  });

  const methods = useForm({
    defaultValues: {
      summaryData: null,
      selectedYoneticiDashboard: null,
      paraBirimi: "TL",
      // Yeni eklenen filtrelerin state yönetimi form içerisine gömüldü
      filtreBaslangicTarihi: "2026-01-01T00:00:00",
      filtreBitisTarihi: "2026-06-26T23:59:59",
      filtreLokasyonIds: [],
      filtreGiderTipi: "TÜMÜ"
    },
  });

  const { setValue, watch, reset } = methods;
  const selectedDashboard = watch("selectedYoneticiDashboard");

  const filterBaslangic = watch("filtreBaslangicTarihi");
  const filterBitis = watch("filtreBitisTarihi");
  const filterLokasyonlar = watch("filtreLokasyonIds");
  const filterGider = watch("filtreGiderTipi");

  const [tempDates, setTempDates] = useState([dayjs("2026-01-01"), dayjs("2026-06-26")]);
  const [tempLokasyonIds, setTempLokasyonIds] = useState([]);
  const [tempGiderTipi, setTempGiderTipi] = useState("TÜMÜ");

  const getCurrentStorageKey = () => `${selectedDashboard || "dashboard"}_${activeTab}`;

  const fetchLokasyonListesi = async () => {
  setLoadingLokasyon(true);
  try {
    const response = await AxiosInstance.get("GetLocations");
    const resData = response.data || response;

    if (Array.isArray(resData)) {
      // array sırasını (index) ID olarak kullanıyoruz
      const mappedOptions = resData.map((lokasyonAdi, index) => ({
        value: index,        // API'ye ve state'e gidecek ID (0, 1, 2...)
        label: lokasyonAdi,   // Ekranda kullanıcının göreceği isim
      }));
      setLokasyonOptions(mappedOptions);
    }
  } catch (error) {
    console.error("Lokasyon listesi çekilirken hata oluştu kanka:", error);
  } finally {
    setLoadingLokasyon(false);
  }
};

// Bileşen ilk açıldığında lokasyonları doldur
useEffect(() => {
  fetchLokasyonListesi();
}, []);

  const handleApplyFilters = () => {
  const baslangic = tempDates ? tempDates[0].startOf('day').format("YYYY-MM-DDTHH:mm:ss") : "2026-01-01T00:00:00";
  const bitis = tempDates ? tempDates[1].endOf('day').format("YYYY-MM-DDTHH:mm:ss") : "2026-06-26T23:59:59";
  const lokasyonlar = tempLokasyonIds;
  const gider = tempGiderTipi;

  // Ana form state'ine yazım
  setValue("filtreBaslangicTarihi", baslangic, { shouldValidate: true });
  setValue("filtreBitisTarihi", bitis, { shouldValidate: true });
  setValue("filtreLokasyonIds", lokasyonlar, { shouldValidate: true });
  setValue("filtreGiderTipi", gider, { shouldValidate: true });

  // --- GRID ALTINDAKİ BAĞIMSIZ COMPONENTLER İÇİN WINDOW EVENTİ ---
  window.globalFilters = {
    baslangicTarihi: baslangic,
    bitisTarihi: bitis,
    lokasyonIds: lokasyonlar,
    giderTipi: gider
  };
  // Custom event tetikliyoruz ki componentler filtrenin değiştiğini anlasın
  window.dispatchEvent(new Event("globalFilterChanged"));
};

  const fetchSummaryCards = async () => {
    console.log("API İsteği atılıyor... Tab:", activeTab); 
    setLoading(true);
    try {
      const response = await AxiosInstance.post("GetSummaryCards", {
        BaslangicTarihi: filterBaslangic,
        BitisTarihi: filterBitis,
        LokasyonIds: filterLokasyonlar,
        GiderTipi: filterGider
      });

      const resData = response.data || response; 

      if (resData && resData.Kartlar) {
        console.log("API'den gelen veri:", resData.Kartlar);
        setValue("summaryData", resData.Kartlar);
        setValue("paraBirimi", resData.ParaBirimi || "TL");
      }
    } catch (error) {
      console.error("Özet verileri çekilirken hata oluştu kanka:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtreler veya manuel trigger değiştiğinde API'yi tekrar çağırıyoruz
  useEffect(() => {
    if (GRID_TABS.includes(activeTab)) {
      fetchSummaryCards();
    }
  }, [updateApi, activeTab, filterBaslangic, filterBitis, filterLokasyonlar, filterGider]);

  const updateApiTriger = async () => {
    setUpdateApi(!updateApi);
  };

  useEffect(() => {
    const reorganizeValue = localStorage.getItem("reorganize");
    if (reorganizeValue !== null) {
      setReorganize(reorganizeValue === "true");
    } else {
      setReorganize(false);
      localStorage.setItem("reorganize", "false");
    }
  }, []);

  const onChange = (checked) => {
    if (checked) {
      setReorganize(false);
      localStorage.setItem("reorganize", "false");
    } else {
      setReorganize(true);
      localStorage.setItem("reorganize", "true");
    }
    setTimeout(() => {
      const gridItems = JSON.parse(localStorage.getItem(getCurrentStorageKey())) || [];
      if (window.updateWidgets) window.updateWidgets(gridItems);
    }, 50);
  };

  useEffect(() => {
    // EĞER GRID TABI DEĞİLSE GRID INIT YAPMA
    if (!GRID_TABS.includes(activeTab)) {
        return;
    }

    if (reorganize === undefined) {
      return;
    }
    
    const gridContainer = document.querySelector('.grid-stack');
    if (gridContainer && gridContainer.gridstack) {
        gridContainer.gridstack.destroy(false);
    }

    // Grid Container yoksa çık
    if (!gridContainer) return;

    const grid = GridStack.init({
      float: reorganize,
      resizable: { handles: "se, sw" },
      column: 12,
      margin: 10,
      minRow: 1,
      cellHeight: "auto",
      draggable: { handle: ".widget-header" },
    });

    setGridInstance(grid);

    const saveLayout = () => {
      const items = grid.engine.nodes.map((item) => ({
        id: item.el.id,
        x: item.x, y: item.y, width: item.w, height: item.h,
        minW: item.minW, minH: item.minH,
      }));
      localStorage.setItem(getCurrentStorageKey(), JSON.stringify(items));
    };

    grid.on("change", saveLayout);

    const loadWidgets = (items) => {
      grid.removeAll();
      items.forEach((item) => {
        const widgetEl = document.createElement("div");
        widgetEl.className = "grid-stack-item";
        widgetEl.id = item.id;
        widgetEl.setAttribute("gs-w", item.width);
        widgetEl.setAttribute("gs-h", item.height);
        widgetEl.setAttribute("gs-x", item.x);
        widgetEl.setAttribute("gs-y", item.y);
        widgetEl.setAttribute("gs-min-w", item.minW);
        widgetEl.setAttribute("gs-min-h", item.minH);

        const contentEl = document.createElement("div");
        contentEl.className = "grid-stack-item-content";

        const headerEl = document.createElement("div");
        headerEl.className = "widget-header";
        headerEl.textContent = widgetTitles[item.id] || `Widget ${item.id}`;

        const bodyEl = document.createElement("div");
        bodyEl.className = "widget-body";

        widgetEl.appendChild(headerEl);
        widgetEl.appendChild(bodyEl);

        grid.addWidget(widgetEl);

        const root = createRoot(bodyEl);
        switch (item.id) {
          case "widget1": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component1 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget2": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component2 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget3": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component3 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget4": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component4 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget5": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component5 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget6": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><LokasyonBazindaIsTalepleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget7": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsEmirleriOzetTablosu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget8": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><ArizaliMakineler /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget9": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><MakineTiplerineGore /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget10": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><TamamlanmaOranlari /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget11": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><AylikBakimMaliyetleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget12": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsEmriZamanDagilimi /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget13": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><PersonelBazindaIsGucu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget14": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><ToplamHarcananIsGucu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget15": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><PersonelKPITablosu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget16": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsEmriTipleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget17": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsTalebiTipleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget18": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><OnayIstekleriTablo /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget32": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component32 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget33": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component33 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget34": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component34 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget35": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component35 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget36": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component36 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget37": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component37 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget38": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component38 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget39": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component39 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget40": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component40 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget41": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component41 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget42": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component42 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget43": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component43 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget44": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component44 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget45": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><ToplamCalismaSaati /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget46": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><AcikIsEmirleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget47": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><ToplamSatinalmaMaliyeti /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget48": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><ToplamMalzemeMaliyeti /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget49": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><KritikStokKalemi /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget50": root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><BekleyenOnaylar /></AppProvider></ConfigProvider></FormProvider>); break;
          default: break;
        }
      });
    };

    const updateWidgets = (newGridItems) => {
      const newChecked = {
        widget1: false, widget2: false, widget3: false, widget4: false,
        widget5: false, widget6: false, widget7: false, widget8: false,
        widget9: false, widget10: false, widget11: false, widget12: false,
        widget13: false, widget14: false, widget15: false, widget16: false,
        widget17: false, widget18: false, widget32: false,
        widget33: false, widget34: false, widget35: false, widget36: false,
        widget37: false, widget38: false, widget39: false, widget40: false,
        widget41: false, widget42: false, widget43: false, widget44: false,
        widget45: false, widget46: false, widget47: false, widget48: false,
        widget49: false, widget50: false,
      };
      newGridItems.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(newChecked, item.id)) {
          newChecked[item.id] = true;
        }
      });
      setCheckedWidgets(newChecked);
      loadWidgets(newGridItems);
    };

    window.updateWidgets = updateWidgets;
    grid.engine.float = reorganize;

    const handleDashboardChange = () => {
      const currentKey = getCurrentStorageKey();
      const storedItems = JSON.parse(localStorage.getItem(currentKey)) || [];
      const itemsToLoad = storedItems.length > 0 ? storedItems : (tabConfigurations[activeTab] || []);

      const checked = { ...checkedWidgets };
      Object.keys(checked).forEach(key => checked[key] = false);

      itemsToLoad.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(checked, item.id)) {
          checked[item.id] = true;
        }
      });
      setCheckedWidgets(checked);
      loadWidgets(itemsToLoad);

      if (!storedItems.length) {
        localStorage.setItem(currentKey, JSON.stringify(itemsToLoad));
      }
    };

    handleDashboardChange();

    return () => {
      grid.off("change", saveLayout);
    };
  }, [reorganize, selectedDashboard, activeTab]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedWidgets({ ...checkedWidgets, [name]: checked });

    let gridItems = JSON.parse(localStorage.getItem(getCurrentStorageKey())) || [];

    if (!checked) {
      const widgetIndex = gridItems.findIndex((item) => item.id === name);
      if (widgetIndex > -1) {
        gridItems.splice(widgetIndex, 1);
      }
    } else {
      let defaultItem = defaultItems.find((item) => item.id === name);
      if (!defaultItem) {
        defaultItem = { id: name, ...widgetDefaults[name] };
      }
      const maxY = gridItems.reduce((acc, cur) => Math.max(acc, cur.y + cur.height), 0);
      const newWidget = { ...defaultItem, x: 0, y: maxY };
      gridItems.push(newWidget);
    }

    localStorage.setItem(getCurrentStorageKey(), JSON.stringify(gridItems));
    window.updateWidgets(gridItems);
  };

  const handleReset = () => {
    localStorage.removeItem(getCurrentStorageKey());
    window.location.reload();
  };

  const handleRearrange = () => {
    if (gridInstance) {
      gridInstance.compact();
      const items = gridInstance.engine.nodes.map((item) => ({
        id: item.el.id,
        x: item.x, y: item.y, width: item.w, height: item.h,
        minW: item.minW, minH: item.minH,
      }));
      localStorage.setItem(getCurrentStorageKey(), JSON.stringify(items));
    }
  };

  const rerenderWidgets = () => {
    const gridItems = JSON.parse(localStorage.getItem(getCurrentStorageKey())) || [];
    window.updateWidgets(gridItems);
  };

  const content = (
    <div
      style={{
        display: "flex", flexDirection: "column", gap: "10px",
        height: "calc(-200px + 100vh)", maxHeight: "610px", overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
        <Switch checked={!reorganize} onChange={onChange} />
        <Tooltip title="Bu aktive edilirse widgetlar otomatik olarak boşlukları doldurur">
          <Text>Boşlukları Doldur <QuestionCircleOutlined /></Text>
        </Tooltip>
      </div>
      
      {Object.keys(widgetTitles).map(key => (
        <Checkbox key={key} name={key} onChange={handleCheckboxChange} checked={checkedWidgets[key]}>
          {widgetTitles[key]}
        </Checkbox>
      ))}

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button danger onClick={handleReset}>
          Bu Sekmeyi Sıfırla
        </Button>
      </div>
    </div>
  );

  const items = [
    { key: 'yonetici', label: 'Yönetici Özeti' },
    //{ key: 'proje', label: 'Proje Yönetimi' },
    //{ key: 'makine', label: 'Makine' },
    { key: 'satinalma', label: 'Satınalma' },
    { key: 'bakim', label: 'Bakım' },
  ];

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={trTR}>
        <AppProvider>
          <div className="App">
            <div
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: "10px", marginBottom: "10px",
              }}
            >
              <CustomDashboards />
              
              {/* SADECE GRID OLAN SEKMELERDE TOOLBAR GÖSTER */}
              {GRID_TABS.includes(activeTab) && (
                  <div style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: "10px" }}>
                    <Button type="text" onClick={rerenderWidgets}>
                      <Text type="secondary" style={{ display: "flex", flexDirection: "row", gap: "5px", alignItems: "center" }}>
                        <ReloadOutlined /> Verileri Yenile
                      </Text>
                    </Button>
                    <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }} onClick={handleRearrange}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path fill="" fillRule="evenodd" d="M18 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1zm-1 7.5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zM5 17a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm5.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm6.5 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm-5.5-7.5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1zm-7.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1zM10.5 5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V5zM5 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd"></path></svg>
                      Yeniden Sırala
                    </Button>
                    <Popover content={content} title="Widgetları Yönet" trigger="click">
                      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" name="widget"><path fill="" fillRule="evenodd" d="M17.5 2a1 1 0 01.894.553l3.5 7A1 1 0 0121 11h-7a1 1 0 01-.894-1.447l3.5-7A1 1 0 0117.5 2zm-1.882 7h3.764L17.5 5.236 15.618 9zM4 13a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H4zm0 7v-5h5v5H4zm13.5-7a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM15 17.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM6.5 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM4 6.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" clipRule="evenodd"></path></svg>
                        Widgetleri Yönet
                        <DownOutlined style={{ marginLeft: "2px" }} />
                      </Button>
                    </Popover>
                  </div>
              )}
            </div>

            <div style={{ marginBottom: "15px", backgroundColor: "white", padding: "10px 20px 0 20px", borderRadius: "8px" }}>
               <Tabs defaultActiveKey="yonetici" items={items} onChange={(key) => setActiveTab(key)} />
            </div>

            {/* --- GLOBAL FİLTRE PANELİ (BUTONLU) --- */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "15px", backgroundColor: "white", borderRadius: "8px", marginBottom: "15px", alignItems: "flex-end" }}>
              
              <Space direction="vertical" size={2}>
                <Text type="secondary" strong style={{ fontSize: "12px" }}>Tarih Aralığı</Text>
                <RangePicker 
                  value={tempDates}
                  onChange={(dates) => setTempDates(dates)}
                />
              </Space>

              <Space direction="vertical" size={2}>
  <Text type="secondary" strong style={{ fontSize: "12px" }}>Lokasyonlar</Text>
  <Select
    mode="multiple"
    style={{ width: "220px" }}
    placeholder="Tüm Lokasyonlar"
    maxTagCount="responsive"
    loading={lokasyonLoading}
    value={tempLokasyonIds}
    onChange={(value) => setTempLokasyonIds(value)} // Buraya artık sadece index array'i gelir
    options={lokasyonOptions}
    allowClear
    showSearch
    filterOption={(input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
  />
</Space>

              <Space direction="vertical" size={2}>
                <Text type="secondary" strong style={{ fontSize: "12px" }}>Gider Tipi</Text>
                <Select
                  style={{ width: "150px" }}
                  value={tempGiderTipi}
                  onChange={(value) => setTempGiderTipi(value)}
                  options={[
                    { value: "TÜMÜ", label: "TÜMÜ" },
                    { value: "BAKIM", label: "BAKIM" },
                    { value: "SATINALMA", label: "SATINALMA" }
                  ]}
                />
              </Space>

              {/* --- UYGULA BUTONU --- */}
              <Button 
                type="primary" 
                style={{ backgroundColor: "#2da44e", borderColor: "#2da44e", fontWeight: "600" }} 
                onClick={handleApplyFilters}
              >
                Filtreleri Uygula
              </Button>
            </div>

            <div style={{ overflow: "auto", height: "calc(100vh - 280px)" }}>
              {/* GRID İÇİN (YONETICI, MAKINE) */}
              {GRID_TABS.includes(activeTab) && (
                 <div className="grid-stack"></div>
              )}

              {/* HARİCİ SAYFALAR İÇİN */}
              {activeTab === 'satinalma' && <SatinalmaDashboard />}
              {activeTab === 'bakim' && <BakimDashboard />}
              {activeTab === 'proje' && <ProjeYonetimi />}
            </div>
          </div>
        </AppProvider>
      </ConfigProvider>
    </FormProvider>
  );
}

export default MainDashboard;