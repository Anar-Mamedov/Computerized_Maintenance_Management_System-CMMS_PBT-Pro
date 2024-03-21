import React, { useState, useEffect, useMemo } from "react";
import "./dashboard.css";
import TamamlanmisOranlar from "./Grafikler/TamamlanmisIsOranlari/TamamlanmisOranlar";
import DashboardStatisticCards from "./DashboardStatisticCards/DashboardStatisticCards";
import Filter from "./Fillter/Filter";
import LokasyonDagilimTable from "./Grafikler/LokasyonDagilimTable/LokasyonDagilimTable";
import IsEmriOzetTablo from "./Grafikler/IsEmriOzetTable/IsEmriOzetTablo";
import PersonelIsGucu from "./Grafikler/PersonelIsGucu/PersonelIsGucu";
import ArizaliMakinelerTablo from "./Grafikler/ArizaliMakineler/ArizaliMakineler";
import AylikBakimMaliyeti from "./Grafikler/AylikBakimMaliyeti/AylikBakimMaliyeti";
import MakineTipEnvanter from "./Grafikler/MakineTipEnvanter/MakineTipEnvanter";
import ToplamHarcananIsGucu from "./Grafikler/ToplamHarcananIsGucu/ToplamHarcananIsGucu";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import IsEmirlerininZamanDagilimi from "./Grafikler/IsEmirlerininZamanDagilimi/IsEmirlerininZamanDagilimi";
import GrupIsEmir from "./Grafikler/emir_gruplama/GrupIsEmir";
import GrupIsTaleb from "./Grafikler/taleb_gruplama/GrupTaleb";
import { DateProvider } from "../DateContext";
import { PersonelProvider } from "./Grafikler/PersonelIsGucu/PersonelContext";

const plainOptions = [
  "İş Emri Tipi Grafiği",
  "İş Talebi Tipi Grafiği",
  "Tamamlanmış İş talepleri ve İş Emirleri Oranları",
  "Aylık Bakım Maliyetleri",
  "Personel Bazında Harcanan İş Gücü",
  "Bakım İşlemlerinin Zaman İçerisinde Dağılımı",
  "Toplam Harcanan İş Gücü",
  "Lokasyon Bazında İş talepleri / İş Emirleri Dağılımı",
  "İş Emirleri Özet Tablosu",
  "Arızalı Makineler",
  "Makine Tiplerine Göre Envanter Dağılımı",
];

