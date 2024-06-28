import React, { useState } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

function Component3(props) {
  const [size, setSize] = useState({ width: 500, height: 370 });

  const onResize = (e, { size }) => {
    setSize(size);
  };

  const handleStyle = {
    position: "absolute",
    width: "20px",
    height: "20px",
    bottom: 0,
    right: 0,
    backgroundColor: "#666",
    cursor: "se-resize",
    zIndex: 10,
  };

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={onResize}
      minConstraints={[300, 200]}
      handle={
        <span
          className="react-resizable-handle"
          style={handleStyle}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
        />
      }
    >
      <div
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          backgroundColor: "orange",
          position: "relative",
        }}
      >
        Anar3
      </div>
    </Resizable>
  );
}

export default Component3;
