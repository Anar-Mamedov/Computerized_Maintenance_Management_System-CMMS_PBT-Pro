import React, { useState, useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import { Button, Checkbox, Popover, Typography, Switch, Tooltip, ConfigProvider } from "antd";
import { DownOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { createRoot } from "react-dom/client";
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
import Component7 from "./components/Component7.jsx";
import Component8 from "./components/Component8.jsx";
import IsEmriTable from "./components/Table/Table.jsx";
import AylikYakitTuketimleri from "./components/AylikYakitTuketimleri.jsx";
import LokasyonBazindaYakitTuketimleri from "./components/LokasyonBazindaYakitTuketimleri.jsx";
import BolgelereGoreToplamMiktarDagilimi from "./components/BolgelereGoreToplamMiktarDagilimi.jsx";
import AylikMaliyetler from "./components/AylikMaliyetler.jsx";
import AylikKM from "./components/AylikKM.jsx";
import ArizaliMakineler from "./components/ArizaliMakineler.jsx";

import AxiosInstance from "../../../api/http.jsx";
import dayjs from "dayjs"; // Tarih formatlama için ekledik kanka

const { Text } = Typography;

const widgetTitles = {
  widget1: "Toplam İş Emri",
  widget2: "Açık İş Emirleri",
  widget3: "Toplam İş Emri Maliyeti",
  widget4: "En Yavaş Müdahele Süresi",
  widget7: "Ortalama Çalışma Süresi",
  widget14: "İş Emri Özet Paneli",
  widget5: "Müdahele Süresi Histogramı",
  widget19: "Aylık Müdahele Süresi",
  widget6: "İş Talebi Tipleri / Atölyeler",
  widget18: "Personel Müdahele Süresi",
  widget11: "İş Emri Müdahele Süresi Tablosu",
  widget20: "2. İş Emirleri Maliyet ve Performans Analizi",
  widget21: "3. Makine Arıza ve Müdahale Öncelik Analizi",
  widget22: "4. Atölye Performans Karşılaştırması",
};

const defaultItems = [
  { id: "widget1", x: 0, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
  { id: "widget2", x: 2, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
  { id: "widget3", x: 4, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
  { id: "widget4", x: 6, y: 0, width: 2, height: 1, minW: 2, minH: 1 },
  { id: "widget7", x: 8, y: 0, width: 4, height: 1, minW: 2, minH: 1 },
  { id: "widget14", x: 0, y: 1, width: 12, height: 1, minW: 3, minH: 1 },
  { id: "widget5", x: 0, y: 2, width: 6, height: 3, minW: 3, minH: 2 },
  { id: "widget19", x: 6, y: 2, width: 6, height: 3, minW: 3, minH: 2 },
  { id: "widget6", x: 0, y: 5, width: 6, height: 4, minW: 3, minH: 2 },
  { id: "widget18", x: 6, y: 5, width: 6, height: 4, minW: 3, minH: 2 },
  { id: "widget11", x: 0, y: 9, width: 12, height: 3, minW: 3, minH: 2 },
  { id: "widget20", x: 0, y: 12, width: 12, height: 3, minW: 3, minH: 2 },
  { id: "widget21", x: 0, y: 15, width: 12, height: 3, minW: 3, minH: 2 },
  { id: "widget22", x: 0, y: 18, width: 12, height: 3, minW: 3, minH: 2 },
];

function MainDashboard() {
  const [reorganize, setReorganize] = useState();
  const [dashboardData, setDashboardData] = useState(null);
  const [breakdownType, setBreakdownType] = useState("Tip"); 
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page1, setPage1] = useState(1);
  const [pageSize1, setPageSize1] = useState(10);
  const [page2, setPage2] = useState(1);
  const [pageSize2, setPageSize2] = useState(10);
  const [page3, setPage3] = useState(1);
  const [pageSize3, setPageSize3] = useState(10);
  const [page4, setPage4] = useState(1);
  const [pageSize4, setPageSize4] = useState(10);

  const [kirilim4, setKirilim4] = useState(4); 

  const [checkedWidgets, setCheckedWidgets] = useState({
    widget1: false, widget2: false, widget3: false, widget4: false,
    widget5: false, widget6: false, widget7: false, widget11: false,
    widget14: false, widget18: false, widget19: false, widget20: false,
    widget21: false, widget22: false,
  });

  // TarihFilter bileşeni default olarak Son 3 Ayı buraya yazacak kanka
  const methods = useForm({
    defaultValues: {
      BaslangicTarihi: null,
      BitisTarihi: null,
      LokasyonIds: [],
      AtolyeIds: [],
      EkipmanIds: []
    },
  });

  const { watch } = methods;
  const selectedDashboard = "IsEmriAnaliz";
  const currentFilters = watch();

  // 1. Dashboard API İstek Mekanizması
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const payload = {
        BaslangicTarihi: currentFilters.BaslangicTarihi,
        BitisTarihi: currentFilters.BitisTarihi,
        LokasyonIds: currentFilters.LokasyonIds || [],
        AtolyeIds: currentFilters.AtolyeIds || [],
        EkipmanIds: currentFilters.EkipmanIds || [],
      };

      const response = await AxiosInstance.post("GetIsEmriAnalizDashboard", payload);
      setDashboardData(response?.data || null);
    } catch (error) {
      console.error("Dashboard API hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Listeler API İstek Mekanizması
  const fetchListData = async (targetTable = "all") => {
    setLoading(true);
    try {
      const payload = {
        BaslangicTarihi: currentFilters.BaslangicTarihi,
        BitisTarihi: currentFilters.BitisTarihi,
        LokasyonIds: currentFilters.LokasyonIds || [],
        AtolyeIds: currentFilters.AtolyeIds || [],
        EkipmanIds: currentFilters.EkipmanIds || [],
        Kirilim1: breakdownType, 
        Kirilim4: kirilim4
      };

      let activePage = page1;
      let activePageSize = pageSize1;

      if (targetTable === "table2") { activePage = page2; activePageSize = pageSize2; }
      else if (targetTable === "table3") { activePage = page3; activePageSize = pageSize3; }
      else if (targetTable === "table4") { activePage = page4; activePageSize = pageSize4; }

      const response = await AxiosInstance.post(
        `GetIsEmriAnalizListeler?page=${activePage}&pageSize=${activePageSize}`, 
        payload
      );

      // API'den gelen response.data.data yapısına sadık kalarak güvenli setleme yapıyoruz kanka
      const responseData = response?.data?.data || response?.data;

      if (targetTable === "all") {
        setListData(responseData || null);
      } else {
        setListData(prevData => ({
          ...prevData,
          ...(targetTable === "table1" && { 
            Liste1: responseData?.Liste1 || [], 
            Liste1TotalCount: responseData?.Liste1TotalCount || 0 
          }),
          ...(targetTable === "table2" && { 
            Liste2: responseData?.Liste2 || [], 
            Liste2TotalCount: responseData?.Liste2TotalCount || 0 
          }),
          ...(targetTable === "table3" && { 
            Liste3: responseData?.Liste3 || [], 
            Liste3TotalCount: responseData?.Liste3TotalCount || 0 
          }),
          ...(targetTable === "table4" && { 
            Liste4: responseData?.Liste4 || [], 
            Liste4TotalCount: responseData?.Liste4TotalCount || 0 
          }),
        }));
      }
    } catch (error) {
      console.error("Listeler API hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = () => {
    fetchDashboardData();
    fetchListData("all");
  };

  // KANKA KRİTİK DÜZELTME: Ekran ilk açıldığında TarihFilter'dan gelen default (Son 3 Ay) tarihlerini
  // yakalayıp API isteklerini otomatik olarak o tarihlerle tetikliyoruz.
  useEffect(() => {
    if (currentFilters.BaslangicTarihi && currentFilters.BitisTarihi) {
      handleQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilters.BaslangicTarihi, currentFilters.BitisTarihi]);

  // Sayfalama ve kırılım takipleri
  useEffect(() => {
    if (listData) fetchListData("table1");
  }, [page1, pageSize1]);

  useEffect(() => {
    if (listData) fetchListData("table2");
  }, [page2, pageSize2]);

  useEffect(() => {
    if (listData) fetchListData("table3");
  }, [page3, pageSize3]);

  useEffect(() => {
    if (listData) fetchListData("table4");
  }, [page4, pageSize4]);

  useEffect(() => {
    setPage1(1); setPage2(1); setPage3(1); setPage4(1);
    if (currentFilters.BaslangicTarihi && currentFilters.BitisTarihi) {
      fetchListData("all");
    }
  }, [breakdownType]);

  useEffect(() => {
    if (dashboardData) {
      const storedItems = JSON.parse(localStorage.getItem(selectedDashboard)) || defaultItems;
      if (window.updateWidgets) {
        window.updateWidgets(storedItems);
      }
    }
  }, [dashboardData]);

  useEffect(() => {
    const reorganizeValue = localStorage.getItem("reorganizeMudaheleSuresiAnalizi");
    if (reorganizeValue !== null) {
      setReorganize(reorganizeValue === "true");
    } else {
      setReorganize(false);
      localStorage.setItem("reorganizeMudaheleSuresiAnalizi", "false");
    }
  }, []);

  const onChange = (checked) => {
    if (checked) {
      setReorganize(false);
      localStorage.setItem("reorganizeMudaheleSuresiAnalizi", "false");
    } else {
      setReorganize(true);
      localStorage.setItem("reorganizeMudaheleSuresiAnalizi", "true");
    }
    setTimeout(() => {
      const gridItems = JSON.parse(localStorage.getItem(selectedDashboard)) || [];
      window.updateWidgets(gridItems);
    }, 50);
  };

  useEffect(() => {
    if (reorganize === undefined) return;

    const grid = GridStack.init({
      float: reorganize,
      resizable: { handles: "se, sw" },
      column: 12,
      margin: 10,
      minRow: 1,
      cellHeight: "auto",
      draggable: { handle: ".widget-header" },
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
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component1
                          apiData={dashboardData ? dashboardData.ToplamIsEmri : null}
                          loading={loading}
                        />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget2":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component2
                          apiData={dashboardData ? dashboardData.AcikIsEmirleri : null}
                          loading={loading}
                        />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget3":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component3
                          apiData={dashboardData ? dashboardData.ToplamMaliyet : null}
                          loading={loading}
                        />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget4":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component4
                          apiData={dashboardData ? dashboardData.OrtalamaKapanisSuresiGun : null}
                          loading={loading}
                        />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget7":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component5
                          apiData={dashboardData ? dashboardData.GecikenIsEmirleri : null}
                          loading={loading}
                        />
                      </BrowserRouter>
                    </AppProvider>
                  </ConfigProvider>
                </I18nextProvider>
              </FormProvider>
            );
            break;
          case "widget5":
            root.render(
              <FormProvider {...methods}>
                <I18nextProvider i18n={i18n}>
                  <ConfigProvider locale={trTR}>
                    <AppProvider>
                      <BrowserRouter>
                        <Component7
                          tipDagilimi={dashboardData ? dashboardData.TipDagilimi : null}
                          durumDagilimi={dashboardData ? dashboardData.DurumDagilimi : null} 
                          loading={loading}
                        />
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
                        <Component8
                          atolyeDagilimi={dashboardData ? dashboardData.AtolyeDagilimi : null} 
                          loading={loading}
                        />
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
                        <IsEmriTable
                  listeData={
                    listData 
                      ? (breakdownType === "Tip" || breakdownType === 1 ? listData.Liste1 : listData.Liste2) 
                      : null
                  } 
                  loading={loading}
                  breakdownType={breakdownType}
                  onBreakdownTypeChange={(val) => setBreakdownType(val)}
                  onRefresh={() => fetchListData("table1")}
                  page={page1}
                  pageSize={pageSize1}
                  totalItems={
                    listData 
                      ? (breakdownType === "Tip" || breakdownType === 1 ? listData.Liste1TotalCount : listData.Liste2TotalCount) 
                      : 0
                  } 
                  onPageChange={(p, ps) => {
                    setPage1(p);
                    setPageSize1(ps);
                  }}
                />
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
                        <BolgelereGoreToplamMiktarDagilimi
                          personelVerimliligiSaat={dashboardData ? dashboardData.PersonelVerimliligiSaat : null}
                          planlananBakimaUyumYuzde={dashboardData ? dashboardData.PlanlananBakimaUyumYuzde : null}
                          enYuksekMaliyetliIsEmriAd={dashboardData ? dashboardData.EnYuksekMaliyetliIsEmriAd : null}
                          enYuksekMaliyetliTutar={dashboardData ? dashboardData.EnYuksekMaliyetliTutar : null}
                          enUzunSurenIsEmriAd={dashboardData ? dashboardData.EnUzunSurenIsEmriAd : null}
                          loading={loading}
                        />
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
                        <LokasyonBazindaYakitTuketimleri
                          aylikTrendler={dashboardData ? dashboardData.AylikTrendler : null} 
                          loading={loading}
                        />
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
                        <AylikYakitTuketimleri
                          aylikTrendler={dashboardData ? dashboardData.AylikTrendler : null} 
                          loading={loading}
                        />
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
                        <ArizaliMakineler
                  listeData={listData ? listData.Liste2 : null} 
                  loading={loading}
                  page={page2}
                  pageSize={pageSize2}
                  // Kanka Liste2TotalCount (7) direkt buraya basılıyor, asla 10 sayfa görünmez
                  totalItems={listData ? listData.Liste2TotalCount : 0} 
                  onPageChange={(p, ps) => {
                    setPage2(p);
                    setPageSize2(ps);
                  }}
                />
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
                        <AylikKM
                  listeData={listData ? listData.Liste3 : null} 
                  loading={loading}
                  page={page3}
                  pageSize={pageSize3}
                  // Liste3TotalCount (714) kayıt olduğu için burası otomatik 72 sayfa çizecek temizce
                  totalItems={listData ? listData.Liste3TotalCount : 0} 
                  onPageChange={(p, ps) => {
                    setPage3(p);
                    setPageSize3(ps);
                  }}
                />
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
                        <AylikMaliyetler
                  listeData={listData ? listData.Liste4 : null} 
                  loading={loading}
                  breakdownType={breakdownType}
                  onBreakdownTypeChange={(val) => setBreakdownType(val)}
                  onRefresh={() => fetchListData("table4")}
                  page={page4}
                  pageSize={pageSize4}
                  // Liste4TotalCount (11) kayıt olduğu için burası da tamı tamına 2 sayfa görünecek kanka
                  totalItems={listData ? listData.Liste4TotalCount : 0} 
                  onPageChange={(p, ps) => {
                    setPage4(p);
                    setPageSize4(ps);
                  }}
                />
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
        widget1: false, widget2: false, widget3: false, widget4: false,
        widget5: false, widget6: false, widget7: false, widget11: false,
        widget14: false, widget18: false, widget19: false, widget20: false,
        widget21: false, widget22: false,
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
        widget1: false, widget2: false, widget3: false, widget4: false,
        widget5: false, widget6: false, widget7: false, widget11: false,
        widget14: false, widget18: false, widget19: false, widget20: false,
        widget21: false, widget22: false,
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
  }, [reorganize, selectedDashboard, dashboardData, listData, loading, breakdownType, page1, pageSize1, page2, pageSize2, page3, pageSize3, page4, pageSize4]);

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
    localStorage.removeItem("reorganizeIsEmriAnaliz");
    window.location.reload();
  };

  const handleRearrange = () => {
    const gridItems = JSON.parse(localStorage.getItem(selectedDashboard)) || [];
    const rearrangedItems = rearrangeWidgets(gridItems);
    localStorage.setItem(selectedDashboard, JSON.stringify(rearrangedItems));
    window.updateWidgets(rearrangedItems);
  };

  // Dinamik Tarih Metni Oluşturma Alanı kanka
  const renderDateText = () => {
    if (currentFilters.BaslangicTarihi && currentFilters.BitisTarihi) {
      const start = dayjs(currentFilters.BaslangicTarihi).format("DD.MM.YYYY");
      const end = dayjs(currentFilters.BitisTarihi).format("DD.MM.YYYY");
      return `(${start} - ${end})`;
    }
    return "";
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "610px", overflowY: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
        <Switch checked={!reorganize} onChange={onChange} />
        <Tooltip title="Bu aktive edilirse widgetlar otomatik olarak boşlukları doldurur">
          <Text>
            Boşlukları Doldur <QuestionCircleOutlined />
          </Text>
        </Tooltip>
      </div>
      <Checkbox name="widget1" onChange={handleCheckboxChange} checked={checkedWidgets.widget1}>Toplam Talep Sayısı</Checkbox>
      <Checkbox name="widget2" onChange={handleCheckboxChange} checked={checkedWidgets.widget2}>Ortalama Müdahele Süresi</Checkbox>
      <Checkbox name="widget3" onChange={handleCheckboxChange} checked={checkedWidgets.widget3}>En Hızlı Müdahele Süresi</Checkbox>
      <Checkbox name="widget4" onChange={handleCheckboxChange} checked={checkedWidgets.widget4}>En Yavaş Müdahele Süresi</Checkbox>
      <Checkbox name="widget7" onChange={handleCheckboxChange} checked={checkedWidgets.widget7}>Ortalama Çalışma Süresi</Checkbox>
      <Checkbox name="widget5" onChange={handleCheckboxChange} checked={checkedWidgets.widget5}>Müdahele Süresi Histogramı</Checkbox>
      <Checkbox name="widget6" onChange={handleCheckboxChange} checked={checkedWidgets.widget6}>İş Talebi Tipleri / Atölyeler</Checkbox>
      <Checkbox name="widget11" onChange={handleCheckboxChange} checked={checkedWidgets.widget11}>İş Emri Müdahele Süresi Tablosu</Checkbox>
      <Checkbox name="widget14" onChange={handleCheckboxChange} checked={checkedWidgets.widget14}>İş Emri Özet Paneli</Checkbox>
      <Checkbox name="widget18" onChange={handleCheckboxChange} checked={checkedWidgets.widget18}>Personel Müdahele Süresi</Checkbox>
      <Checkbox name="widget19" onChange={handleCheckboxChange} checked={checkedWidgets.widget19}>Aylık Müdahele Süresi</Checkbox>
      <Checkbox name="widget20" onChange={handleCheckboxChange} checked={checkedWidgets.widget20}>2. İş Emirleri Maliyet ve Performans Analizi</Checkbox>
      <Checkbox name="widget21" onChange={handleCheckboxChange} checked={checkedWidgets.widget21}>3. Makine Arıza ve Müdahale Öncelik Analizi</Checkbox>
      <Checkbox name="widget22" onChange={handleCheckboxChange} checked={checkedWidgets.widget22}>4. Atölye Performans Karşılaştırması</Checkbox>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button danger onClick={handleReset}>Widgetları Sıfırla</Button>
      </div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={trTR}>
        <div className="App">
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
              <Filters />
              
              {/* Tarih metnini ve sorgula butonunu yan yana alan sarmalayıcı */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Button type="primary" onClick={handleQuery}>
                  <ReloadOutlined />
                  Sorgula
                </Button>
                {renderDateText() && (
                  <Text type="secondary" style={{ fontSize: "12px", fontWeight: "500" }}>
                    {renderDateText()}
                  </Text>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: "10px" }}>
              <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }} onClick={handleRearrange}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1zm-1 7.5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zM5 17a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm5.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm6.5 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1zm-5.5-7.5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1zm-7.5 1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1zM10.5 5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V5zM5 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd"></path>
                </svg>
                Yeniden Sırala
              </Button>
              <Popover content={content} title="Widgetları Yönet" trigger="click">
                <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" name="widget">
                    <path fillRule="evenodd" d="M17.5 2a1 1 0 01.894.553l3.5 7A1 1 0 0121 11h-7a1 1 0 01-.894-1.447l3.5-7A1 1 0 0117.5 2zm-1.882 7h3.764L17.5 5.236 15.618 9zM4 13a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H4zm0 7v-5h5v5H4zm13.5-7a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM15 17.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM6.5 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM4 6.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" clipRule="evenodd"></path>
                  </svg>
                  Widgetleri Yönet
                  <DownOutlined style={{ marginLeft: "2px" }} />
                </Button>
              </Popover>
            </div>
          </div>
          <div style={{ overflow: "auto", height: "calc(100vh - 220px)" }}>
            <div className="grid-stack"></div>
          </div>
        </div>
      </ConfigProvider>
    </FormProvider>
  );
}

export default MainDashboard;