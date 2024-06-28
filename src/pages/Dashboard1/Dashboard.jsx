import React, { useState, useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import { Modal, Button, Checkbox } from "antd";
import Component3 from "./components/Component3.jsx";
import Component2 from "./components/Component2.jsx";
import Component1 from "./components/Component1.jsx";
import { createRoot } from "react-dom/client";

function Dashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedWidgets, setCheckedWidgets] = useState({
    widget1: false,
    widget2: false,
    widget3: false,
  });

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

    if (!localStorage.getItem("hiddenWidgets")) {
      localStorage.setItem("hiddenWidgets", JSON.stringify([]));
    }

    const checked = {
      widget1: false,
      widget2: false,
      widget3: false,
    };
    itemsToLoad.forEach((item) => {
      if (checked.hasOwnProperty(item.id)) {
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
      };
      newGridItems.forEach((item) => {
        if (newChecked.hasOwnProperty(item.id)) {
          newChecked[item.id] = true;
        }
      });
      setCheckedWidgets(newChecked);
      loadWidgets(newGridItems);
    };

    window.updateWidgets = updateWidgets;
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
    window.location.reload();
  };

  return (
    <div
      className="App"
      style={{ overflow: "scroll", height: "calc(100vh - 170px)" }}
    >
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Widget List"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Checkbox
          name="widget1"
          onChange={handleCheckboxChange}
          checked={checkedWidgets.widget1}
        >
          Widget 1
        </Checkbox>
        <br />
        <Checkbox
          name="widget2"
          onChange={handleCheckboxChange}
          checked={checkedWidgets.widget2}
        >
          Widget 2
        </Checkbox>
        <br />
        <Checkbox
          name="widget3"
          onChange={handleCheckboxChange}
          checked={checkedWidgets.widget3}
        >
          Widget 3
        </Checkbox>
        <br />
        <Button type="danger" onClick={handleReset}>
          Reset Layout
        </Button>
      </Modal>
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
