import React from "react";
import { Button } from "antd";

function PeryodikBakimDetayi({ selectedCells }) {
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
        Periyodik Bakım Detayı
      </Button>
    </div>
  );
}

export default PeryodikBakimDetayi;
