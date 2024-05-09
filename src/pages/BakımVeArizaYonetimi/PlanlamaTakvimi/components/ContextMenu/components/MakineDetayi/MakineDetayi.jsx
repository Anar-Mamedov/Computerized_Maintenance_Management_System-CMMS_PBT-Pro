import React from "react";
import { Button } from "antd";

function MakineDetayi({ selectedCells }) {
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
        type="success"
        onClick={handleModalToggle}
      >
        Makine Detayı
      </Button>
    </div>
  );
}

export default MakineDetayi;
