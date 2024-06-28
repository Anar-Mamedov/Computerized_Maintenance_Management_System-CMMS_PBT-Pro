import React, { useEffect } from "react";

import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import Component3 from "./components/Component3.jsx";
import Component2 from "./components/Component2.jsx";
import Component1 from "./components/Component1.jsx";
function Dashboard() {
  // _________________________________________________
  // Initialize Gridstack inside useEffect so that DOM is rendered when its initialized
  // _________________________________________________
  useEffect(() => {
    var grid = GridStack.init();
  });
  // _________________________________________________
  // _________________________________________________

  return (
    <div className="App">
      <div className="grid-stack">
        <div
          className="grid-stack-item border-dark"
          data-gs-width="4"
          data-gs-height="4"
        >
          <div className="grid-stack-item-content">
            <Component1 />
          </div>
        </div>
        <div
          className="grid-stack-item border-dark"
          data-gs-width="4"
          data-gs-height="4"
        >
          <div className="grid-stack-item-content">
            <Component2 />
          </div>
        </div>
        <div
          className="grid-stack-item border-dark"
          data-gs-width="4"
          data-gs-height="4"
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
