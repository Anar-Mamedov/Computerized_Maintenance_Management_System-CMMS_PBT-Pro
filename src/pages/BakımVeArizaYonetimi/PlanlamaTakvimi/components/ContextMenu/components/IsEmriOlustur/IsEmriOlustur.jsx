import React from "react";
import { Button } from "antd";

function IsEmriOlustur({ selectedCells }) {
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
        İş Emri Oluştur
      </Button>
    </div>
  );
}

export default IsEmriOlustur;
