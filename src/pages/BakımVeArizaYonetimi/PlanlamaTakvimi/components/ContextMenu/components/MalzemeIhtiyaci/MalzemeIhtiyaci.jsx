import React from "react";
import { Button } from "antd";

function MalzemeIhtiyaci({ selectedCells }) {
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
        Malzeme İhtiyacı
      </Button>
    </div>
  );
}

export default MalzemeIhtiyaci;
