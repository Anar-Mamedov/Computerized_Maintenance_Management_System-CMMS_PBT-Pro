import React, { useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import Component3 from "./components/Component3.jsx";
import Component2 from "./components/Component2.jsx";
import Component1 from "./components/Component1.jsx";

let grid = GridStack;

function Dashboard() {
  // _________________________________________________
  // Initialize Gridstack inside useEffect so that DOM is rendered when its initialized
  // _________________________________________________
  useEffect(() => {
    grid = GridStack.init({ float: true });
  }, []);
  // _________________________________________________
  // _________________________________________________

  return (
    <div
      className="App"
      style={{ overflow: "scroll", height: "calc(100vh - 170px)" }}
    >
      <div className="grid-stack">
        <div
          className="grid-stack-item border-dark"
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
