import React from "react";
import { Button, Typography } from "antd";
import { ToolOutlined } from "@ant-design/icons";

const { Text } = Typography;

function BakimVeArizaRaporlari(props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <Text strong style={{ fontSize: "18px" }}>
        <ToolOutlined /> Bakım ve Arıza Raporları
      </Text>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          type="text"
          style={{
            display: "flex",
            borderTop: "1px solid #8080803d",
            borderRadius: "0",
            paddingTop: "10px",
            paddingBottom: "10px",
            width: "100%",
            height: "100%",
          }}
        >
          İş Emirleri Raporu
        </Button>
        <Button
          type="text"
          style={{
            display: "flex",
            borderTop: "1px solid #8080803d",
            borderRadius: "0",
            paddingTop: "10px",
            paddingBottom: "10px",
            width: "100%",
            height: "100%",
          }}
        >
          İş Emirleri Maliyet Raporu
        </Button>
        <Button
          type="text"
          style={{
            display: "flex",
            borderTop: "1px solid #8080803d",
            borderBottom: "1px solid #8080803d",
            borderRadius: "0",
            paddingTop: "10px",
            paddingBottom: "10px",
            width: "100%",
            height: "100%",
          }}
        >
          İş Malzeme Kullanımları Raporu
        </Button>
      </div>
    </div>
  );
}

export default BakimVeArizaRaporlari;
