import React, { useState, useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import { Button, Checkbox, Popover, Typography, Switch, Tooltip, ConfigProvider, Modal, Table } from "antd";
import { DownOutlined, QuestionCircleOutlined, ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ReactDOM, { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../utils/i18n.js";
import trTR from "antd/lib/locale/tr_TR";
import { useForm, FormProvider } from "react-hook-form";
import { AppProvider } from "../../../AppContext.jsx";
import Filters from "./Filters/Filters.jsx";
import Component3 from "./components/Component3.jsx";
import Component2 from "./components/Component2.jsx";
import Component1 from "./components/Component1.jsx";
import Component4 from "./components/Component4.jsx";
import Component5 from "./components/Component5.jsx";
import Component6 from "./components/Component6.jsx";
import Component7 from "./components/Component7.jsx";
import Component8 from "./components/Component8.jsx";
import IsEmriTable from "./components/Table/Table.jsx";
import LokasyonBazindaIsTalepleri from "./components/LokasyonBazindaIsTalepleri.jsx";
import IsEmirleriOzetTablosu from "./components/IsEmirleriOzetTablosu.jsx";
import ArizaliMakineler from "./components/ArizaliMakineler.jsx";
import MakineTiplerineGore from "./components/MakineTiplerineGore.jsx";
import TamamlanmaOranlari from "./components/TamamlanmaOranlari.jsx";
import YakitVerimliligi from "./components/YakitVerimliligi.jsx";
import LokasyonBazindaYakitTuketimleri from "./components/LokasyonBazindaYakitTuketimleri.jsx";
import AylikYakitTuketimleri from "./components/AylikYakitTuketimleri.jsx";
import IsEmriZamanDagilimi from "./components/IsEmriZamanDagilimi.jsx";
import PersonelBazindaIsGucu from "./components/PersonelBazindaIsGucu.jsx";
import BolgelereGoreToplamMiktarDagilimi from "./components/BolgelereGoreToplamMiktarDagilimi.jsx";
import ArizaDagilimi from "./components/ArizaDagilimi.jsx";
import AylikMaliyetler from "./components/AylikMaliyetler.jsx";
import AylikKM from "./components/AylikKM.jsx";
import CustomDashboards from "./components/CustomDashboards.jsx";
import PersonelKPITablosu from "./components/PersonelKPITablosu.jsx";
import IsEmriTipleri from "./components/IsEmriTipleri.jsx";
import IsTalebiTipleri from "./components/IsTalebiTipleri.jsx";

import "./custom-gridstack.css";

const { Text } = Typography;

const widgetTitles = {
  widget5: "MTTR",
  widget6: "PM / BM Adam-Saat Trend",
  widget11: "Tamamlanan / Planlanan Bakım",
  widget14: "Arıza Katkısı",
  widget18: "Bakım Maliyeti",
  widget19: "MTBF",
  widget20: "Arıza Durumu (Aylık Trend)",
  widget21: "En Sık Arıza Nedenleri",
  widget22: "Duruş Nedenleri Katkı",
  widget23: "Arıza Süresi Dağılımı",
  widget24: "Planlanan / Tamamlanan (Periyot Bazlı)",
  widget25: "Arıza Dağılımı",
};

// BURASI DÜZENLENDİ: Üstte 2 (Genişlik 6), Altlarda 3 (Genişlik 4)
const defaultItems = [
  // --- 1. Satır (2 Widget) ---
  { id: "widget5", x: 0, y: 0, width: 6, height: 3, minW: 3, minH: 2 },
  { id: "widget19", x: 6, y: 0, width: 6, height: 3, minW: 3, minH: 2 },

  // --- 2. Satır (3 Widget) ---
  { id: "widget14", x: 0, y: 3, width: 4, height: 4, minW: 3, minH: 2 },
  { id: "widget6", x: 4, y: 3, width: 4, height: 4, minW: 3, minH: 2 },
  { id: "widget18", x: 8, y: 3, width: 4, height: 4, minW: 3, minH: 2 },

  // --- 3. Satır (3 Widget) ---
  { id: "widget11", x: 0, y: 7, width: 4, height: 4, minW: 3, minH: 2 },
  { id: "widget22", x: 4, y: 7, width: 4, height: 4, minW: 3, minH: 2 },
  { id: "widget21", x: 8, y: 7, width: 4, height: 4, minW: 3, minH: 2 },

  // --- 4. Satır (3 Widget) ---
  { id: "widget20", x: 0, y: 11, width: 4, height: 4, minW: 3, minH: 2 },
  { id: "widget23", x: 4, y: 11, width: 4, height: 4, minW: 3, minH: 2 },
  { id: "widget24", x: 8, y: 11, width: 4, height: 4, minW: 3, minH: 2 },

  { id: "widget25", x: 0, y: 15, width: 4, height: 4, minW: 3, minH: 2 },
];

// --- KPI Tablosu Verileri (Görselden Alındı) ---
const kpiData = [
  {
    key: '1',
    kpi: 'Planlı Bakım Uyum Oranı (PMC %)',
    aciklama: 'Zamanında tamamlanan planlı bakım oranı',
    formul: '(Zamanında Tamamlanan PM / Toplam Planlı PM) x 100',
  },
  {
    key: '2',
    kpi: 'Arıza Sıklığı (BF)',
    aciklama: 'Belirli dönemde oluşan arıza sıklığı',
    formul: 'Arıza Sayısı / Dönem (gün/hafta/ay)',
  },
  {
    key: '3',
    kpi: 'MTTR (Ortalama Onarım Süresi)',
    aciklama: 'Bir arızanın tespit edilip giderilmesi için geçen ortalama süre',
    formul: 'Toplam Onarım Süresi / Onarım Sayısı',
  },
  {
    key: '4',
    kpi: 'MTBF (Arızalar Arası Ortalama Süre)',
    aciklama: 'İki arıza arasındaki ortalama çalışma süresi',
    formul: 'Toplam Çalışma Süresi / Toplam Arıza Sayısı',
  },
  {
    key: '5',
    kpi: 'Birim Üretim Başına Bakım Maliyeti',
    aciklama: 'Üretilen birim başına bakım maliyeti',
    formul: 'Toplam Bakım Maliyeti / Toplam Üretim',
  },
  {
    key: '6',
    kpi: 'Planlı Bakım Oranı (PMR %)',
    aciklama: 'Planlı bakımın toplam bakıma oranı',
    formul: 'Planlı Bakım Saatleri / Toplam Bakım Saatleri x 100',
  },
  {
    key: '7',
    kpi: 'Program Uyum Oranı (SC %)',
    aciklama: 'Takvime uygun tamamlanan bakım oranı',
    formul: 'Zamanında Tamamlanan Bakım / Toplam Bakım x 100',
  },
  {
    key: '8',
    kpi: 'Bakım Geri Kalanı (Backlog %)',
    aciklama: 'Mevcut iş yükü oranı',
    formul: 'Bekleyen Bakım Saatleri / Toplam Mevcut Saat x 100',
  },
  {
    key: '9',
    kpi: 'Düzeltici Bakım Oranı (CR %)',
    aciklama: 'Plansız (düzeltici) bakım oranı',
    formul: 'Düzeltici Bakım Saatleri / Toplam Bakım Saatleri x 100',
  },
  {
    key: '10',
    kpi: 'Yedek Parça Uygunluğu (SPA %)',
    aciklama: 'Yedek parça bulunabilirliği',
    formul: 'Parça Bulunan Süre / Toplam İhtiyaç Süresi x 100',
  },
];

const kpiColumns = [
  {
    title: 'KPI',
    dataIndex: 'kpi',
    key: 'kpi',
    width: '25%',
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: 'Açıklama',
    dataIndex: 'aciklama',
    key: 'aciklama',
    width: '35%',
  },
  {
    title: 'Formül',
    dataIndex: 'formul',
    key: 'formul',
    width: '40%',
  },
];

function MainDashboard() {
  const [reorganize, setReorganize] = useState();
  const [updateApi, setUpdateApi] = useState(false);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [checkedWidgets, setCheckedWidgets] = useState({
    widget5: false,
    widget6: false,
    widget11: false,
    widget14: false,
    widget18: false,
    widget19: false,
    widget20: false,
    widget21: false,
    widget22: false,
    widget23: false,
    widget24: false,
    widget25: false,
  });

  const methods = useForm({
    defaultValues: {
    },
  });

  const { setValue, watch, reset } = methods;

  const selectedDashboard = "BakimKpiAnalizi";

  const updateApiTriger = async () => {
    setUpdateApi(!updateApi);
  };

  useEffect(() => {
    const reorganizeValue = localStorage.getItem("reorganizeBakimKpiAnalizi");
    if (reorganizeValue !== null) {
      setReorganize(reorganizeValue === "true");
    } else {
      setReorganize(false);
      localStorage.setItem("reorganizeBakimKpiAnalizi", "false");
    }
  }, []);

  const onChange = (checked) => {
    if (checked) {
      setReorganize(false);
      localStorage.setItem("reorganizeBakimKpiAnalizi", "false");
    } else {
      setReorganize(true);
      localStorage.setItem("reorganizeBakimKpiAnalizi", "true");
    }
    setTimeout(() => {
      const gridItems = JSON.parse(localStorage.getItem(selectedDashboard)) || [];
      window.updateWidgets(gridItems);
    }, 50);
  };

  useEffect(() => {
    if (reorganize === undefined) {
      return;
    }
    const grid = GridStack.init({
      float: reorganize,
      resizable: {
        handles: "se, sw",
      },
      column: 12,
      margin: 10,
      minRow: 1,
      cellHeight: "auto",
      draggable: {
        handle: ".widget-header",
      },
    });

    const saveLayout = () => {
      const items = grid.engine.nodes.map((item) => ({
        id: item.el.id,
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        minW: item.minW,
        minH: item.minH,
      }));
      localStorage.setItem(selectedDashboard, JSON.stringify(items));
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
          case "widget5":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component7 />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget6":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component8 />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget11":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <IsEmriTable />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget14":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <BolgelereGoreToplamMiktarDagilimi />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget18":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <LokasyonBazindaYakitTuketimleri />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget19":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <AylikYakitTuketimleri />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget21":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component2 />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget22":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component3 />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget20":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component1 />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget23":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component4 />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget24":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component5 />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget25":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <ArizaDagilimi />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          default:
            break;
        }
      });
    };

    const updateWidgets = (newGridItems) => {
      const newChecked = {
        widget5: false,
        widget6: false,
        widget11: false,
        widget14: false,
        widget18: false,
        widget19: false,
        widget20: false,
        widget21: false,
        widget22: false,
        widget23: false,
        widget24: false,
        widget25: false,
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
      const storedItems = JSON.parse(localStorage.getItem(selectedDashboard)) || [];
      const itemsToLoad = storedItems.length > 0 ? storedItems : defaultItems;

      const checked = {
        widget5: false,
        widget6: false,
        widget11: false,
        widget14: false,
        widget18: false,
        widget19: false,
        widget20: false,
        widget21: false,
        widget22: false,
        widget23: false,
        widget24: false,
        widget25: false,
      };
      itemsToLoad.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(checked, item.id)) {
          checked[item.id] = true;
        }
      });
      setCheckedWidgets(checked);
      loadWidgets(itemsToLoad);

      if (!storedItems.length) {
        localStorage.setItem(selectedDashboard, JSON.stringify(itemsToLoad));
      }
    };

    handleDashboardChange();

    return () => {
      grid.off("change", saveLayout);
    };
  }, [reorganize, selectedDashboard]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedWidgets({
      ...checkedWidgets,
      [name]: checked,
    });

    let gridItems = JSON.parse(localStorage.getItem(selectedDashboard)) || [];

    if (!checked) {
      const widgetIndex = gridItems.findIndex((item) => item.id === name);
      if (widgetIndex > -1) {
        gridItems.splice(widgetIndex, 1);
      }
    } else {
      const defaultItem = defaultItems.find((item) => item.id === name);

      const newPosition = findNextAvailablePosition(gridItems, defaultItem.width, defaultItem.height);
      const newWidget = {
        ...defaultItem,
        ...newPosition,
      };

      gridItems.push(newWidget);
    }

    gridItems = rearrangeWidgets(gridItems);

    localStorage.setItem(selectedDashboard, JSON.stringify(gridItems));

    window.updateWidgets(gridItems);
  };

  const findNextAvailablePosition = (gridItems, width, height) => {
    let grid = Array.from({ length: 1000 }, () => Array(12).fill(null));
    let pos = { x: 0, y: 0 };

    gridItems.forEach((item) => {
      for (let i = item.x; i < item.x + item.width; i++) {
        for (let j = item.y; j < item.y + item.height; j++) {
          grid[j][i] = item.id;
        }
      }
    });

    while (!canPlaceWidget(grid, pos.x, pos.y, width, height)) {
      pos.x++;
      if (pos.x + width > 12) {
        pos.x = 0;
        pos.y++;
      }
    }

    return { x: pos.x, y: pos.y };
  };

  const canPlaceWidget = (grid, x, y, width, height) => {
    if (x + width > 12 || y + height > grid.length) return false;
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (grid[j][i] !== null) return false;
      }
    }
    return true;
  };

  const rearrangeWidgets = (items) => {
    let grid = Array.from({ length: 1000 }, () => Array(12).fill(null));
    let pos = { x: 0, y: 0 };

    items.forEach((item) => {
      while (!canPlaceWidget(grid, pos.x, pos.y, item.width, item.height)) {
        pos.x++;
        if (pos.x + item.width > 12) {
          pos.x = 0;
          pos.y++;
        }
      }
      item.x = pos.x;
      item.y = pos.y;
      placeWidget(grid, pos.x, pos.y, item.width, item.height, item.id);
      pos.x += item.width;
      if (pos.x >= 12) {
        pos.x = 0;
        pos.y++;
      }
    });

    return items;
  };

  const placeWidget = (grid, x, y, width, height, id) => {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        grid[j][i] = id;
      }
    }
  };

  const handleReset = () => {
    localStorage.removeItem(selectedDashboard);
    localStorage.removeItem("reorganizeBakimKpiAnalizi");
    window.location.reload();
  };

  const handleRearrange = () => {
    const gridItems = JSON.parse(localStorage.getItem(selectedDashboard)) || [];
    const rearrangedItems = rearrangeWidgets(gridItems);
    localStorage.setItem(selectedDashboard, JSON.stringify(rearrangedItems));
    window.updateWidgets(rearrangedItems);
  };

  const rerenderWidgets = () => {
    const gridItems = JSON.parse(localStorage.getItem(selectedDashboard)) || [];
    window.updateWidgets(gridItems);
  };

  // KPI Modal Handlers
  const showKpiModal = (e) => {
    e.preventDefault(); // Link davranışını engelle
    setIsKpiModalOpen(true);
  };

  const handleKpiOk = () => {
    setIsKpiModalOpen(false);
  };

  const handleKpiCancel = () => {
    setIsKpiModalOpen(false);
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxHeight: "610px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <Switch checked={!reorganize} onChange={onChange} />
        <Tooltip title="Bu aktive edilirse widgetlar otomatik olarak boşlukları doldurur">
          <Text>
            Boşlukları Doldur <QuestionCircleOutlined />
          </Text>
        </Tooltip>
      </div>
      <Checkbox name="widget5" onChange={handleCheckboxChange} checked={checkedWidgets.widget5}>
        MTTR
      </Checkbox>
      <Checkbox name="widget6" onChange={handleCheckboxChange} checked={checkedWidgets.widget6}>
        PM / BM Adam-Saat Trend
      </Checkbox>
      <Checkbox name="widget11" onChange={handleCheckboxChange} checked={checkedWidgets.widget11}>
        Tamamlanan / Planlanan Bakım
      </Checkbox>
      <Checkbox name="widget14" onChange={handleCheckboxChange} checked={checkedWidgets.widget14}>
        Arıza Katkısı
      </Checkbox>
      <Checkbox name="widget18" onChange={handleCheckboxChange} checked={checkedWidgets.widget18}>
        Bakım Maliyeti
      </Checkbox>
      <Checkbox name="widget19" onChange={handleCheckboxChange} checked={checkedWidgets.widget19}>
        MTBF
      </Checkbox>
      <Checkbox name="widget21" onChange={handleCheckboxChange} checked={checkedWidgets.widget21}>
        En Sık Arıza Nedenleri
      </Checkbox>
      <Checkbox name="widget22" onChange={handleCheckboxChange} checked={checkedWidgets.widget22}>
        Duruş Nedenleri Katkı
      </Checkbox>
      <Checkbox name="widget20" onChange={handleCheckboxChange} checked={checkedWidgets.widget20}>
        Arıza Durumu (Aylık Trend)
      </Checkbox>
      <Checkbox name="widget23" onChange={handleCheckboxChange} checked={checkedWidgets.widget23}>
        Arıza Süresi Dağılımı
      </Checkbox>
      <Checkbox name="widget24" onChange={handleCheckboxChange} checked={checkedWidgets.widget24}>
        Planlanan / Tamamlanan (Periyot Bazlı)
      </Checkbox>
      <Checkbox name="widget25" onChange={handleCheckboxChange} checked={checkedWidgets.widget25}>
        Arıza Dağılımı
      </Checkbox>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button danger onClick={handleReset}>
          Widgetları Sıfırla
        </Button>
      </div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={trTR}>
        <div className="App">
          {/* Üst Kısım: Butonlar ve Filtreler */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
              <Filters />
              <Button type="primary" onClick={rerenderWidgets}>
                <ReloadOutlined /> Sorgula
              </Button>
            </div>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: "10px" }}>
              <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }} onClick={handleRearrange}>
                {/* SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M18 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1zm-1 7.5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zM5 17a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm5.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm6.5 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm-5.5-7.5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1zm-7.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1zM10.5 5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V5zM5 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd"></path></svg>
                Yeniden Sırala
              </Button>
              <Popover content={content} title="Widgetları Yönet" trigger="click">
                <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
                  {/* SVG icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" name="widget"><path fillRule="evenodd" d="M17.5 2a1 1 0 01.894.553l3.5 7A1 1 0 0121 11h-7a1 1 0 01-.894-1.447l3.5-7A1 1 0 0117.5 2zm-1.882 7h3.764L17.5 5.236 15.618 9zM4 13a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H4zm0 7v-5h5v5H4zm13.5-7a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM15 17.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM6.5 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM4 6.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" clipRule="evenodd"></path></svg>
                  Widgetleri Yönet <DownOutlined style={{ marginLeft: "2px" }} />
                </Button>
              </Popover>
            </div>
          </div>

          {/* BİLGİ BARI (YENİ EKLENEN KISIM) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "20px",
            backgroundColor: "#fff",
            padding: "8px 15px",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
            marginBottom: "10px",
            fontSize: "12px",
            color: "#595959",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
              <Text type="secondary">KPI Seti:</Text>
              <Text strong>Standart Bakım</Text>
            </div>
            <div style={{ width: "1px", height: "14px", backgroundColor: "#d9d9d9" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Text type="secondary">Veri:</Text>
              <Text strong>PBT PRO (İş Emirleri + Duruş + Maliyet)</Text>
            </div>
            <div style={{ width: "1px", height: "14px", backgroundColor: "#d9d9d9" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <QuestionCircleOutlined style={{ color: "#1890ff" }} />
              <a href="#" onClick={showKpiModal} style={{ color: "#1890ff" }}>KPI Sözlüğü</a>
            </div>
            <div style={{ width: "1px", height: "14px", backgroundColor: "#d9d9d9" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Text type="secondary">Güncelleme:</Text>
              <Text strong>Otomatik / Saatlik</Text>
            </div>
          </div>

          <Modal
            title="KPI Sözlüğü & Hesaplama Metotları"
            open={isKpiModalOpen}
            onOk={handleKpiOk}
            onCancel={handleKpiCancel}
            width={1000}
            footer={[
              <Button key="submit" type="primary" onClick={handleKpiOk}>
                Anladım
              </Button>,
            ]}
          >
            <Table 
              columns={kpiColumns} 
              dataSource={kpiData} 
              pagination={false} 
              size="middle"
              bordered
            />
          </Modal>

          {/* GRIDSTACK ALANI */}
          <div style={{ overflow: "auto", height: "calc(100vh - 270px)" }}> {/* Yükseklik biraz daha kısıldı çünkü bar eklendi */}
            <div className="grid-stack"></div>
          </div>
        </div>

        
      </ConfigProvider>
    </FormProvider>
  );
}

export default MainDashboard;