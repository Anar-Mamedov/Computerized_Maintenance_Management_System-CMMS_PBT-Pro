import React, { useState, useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import { Button, Checkbox, Popover, Typography, Switch, Tooltip } from "antd";
import {
  DownOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
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
import { createRoot } from "react-dom/client";

import "./custom-gridstack.css"; // Add this line to import your custom CSS

const { Text } = Typography;

function MainDashboard() {
  const [reorganize, setReorganize] = useState(false);
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
  });

  const methods = useForm({
    defaultValues: {
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, watch, reset } = methods;

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
  };

  useEffect(() => {
    const grid = GridStack.init({
      float: reorganize,
      resizable: {
        handles: "se, sw", // Enable resizing from bottom right and bottom left
      },
      column: 12, // 12 sütunlu grid yapısı
      draggable: {
        handle: ".grid-stack-item-content", // Dragging handle to move widgets
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

      localStorage.setItem("gridItems", JSON.stringify(items));
    };

    grid.on("change", saveLayout);

    const storedItems = JSON.parse(localStorage.getItem("gridItems"));

    const defaultItems = [
      { id: "widget1", x: 0, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
      { id: "widget2", x: 3, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
      { id: "widget3", x: 6, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
      { id: "widget4", x: 9, y: 0, width: 3, height: 1, minW: 3, minH: 1 },
      { id: "widget5", x: 0, y: 1, width: 12, height: 2, minW: 3, minH: 2 },
      { id: "widget10", x: 0, y: 3, width: 4, height: 3, minW: 4, minH: 3 },
      { id: "widget11", x: 4, y: 3, width: 4, height: 3, minW: 4, minH: 3 },
      { id: "widget7", x: 0, y: 6, width: 6, height: 4, minW: 6, minH: 4 },
      { id: "widget6", x: 6, y: 6, width: 6, height: 4, minW: 6, minH: 4 },
      { id: "widget9", x: 0, y: 10, width: 6, height: 4, minW: 6, minH: 4 },
      { id: "widget8", x: 6, y: 10, width: 6, height: 4, minW: 6, minH: 4 },
    ];

    const itemsToLoad = storedItems?.length > 0 ? storedItems : defaultItems;

    if (!localStorage.getItem("hiddenWidgets")) {
      localStorage.setItem("hiddenWidgets", JSON.stringify([]));
    }

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
    };
    itemsToLoad.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(checked, item.id)) {
        checked[item.id] = true;
      }
    });
    setCheckedWidgets(checked);

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
        widgetEl.appendChild(contentEl);

        grid.addWidget(widgetEl);

        const root = createRoot(contentEl);
        switch (item.id) {
          case "widget1":
            root.render(
              <FormProvider {...methods}>
                <Component1 />
              </FormProvider>
            );
            break;
          case "widget2":
            root.render(
              <FormProvider {...methods}>
                <Component2 />
              </FormProvider>
            );
            break;
          case "widget3":
            root.render(
              <FormProvider {...methods}>
                <Component3 />
              </FormProvider>
            );
            break;
          case "widget4":
            root.render(
              <FormProvider {...methods}>
                <Component4 />
              </FormProvider>
            );
            break;
          case "widget5":
            root.render(
              <FormProvider {...methods}>
                <Component5 />
              </FormProvider>
            );
            break;
          case "widget6":
            root.render(
              <FormProvider {...methods}>
                <LokasyonBazindaIsTalepleri />
              </FormProvider>
            );
            break;
          case "widget7":
            root.render(
              <FormProvider {...methods}>
                <IsEmirleriOzetTablosu />
              </FormProvider>
            );
            break;
          case "widget8":
            root.render(
              <FormProvider {...methods}>
                <ArizaliMakineler />
              </FormProvider>
            );
            break;
          case "widget9":
            root.render(
              <FormProvider {...methods}>
                <MakineTiplerineGore />
              </FormProvider>
            );
            break;
          case "widget10":
            root.render(
              <FormProvider {...methods}>
                <TamamlanmaOranlari />
              </FormProvider>
            );
            break;
          case "widget11":
            root.render(
              <FormProvider {...methods}>
                <AylikBakimMaliyetleri />
              </FormProvider>
            );
            break;
          default:
            break;
        }
      });
    };

    loadWidgets(itemsToLoad);

    if (!storedItems) {
      saveLayout();
    }

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

    // Update float property when reorganize state changes
    grid.engine.float = reorganize;
  }, [reorganize]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedWidgets({
      ...checkedWidgets,
      [name]: checked,
    });

    let gridItems = JSON.parse(localStorage.getItem("gridItems")) || [];
    let hiddenWidgets = JSON.parse(localStorage.getItem("hiddenWidgets")) || [];

    if (!checked) {
      const widgetIndex = gridItems.findIndex((item) => item.id === name);
      if (widgetIndex > -1) {
        const [removedWidget] = gridItems.splice(widgetIndex, 1);
        hiddenWidgets.push(removedWidget);
      }
    } else {
      const widgetIndex = hiddenWidgets.findIndex((item) => item.id === name);
      if (widgetIndex > -1) {
        const [restoredWidget] = hiddenWidgets.splice(widgetIndex, 1);
        gridItems.push(restoredWidget);
      }
    }

    gridItems = rearrangeWidgets(gridItems);

    localStorage.setItem("gridItems", JSON.stringify(gridItems));
    localStorage.setItem("hiddenWidgets", JSON.stringify(hiddenWidgets));

    window.updateWidgets(gridItems);
  };

  const rearrangeWidgets = (items) => {
    let grid = Array(12)
      .fill(0)
      .map(() => Array(12).fill(null));
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
    });

    return items;
  };

  const canPlaceWidget = (grid, x, y, width, height) => {
    if (x + width > 12 || y + height > 12) return false;
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (grid[j][i] !== null) return false;
      }
    }
    return true;
  };

  const placeWidget = (grid, x, y, width, height, id) => {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        grid[j][i] = id;
      }
    }
  };

  const handleReset = () => {
    localStorage.removeItem("gridItems");
    localStorage.removeItem("hiddenWidgets");
    localStorage.removeItem("reorganize");
    window.location.reload();
  };

  const handleRearrange = () => {
    const gridItems = JSON.parse(localStorage.getItem("gridItems")) || [];
    const rearrangedItems = rearrangeWidgets(gridItems);
    localStorage.setItem("gridItems", JSON.stringify(rearrangedItems));
    window.updateWidgets(rearrangedItems);
  };

  const rerenderWidgets = () => {
    const gridItems = JSON.parse(localStorage.getItem("gridItems")) || [];
    window.updateWidgets(gridItems);
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
      <Checkbox
        name="widget1"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget1}
      >
        Devam Eden İş Talepleri
      </Checkbox>
      <Checkbox
        name="widget2"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget2}
      >
        Açık İş Emirleri
      </Checkbox>
      <Checkbox
        name="widget3"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget3}
      >
        Düşük Stoklu Malzemeler
      </Checkbox>
      <Checkbox
        name="widget4"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget4}
      >
        Toplam Makine Sayısı
      </Checkbox>
      <Checkbox
        name="widget5"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget5}
      >
        Durum
      </Checkbox>
      <Checkbox
        name="widget6"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget6}
      >
        Lokasyon Bazında İş Talepleri ve İş Emirleri Dağılımı
      </Checkbox>
      <Checkbox
        name="widget7"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget7}
      >
        İş Emirleri Özet Tablosu
      </Checkbox>
      <Checkbox
        name="widget8"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget8}
      >
        Arızalı Makineler
      </Checkbox>
      <Checkbox
        name="widget9"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget9}
      >
        Makine Tiplerine Göre Envanter Dağılımı
      </Checkbox>
      <Checkbox
        name="widget10"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget10}
      >
        Tamamlanmış İş Talepleri ve İş Emirleri Oranları
      </Checkbox>{" "}
      <Checkbox
        name="widget11"
        onChange={handleCheckboxChange}
        checked={checkedWidgets.widget11}
      >
        Aylık Bakım Maliyetleri
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
          <Text style={{ fontWeight: "600", fontSize: "24px" }}>Dashboard</Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <Button
              type="text"
              // onClick={updateApiTriger}
              onClick={rerenderWidgets}
            >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  name="widget"
                >
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
        <div style={{ overflow: "scroll", height: "calc(100vh - 210px)" }}>
          <div className="grid-stack">
            <div className="grid-stack-item border-dark" id="widget1">
              <div className="grid-stack-item-content">
                <Component1 />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget2">
              <div className="grid-stack-item-content">
                <Component2 />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget3">
              <div className="grid-stack-item-content">
                <Component3 />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget4">
              <div className="grid-stack-item-content">
                <Component4 />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget5">
              <div className="grid-stack-item-content">
                <Component5 />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget6">
              <div className="grid-stack-item-content">
                <LokasyonBazindaIsTalepleri />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget7">
              <div className="grid-stack-item-content">
                <IsEmirleriOzetTablosu />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget8">
              <div className="grid-stack-item-content">
                <IsEmirleriOzetTablosu />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget9">
              <div className="grid-stack-item-content">
                <MakineTiplerineGore />
              </div>
            </div>
            <div className="grid-stack-item border-dark" id="widget10">
              <div className="grid-stack-item-content">
                <TamamlanmaOranlari />
              </div>
            </div>{" "}
            <div className="grid-stack-item border-dark" id="widget11">
              <div className="grid-stack-item-content">
                <AylikBakimMaliyetleri />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default MainDashboard;
