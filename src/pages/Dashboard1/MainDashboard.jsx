import React, { useState, useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import { Button, Checkbox, Popover, Typography, Switch, Tooltip, ConfigProvider } from "antd";
import { DownOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import trTR from "antd/lib/locale/tr_TR";
import { useForm, FormProvider } from "react-hook-form";
import Component3 from "./components/Component3.jsx";
import Component2 from "./components/Component2.jsx";
import Component1 from "./components/Component1.jsx";
import Component4 from "./components/Component4.jsx";
import Component5 from "./components/Component5.jsx";
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

import "./custom-gridstack.css"; // Add this line to import your custom CSS

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
};

const defaultItems = [
  { id: "widget1", x: 0, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
  { id: "widget2", x: 3, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
  { id: "widget3", x: 6, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
  { id: "widget4", x: 9, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
  { id: "widget5", x: 0, y: 1, width: 5, height: 3, minW: 3, minH: 2 },
  { id: "widget16", x: 0, y: 4, width: 5, height: 3, minW: 3, minH: 2 },
  { id: "widget10", x: 5, y: 1, width: 7, height: 3, minW: 3, minH: 2 },
  { id: "widget17", x: 0, y: 7, width: 5, height: 3, minW: 3, minH: 2 },
  { id: "widget7", x: 5, y: 4, width: 7, height: 3, minW: 3, minH: 2 },
  { id: "widget6", x: 0, y: 10, width: 5, height: 3, minW: 3, minH: 2 },
  { id: "widget11", x: 5, y: 7, width: 7, height: 3, minW: 3, minH: 2 },
  { id: "widget8", x: 0, y: 13, width: 5, height: 3, minW: 3, minH: 2 },
  { id: "widget13", x: 5, y: 10, width: 7, height: 3, minW: 3, minH: 2 },
  { id: "widget9", x: 5, y: 13, width: 7, height: 3, minW: 3, minH: 2 },
  { id: "widget14", x: 0, y: 16, width: 5, height: 3, minW: 3, minH: 2 },
  { id: "widget15", x: 5, y: 16, width: 7, height: 3, minW: 3, minH: 2 },
  { id: "widget12", x: 0, y: 19, width: 12, height: 3, minW: 3, minH: 2 },
];
function MainDashboard() {
  const [reorganize, setReorganize] = useState();
  const [updateApi, setUpdateApi] = useState(false);
  const [checkedWidgets, setCheckedWidgets] = useState({
    widget1: false,
    widget2: false,
    widget3: false,
    widget4: false,
    widget5: false,
    widget6: false,
    widget7: false,
    widget8: false,
    widget9: false,
    widget10: false,
    widget11: false,
    widget12: false,
    widget13: false,
    widget14: false,
    widget15: false,
    widget16: false,
    widget17: false,
    widget18: false,
  });

  const methods = useForm({
    defaultValues: {
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, watch, reset } = methods;

  const selectedDashboard = watch("selectedDashboard");

  const updateApiTriger = async () => {
    setUpdateApi(!updateApi);
  };

  useEffect(() => {
    const reorganizeValue = localStorage.getItem("reorganize");
    if (reorganizeValue !== null) {
      setReorganize(reorganizeValue === "true");
    } else {
      setReorganize(false); // Or any other default value you want reorganize varsayılan değerini ayarla
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
        handles: "se, sw", // Enable resizing from bottom right and bottom left
      },
      column: 12, // 12 sütunlu grid yapısı
      margin: 10, // Widgetler arasında 10px boşluk bırakır
      minRow: 1,
      cellHeight: "auto", // Widgetlerin otomatik yüksekliğini ayarla
      draggable: {
        handle: ".widget-header", // Dragging handle to move widgets
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
          case "widget1":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <Component1 />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget2":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <Component2 />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget3":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <Component3 />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget4":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <Component4 />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget5":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <Component5 />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget6":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <LokasyonBazindaIsTalepleri />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget7":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <IsEmirleriOzetTablosu />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget8":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <ArizaliMakineler />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget9":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <MakineTiplerineGore />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget10":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <TamamlanmaOranlari />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget11":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <AylikBakimMaliyetleri />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget12":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <IsEmriZamanDagilimi />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget13":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <PersonelBazindaIsGucu />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget14":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <ToplamHarcananIsGucu />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget15":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <PersonelKPITablosu />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget16":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <IsEmriTipleri />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget17":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <IsTalebiTipleri />
                  </AppProvider>
                </ConfigProvider>
              </FormProvider>
            );
            break;
          case "widget18":
            root.render(
              <FormProvider {...methods}>
                <ConfigProvider locale={trTR}>
                  <AppProvider>
                    <OnayIstekleriTablo />
                  </AppProvider>
                </ConfigProvider>
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
        widget1: false,
        widget2: false,
        widget3: false,
        widget4: false,
        widget5: false,
        widget6: false,
        widget7: false,
        widget8: false,
        widget9: false,
        widget10: false,
        widget11: false,
        widget12: false,
        widget13: false,
        widget14: false,
        widget15: false,
        widget16: false,
        widget17: false,
        widget18: false,
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
        widget1: false,
        widget2: false,
        widget3: false,
        widget4: false,
        widget5: false,
        widget6: false,
        widget7: false,
        widget8: false,
        widget9: false,
        widget10: false,
        widget11: false,
        widget12: false,
        widget13: false,
        widget14: false,
        widget15: false,
        widget16: false,
        widget17: false,
        widget18: false,
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
    localStorage.removeItem("reorganize");
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

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "calc(-200px + 100vh)",
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
      <Checkbox name="widget1" onChange={handleCheckboxChange} checked={checkedWidgets.widget1}>
        Devam Eden İş Talepleri
      </Checkbox>
      <Checkbox name="widget2" onChange={handleCheckboxChange} checked={checkedWidgets.widget2}>
        Açık İş Emirleri
      </Checkbox>
      <Checkbox name="widget3" onChange={handleCheckboxChange} checked={checkedWidgets.widget3}>
        Düşük Stoklu Malzemeler
      </Checkbox>
      <Checkbox name="widget4" onChange={handleCheckboxChange} checked={checkedWidgets.widget4}>
        Toplam Makine Sayısı
      </Checkbox>
      <Checkbox name="widget5" onChange={handleCheckboxChange} checked={checkedWidgets.widget5}>
        Özet Durum
      </Checkbox>
      <Checkbox name="widget6" onChange={handleCheckboxChange} checked={checkedWidgets.widget6}>
        Lokasyon Bazında İş Talepleri ve İş Emirleri Dağılımı
      </Checkbox>
      <Checkbox name="widget7" onChange={handleCheckboxChange} checked={checkedWidgets.widget7}>
        İş Emri Analizi
      </Checkbox>
      <Checkbox name="widget8" onChange={handleCheckboxChange} checked={checkedWidgets.widget8}>
        Arızalı Makineler
      </Checkbox>
      <Checkbox name="widget9" onChange={handleCheckboxChange} checked={checkedWidgets.widget9}>
        Makine Tiplerine Göre Envanter Dağılımı
      </Checkbox>
      <Checkbox name="widget10" onChange={handleCheckboxChange} checked={checkedWidgets.widget10}>
        Tamamlanmış İş Talepleri ve İş Emirleri Oranları
      </Checkbox>{" "}
      <Checkbox name="widget11" onChange={handleCheckboxChange} checked={checkedWidgets.widget11}>
        Aylık Bakım Maliyetleri
      </Checkbox>{" "}
      <Checkbox name="widget12" onChange={handleCheckboxChange} checked={checkedWidgets.widget12}>
        İş Emirlerinin Zaman Dağılımı
      </Checkbox>
      <Checkbox name="widget13" onChange={handleCheckboxChange} checked={checkedWidgets.widget13}>
        Personel Bazında İş Gücü
      </Checkbox>
      <Checkbox name="widget14" onChange={handleCheckboxChange} checked={checkedWidgets.widget14}>
        Toplam Harcanan İş Gücü
      </Checkbox>
      <Checkbox name="widget15" onChange={handleCheckboxChange} checked={checkedWidgets.widget15}>
        Personel KPI
      </Checkbox>
      <Checkbox name="widget16" onChange={handleCheckboxChange} checked={checkedWidgets.widget16}>
        İş Emri Tipleri
      </Checkbox>
      <Checkbox name="widget17" onChange={handleCheckboxChange} checked={checkedWidgets.widget17}>
        İş Emri Tipleri
      </Checkbox>
      <Checkbox name="widget18" onChange={handleCheckboxChange} checked={checkedWidgets.widget18}>
        Bekleyen Onaylarım
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
        <AppProvider>
          <div className="App">
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <CustomDashboards />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                <Button type="text" onClick={rerenderWidgets}>
                  <Text
                    type="secondary"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <ReloadOutlined />
                    Verileri Yenile
                  </Text>
                </Button>
                <Button
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "5px",
                  }}
                  onClick={handleRearrange}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill=""
                      fillRule="evenodd"
                      d="M18 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1zm-1 7.5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zM5 17a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm5.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm6.5 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm-5.5-7.5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1zm-7.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1zM10.5 5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V5zM5 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H5z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Yeniden Sırala
                </Button>
                <Popover content={content} title="Widgetları Yönet" trigger="click">
                  <Button
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" name="widget">
                      <path
                        fill=""
                        fillRule="evenodd"
                        d="M17.5 2a1 1 0 01.894.553l3.5 7A1 1 0 0121 11h-7a1 1 0 01-.894-1.447l3.5-7A1 1 0 0117.5 2zm-1.882 7h3.764L17.5 5.236 15.618 9zM4 13a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H4zm0 7v-5h5v5H4zm13.5-7a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM15 17.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM6.5 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM4 6.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Widgetleri Yönet
                    <DownOutlined style={{ marginLeft: "2px" }} />
                  </Button>
                </Popover>
              </div>
            </div>
            <div style={{ overflow: "auto", height: "calc(100vh - 210px)" }}>
              <div className="grid-stack">
                <div className="grid-stack-item border-dark" id="widget1">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget1}</div>
                    <Component1 />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget2">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget2}</div>
                    <Component2 />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget3">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget3}</div>
                    <Component3 />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget4">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget4}</div>
                    <Component4 />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget5">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget5}</div>
                    <Component5 />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget6">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget6}</div>
                    <LokasyonBazindaIsTalepleri />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget7">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget7}</div>
                    <IsEmirleriOzetTablosu />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget8">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget8}</div>
                    <ArizaliMakineler />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget9">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget9}</div>
                    <MakineTiplerineGore />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget10">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget10}</div>
                    <TamamlanmaOranlari />
                  </div>
                </div>{" "}
                <div className="grid-stack-item border-dark" id="widget11">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget11}</div>
                    <AylikBakimMaliyetleri />
                  </div>
                </div>{" "}
                <div className="grid-stack-item border-dark" id="widget12">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget12}</div>
                    <IsEmriZamanDagilimi />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget13">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget13}</div>
                    <PersonelBazindaIsGucu />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget14">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget14}</div>
                    <ToplamHarcananIsGucu />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget15">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget15}</div>
                    <PersonelKPITablosu />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget16">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget16}</div>
                    <IsEmriTipleri />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget17">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget17}</div>
                    <IsEmriTipleri />
                  </div>
                </div>
                <div className="grid-stack-item border-dark" id="widget18">
                  <div className="grid-stack-item-content">
                    <div className="widget-header">{widgetTitles.widget18}</div>
                    <OnayIstekleriTablo />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppProvider>
      </ConfigProvider>
    </FormProvider>
  );
}

export default MainDashboard;