const components = [
  {
    id: 1,
    key: "İş Emri Tipi Grafiği",
    component: <GrupIsEmir />,
    location: {
      // w: 4, h: 4, x: (0 % 3) * 4, y: Math.floor(0 / 3) * 4
    },
  },
  {
    id: 2,
    key: "İş Talebi Tipi Grafiği",
    component: <GrupIsTaleb />,
    location: {
      // w: 4, h: 4, x: (1 % 3) * 4, y: Math.floor(1 / 3) * 4
    },
  },
  {
    id: 3,
    key: "Tamamlanmış İş talepleri ve İş Emirleri Oranları",
    component: <TamamlanmisOranlar />,
    location: {
      // w: 4, h: 4, x: (2 % 3) * 4, y: Math.floor(2 / 3) * 4
    },
  },
  {
    id: 4,
    key: "Aylık Bakım Maliyetleri",
    component: <AylikBakimMaliyeti />,
    location: {
      // w: 4, h: 4, x: (3 % 3) * 4, y: Math.floor(3 / 3) * 4
    },
  },
  {
    id: 5,
    key: "Personel Bazında Harcanan İş Gücü",
    component: <PersonelIsGucu />,
    location: {
      // w: 4, h: 4, x: (4 % 3) * 4, y: Math.floor(4 / 3) * 4
    },
  },
  {
    id: 6,
    key: "Toplam Harcanan İş Gücü",
    component: <ToplamHarcananIsGucu />,
    location: {
      // w: 4, h: 4, x: (5 % 3) * 4, y: Math.floor(5 / 3) * 4
    },
  },
  {
    id: 7,
    key: "Bakım İşlemlerinin Zaman İçerisinde Dağılımı",
    component: <IsEmirlerininZamanDagilimi />,
    location: {
      // w: 4, h: 4, x: (6 % 3) * 4, y: Math.floor(6 / 3) * 4
    },
  },
  {
    id: 8,
    key: "Lokasyon Bazında İş talepleri / İş Emirleri Dağılımı",
    component: <LokasyonDagilimTable />,
    location: {
      // w: 4, h: 4, x: (7 % 3) * 4, y: Math.floor(7 / 3) * 4
    },
  },
  {
    id: 9,
    key: "Makine Tiplerine Göre Envanter Dağılımı",
    component: <MakineTipEnvanter />,
    location: {
      // w: 4, h: 4, x: (8 % 3) * 4, y: Math.floor(8 / 3) * 4
    },
  },
  {
    id: 10,
    key: "İş Emirleri Özet Tablosu",
    component: <IsEmriOzetTablo />,
    location: {
      // w: 4, h: 4, x: (9 % 3) * 4, y: Math.floor(9 / 3) * 4
    },
  },
  {
    id: 11,
    key: "Arızalı Makineler",
    component: <ArizaliMakinelerTablo />,
    location: {
      // w: 4, h: 4, x: (10 % 3) * 4, y: Math.floor(10 / 3) * 4
    },
  },
];

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [filteredGraphs, setFilteredGraphs] = useState(plainOptions);
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [componentLayout, setComponentLayout] = useState([]);

  useEffect(() => {
    const container = document.getElementById("chart-container");

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const savedGraphs = localStorage.getItem("filteredGraphs");

    if (!savedGraphs) {
      localStorage.setItem("filteredGraphs", JSON.stringify(filteredGraphs));
    }
  }, []);

  const memoizedFilteredGraphs = useMemo(() => filteredGraphs, [filteredGraphs]);

  useEffect(() => {
    // Load layout from local storage on component mount
    const savedLayout = localStorage.getItem("componentLayout");
    const savedGraphs = localStorage.getItem("filteredGraphs");
    setFilteredGraphs(JSON.parse(savedGraphs));

    if (savedLayout && savedGraphs) {
      const parsedLayout = JSON.parse(savedLayout);
      const newLayout = JSON.parse(savedGraphs).map((graphKey, index) => {
        const itemLayout = parsedLayout.find((item) => item.i === graphKey);
        if (itemLayout) {
          return {
            ...itemLayout,
          };
        } else {
          return {
            i: graphKey,
            x: (index % 4) * 3,
            y: Math.floor(index / 3) * 4,
            w: 3,
            h: 3,
          };
        }
      });
      setComponentLayout(newLayout);
      localStorage.setItem("componentLayout", JSON.stringify(newLayout));
    } else {
      // If layout data is not found in local storage, generate initial layout
      const initialLayout = memoizedFilteredGraphs.map((graphKey, index) => ({
        i: graphKey,
        x: (index % 4) * 3,
        y: Math.floor(index / 3) * 4,
        w: 3,
        h: 3,
      }));
      setComponentLayout(initialLayout);
    }
  }, []); // Add filteredGraphs to the dependency array

  const updateFilters = (selectedGraphs) => {
    setFilteredGraphs(selectedGraphs);
    // Save filtered graphs to local storage
    localStorage.setItem("filteredGraphs", JSON.stringify(selectedGraphs));

    const savedGraphs = JSON.parse(localStorage.getItem("filteredGraphs"));

    const newLayout = savedGraphs.map((graphKey, index) => {
      const itemLayout = componentLayout.find((item) => item.i === graphKey);
      if (itemLayout) {
        return {
          ...itemLayout,
        };
      } else {
        return {
          i: graphKey,
          x: (index % 4) * 3,
          y: Math.floor(index / 3) * 4,
          w: 3,
          h: 3,
        };
      }
    });
    localStorage.setItem("componentLayout", JSON.stringify(newLayout));
    setComponentLayout(newLayout);
  };

  const handleLayoutChange = (layout) => {
    // Save layout to local storage whenever it changes
    localStorage.setItem("componentLayout", JSON.stringify(layout));
    setComponentLayout(layout);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
  };

  const maxHeight = `calc(100vh - 210px)`;

  return (
    <div style={{ maxHeight: maxHeight, overflow: "auto" }}>
      <PersonelProvider>
        <DateProvider>
          <div id="chart-container" style={{ padding: mobileView ? "24px 0px" : 0 }}>
            <DashboardStatisticCards />
            <Filter
              onUpdateFilters={updateFilters}
              setFilteredGraphs={setFilteredGraphs}
              setComponentLayout={setComponentLayout}
            />
            <ResponsiveGridLayout
              className="layout"
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
              isDraggable={!isDragging}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
              onLayoutChange={handleLayoutChange} // Add this line to handle layout change
              layout={componentLayout} // Pass layout state to set initial layout
            >
              {memoizedFilteredGraphs.map((graphKey, index) => {
                const itemLayout = componentLayout.find((item) => item.i === graphKey);
                if (!itemLayout) return null; // Skip rendering if layout data is missing
                const { w, h, x, y } = itemLayout;
                return (
                  <div
                    key={graphKey}
                    className="chart resizable-graph"
                    data-grid={{ w, h, x, y }}
                    onClick={handleClick}>
                    {React.cloneElement(components.find((component) => component.key === graphKey).component, {
                      containerSize,
                    })}
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          </div>
        </DateProvider>
      </PersonelProvider>
    </div>
  );
};

export default Dashboard;
