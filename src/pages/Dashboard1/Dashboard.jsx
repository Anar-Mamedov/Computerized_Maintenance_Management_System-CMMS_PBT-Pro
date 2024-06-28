import React, { useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import Component3 from "./components/Component3.jsx";
import Component2 from "./components/Component2.jsx";
import Component1 from "./components/Component1.jsx";
import { createRoot } from "react-dom/client";

function Dashboard() {
  useEffect(() => {
    const grid = GridStack.init({ float: true, resizable: true });

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
      { id: "widget1", x: 0, y: 0, width: 6, height: 4, minW: 4, minH: 4 },
      { id: "widget2", x: 6, y: 0, width: 4, height: 2, minW: 4, minH: 2 },
      { id: "widget3", x: 6, y: 2, width: 4, height: 2, minW: 4, minH: 2 },
    ];

    const itemsToLoad = storedItems?.length > 0 ? storedItems : defaultItems;

    grid.removeAll();
    itemsToLoad.forEach((item) => {
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
          root.render(<Component1 />);
          break;
        case "widget2":
          root.render(<Component2 />);
          break;
        case "widget3":
          root.render(<Component3 />);
          break;
        default:
          break;
      }
    });

    if (!storedItems) {
      saveLayout(); // Default düzeni localStorage'a kaydet
    }
  }, []);

  return (
    <div
      className="App"
      style={{ overflow: "scroll", height: "calc(100vh - 170px)" }}
    >
      <div className="grid-stack">
        <div
          className="grid-stack-item border-dark"
          id="widget1"
          gs-w="6"
          gs-h="4"
          gs-min-w="4"
          gs-min-h="4"
        >
          <div className="grid-stack-item-content">
            <Component1 />
          </div>
        </div>
        <div
          className="grid-stack-item border-dark"
          id="widget2"
          gs-w="4"
          gs-h="2"
          gs-min-w="4"
          gs-min-h="2"
        >
          <div className="grid-stack-item-content">
            <Component2 />
          </div>
        </div>
        <div
          className="grid-stack-item border-dark"
          id="widget3"
          gs-w="4"
          gs-h="2"
          gs-min-w="4"
          gs-min-h="2"
        >
          <div className="grid-stack-item-content">
            <Component3 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
