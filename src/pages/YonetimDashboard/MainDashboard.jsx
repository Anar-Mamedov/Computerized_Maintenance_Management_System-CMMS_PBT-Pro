import React, { useState, useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import { Button, Checkbox, Popover, Typography, Switch, Tooltip, ConfigProvider, Tabs } from "antd";
import { DownOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import trTR from "antd/lib/locale/tr_TR";
import { useForm, FormProvider } from "react-hook-form";
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
import { AppProvider } from "./../../AppContext.jsx";
import { createRoot } from "react-dom/client";
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

import "./custom-gridstack.css"; 

const { Text } = Typography;

const widgetTitles = {
  widget1: "Devam Eden İş Talepleri",
  widget2: "Açık İş Emirleri",
  widget3: "Düşük Stoklu Malzemeler",
  widget4: "Toplam Makine Sayısı",
  widget5: "Özet Durum",
  widget6: "Lokasyon Bazında İş Talepleri ve İş Emirleri Dağılımı",
  widget7: "İş Emri Analizi",
  widget8: "Arızalı Makineler",
  widget9: "Makine Tiplerine Göre Envanter Dağılımı",
  widget10: "Tamamlanmış İş Talepleri ve İş Emirleri Oranları",
  widget11: "Aylık Bakım Maliyetleri",
  widget12: "İş Emirlerinin Zaman Dağılımı",
  widget13: "Personel Bazında İş Gücü",
  widget14: "Toplam Harcanan İş Gücü",
  widget15: "Personel KPI",
  widget16: "İş Emri Tipleri",
  widget17: "İş Talebi Tipleri",
  widget18: "Bekleyen Onaylarım",
  widget19: "Bekleyen İş Talepleri",
  widget20: "Aktif Makine",
  widget21: "Aktif Personel",
  widget22: "Açık İş Emirleri",
  widget23: "Duruşta Makine",
  widget24: "İş Emirleri Durumu",
  widget25: "Operasyon Maliyeti",
  widget26: "Arıza Nedenleri Maliyetleri",
  widget27: "En Büyük 5 Tedarikçi",
  widget28: "Operasyon Trendleri",
  widget29: "Kritik Uyarılar",
  widget30: "Son Arızalar",
  widget31: "Planlı Bakımlar",
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
};

const widgetDefaults = {
  widget1: { width: 3, height: 1, minW: 3, minH: 1 },
  widget2: { width: 3, height: 1, minW: 3, minH: 1 },
  widget3: { width: 3, height: 1, minW: 3, minH: 1 },
  widget4: { width: 3, height: 1, minW: 3, minH: 1 },
  widget5: { width: 5, height: 3, minW: 3, minH: 2 },
  widget16: { width: 5, height: 3, minW: 3, minH: 2 },
  widget10: { width: 7, height: 3, minW: 3, minH: 2 },
  widget17: { width: 5, height: 3, minW: 3, minH: 2 },
  widget7: { width: 7, height: 3, minW: 3, minH: 2 },
  widget6: { width: 5, height: 3, minW: 3, minH: 2 },
  widget11: { width: 7, height: 3, minW: 3, minH: 2 },
  widget8: { width: 5, height: 3, minW: 3, minH: 2 },
  widget13: { width: 7, height: 3, minW: 3, minH: 2 },
  widget9: { width: 7, height: 3, minW: 3, minH: 2 },
  widget14: { width: 5, height: 3, minW: 3, minH: 2 },
  widget15: { width: 7, height: 3, minW: 3, minH: 2 },
  widget12: { width: 12, height: 3, minW: 3, minH: 2 },
  widget18: { width: 5, height: 3, minW: 3, minH: 2 },
  widget19: { width: 3, height: 1, minW: 3, minH: 1 },
  widget20: { width: 3, height: 1, minW: 3, minH: 1 },
  widget21: { width: 3, height: 1, minW: 3, minH: 1 },
  widget22: { width: 3, height: 1, minW: 3, minH: 1 },
  widget23: { width: 3, height: 1, minW: 3, minH: 1 },
  widget24: { width: 5, height: 3, minW: 3, minH: 2 },
  widget25: { width: 7, height: 3, minW: 3, minH: 2 },
  widget26: { width: 5, height: 3, minW: 3, minH: 2 },
  widget27: { width: 7, height: 3, minW: 3, minH: 2 },
  widget28: { width: 5, height: 3, minW: 3, minH: 2 },
  widget29: { width: 7, height: 3, minW: 3, minH: 2 },
  widget30: { width: 5, height: 3, minW: 3, minH: 2 },
  widget31: { width: 7, height: 3, minW: 3, minH: 2 },
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

// KANKA: Yönetici sekmesinin en üstüne 5 tane kart koyduk.
// Toplam genişlik 12 olduğu için genişlikleri (width) 2-3-2-3-2 şeklinde dağıttım ki sığsınlar.
const tabConfigurations = {
  "yonetici": [
    // --- ÜST SATIR (5 KART - Toplam 12 Birim) ---
    // 2 + 3 + 2 + 3 + 2 = 12 (Tam Sığar)
    
    { id: "widget1", x: 0, y: 0, width: 2, height: 1, minW: 2, minH: 1 },  // 0-2 arası (2 birim)
    { id: "widget2", x: 2, y: 0, width: 3, height: 1, minW: 2, minH: 1 },  // 2-5 arası (3 birim)
    { id: "widget19", x: 5, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, // 5-7 arası (2 birim)
    { id: "widget3", x: 7, y: 0, width: 3, height: 1, minW: 2, minH: 1 },  // 7-10 arası (3 birim)
    { id: "widget4", x: 10, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, // 10-12 arası (2 birim)

    // --- ALT SATIRLAR (Diğerleri aynı kalıyor) ---
    { id: "widget5", x: 0, y: 1, ...widgetDefaults["widget5"] },
    { id: "widget11", x: 5, y: 1, ...widgetDefaults["widget11"] },
    { id: "widget15", x: 0, y: 4, ...widgetDefaults["widget15"] },
    { id: "widget18", x: 7, y: 4, ...widgetDefaults["widget18"] },

    // --- YENİ EKLENEN (EN ALT - GENİŞ) ---
    // En Büyük 5 Tedarikçi (Tam boy yayılacak)
    { id: "widget6", x: 0, y: 7, width: 10, height: 3, minW: 2, minH: 2 },
  ],
  "operasyon": [
    { id: "widget20", x: 0, y: 0, width: 3, height: 1, minW: 2, minH: 1 }, 
    { id: "widget21", x: 3, y: 0, width: 3, height: 1, minW: 2, minH: 1 }, 
    { id: "widget22", x: 6, y: 0, width: 3, height: 1, minW: 2, minH: 1 }, 
    { id: "widget23", x: 9, y: 0, width: 3, height: 1, minW: 2, minH: 1 },
    
    { id: "widget24", x: 0, y: 1, ...widgetDefaults["widget24"] },
    { id: "widget25", x: 5, y: 1, ...widgetDefaults["widget25"] },
    { id: "widget26", x: 0, y: 4, ...widgetDefaults["widget26"] },
    { id: "widget27", x: 7, y: 4, ...widgetDefaults["widget27"] },
    { id: "widget28", x: 0, y: 1, ...widgetDefaults["widget28"] },
    { id: "widget29", x: 5, y: 1, ...widgetDefaults["widget29"] },
    { id: "widget30", x: 0, y: 4, ...widgetDefaults["widget30"] },
    { id: "widget31", x: 7, y: 4, ...widgetDefaults["widget31"] },
  ],
  "makine": [
    { id: "widget32", x: 0, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, 
    { id: "widget33", x: 2, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, 
    { id: "widget34", x: 4, y: 0, width: 2, height: 1, minW: 2, minH: 1 }, 
    { id: "widget35", x: 6, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget36", x: 8, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
    { id: "widget37", x: 10, y: 0, width: 2, height: 1, minW: 2, minH: 1 },

    { id: "widget38", x: 0, y: 1, ...widgetDefaults["widget38"] },
    { id: "widget39", x: 4, y: 1, ...widgetDefaults["widget39"] },
    { id: "widget40", x: 6, y: 4, ...widgetDefaults["widget40"] },
    { id: "widget41", x: 8, y: 4, ...widgetDefaults["widget41"] },
    { id: "widget42", x: 10, y: 1, ...widgetDefaults["widget42"] },
    { id: "widget43", x: 12, y: 1, ...widgetDefaults["widget43"] },
  ],
};

// Fallback için
const defaultItems = tabConfigurations["yonetici"];

function MainDashboard() {
  const [gridInstance, setGridInstance] = useState(null);
  const [reorganize, setReorganize] = useState();
  const [updateApi, setUpdateApi] = useState(false);
  const [activeTab, setActiveTab] = useState("yonetici"); 

  const [checkedWidgets, setCheckedWidgets] = useState({
    widget1: false, widget2: false, widget3: false, widget4: false,
    widget5: false, widget6: false, widget7: false, widget8: false,
    widget9: false, widget10: false, widget11: false, widget12: false,
    widget13: false, widget14: false, widget15: false, widget16: false,
    widget17: false, widget18: false, widget19: false, widget20: false,
    widget21: false, widget22: false, widget23: false, widget24: false,
    widget25: false, widget26: false, widget27: false, widget28: false,
    widget29: false, widget30: false, widget31: false, widget32: false,
    widget33: false, widget34: false, widget35: false, widget36: false,
    widget37: false, widget38: false, widget39: false, widget40: false,
    widget41: false, widget42: false, widget43: false,
  });

  const methods = useForm({
    defaultValues: { },
  });

  const { setValue, watch, reset } = methods;
  const selectedDashboard = watch("selectedDashboard");

  const getCurrentStorageKey = () => `${selectedDashboard || "dashboard"}_${activeTab}`;

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
      window.updateWidgets(gridItems);
    }, 50);
  };

  useEffect(() => {
    if (reorganize === undefined) {
      return;
    }
    
    const gridContainer = document.querySelector('.grid-stack');
    if (gridContainer && gridContainer.gridstack) {
        gridContainer.gridstack.destroy(false);
    }

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
          case "widget1":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component1 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget2":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component2 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget3":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component3 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget4":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component4 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget5":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component5 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget6":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><LokasyonBazindaIsTalepleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget7":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsEmirleriOzetTablosu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget8":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><ArizaliMakineler /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget9":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><MakineTiplerineGore /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget10":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><TamamlanmaOranlari /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget11":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><AylikBakimMaliyetleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget12":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsEmriZamanDagilimi /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget13":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><PersonelBazindaIsGucu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget14":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><ToplamHarcananIsGucu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget15":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><PersonelKPITablosu /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget16":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsEmriTipleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget17":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><IsTalebiTipleri /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget18":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><OnayIstekleriTablo /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget19":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component6 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget20":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component20 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget21":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component21 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget22":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component22 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget23":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component23 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget24":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component24 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget25":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component25 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget26":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component26 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget27":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component27 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget28":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component28 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget29":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component29 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget30":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component30 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget31":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component31 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget32":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component32 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget33":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component33 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget34":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component34 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget35":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component35 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget36":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component36 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget37":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component37 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget38":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component38 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget39":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component39 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget40":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component40 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget41":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component41 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget42":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component42 /></AppProvider></ConfigProvider></FormProvider>); break;
          case "widget43":
            root.render(<FormProvider {...methods}><ConfigProvider locale={trTR}><AppProvider><Component43 /></AppProvider></ConfigProvider></FormProvider>); break;
          default:
            break;
        }
      });
    };

    const updateWidgets = (newGridItems) => {
      const newChecked = {
        widget1: false, widget2: false, widget3: false, widget4: false,
        widget5: false, widget6: false, widget7: false, widget8: false,
        widget9: false, widget10: false, widget11: false, widget12: false,
        widget13: false, widget14: false, widget15: false, widget16: false,
        widget17: false, widget18: false, widget19: false, widget20: false,
        widget21: false, widget22: false, widget23: false, widget24: false,
        widget25: false, widget26: false, widget27: false, widget28: false,
        widget29: false, widget30: false, widget31: false, widget32: false,
        widget33: false, widget34: false, widget35: false, widget36: false,
        widget37: false, widget38: false, widget39: false, widget40: false,
        widget41: false, widget42: false, widget43: false,
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
    { key: 'operasyon', label: 'Operasyon' },
    { key: 'makine', label: 'Makine' },
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
            </div>

            <div style={{ marginBottom: "15px", backgroundColor: "white", padding: "10px 20px 0 20px", borderRadius: "8px" }}>
               <Tabs defaultActiveKey="yonetici" items={items} onChange={(key) => setActiveTab(key)} />
            </div>

            <div style={{ overflow: "auto", height: "calc(100vh - 280px)" }}>
              <div className="grid-stack">
              </div>
            </div>
          </div>
        </AppProvider>
      </ConfigProvider>
    </FormProvider>
  );
}

export default MainDashboard;