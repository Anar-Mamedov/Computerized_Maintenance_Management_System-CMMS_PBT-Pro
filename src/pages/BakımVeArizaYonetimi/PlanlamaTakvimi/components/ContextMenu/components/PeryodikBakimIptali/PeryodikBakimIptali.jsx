import React from "react";
import { Button } from "antd";

function PeryodikBakimIptali({ selectedCells }) {
  const handleModalToggle = () => {
    console.log(selectedCells);
  };
  return (
    <div>
      <Button
        style={{
          display: "flex",
          padding: "0px 0px",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        type="link"
        danger
        onClick={handleModalToggle}
      >
        Periyodik Bakım İptali
      </Button>
    </div>
  );
}

export default PeryodikBakimIptali;
