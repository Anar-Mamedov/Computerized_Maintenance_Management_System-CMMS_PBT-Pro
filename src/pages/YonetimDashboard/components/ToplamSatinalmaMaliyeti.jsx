import React from "react";
import bg from "../../../assets/images/bg-card.png";
import { Typography, Spin } from "antd";
import { useFormContext, useWatch } from "react-hook-form";

const { Text } = Typography;

function ToplamSatinalmaMaliyeti() {
  const { control } = useFormContext();
  const summaryData = useWatch({ control, name: "summaryData" });
  const paraBirimi = useWatch({ control, name: "paraBirimi" });

  return (
    <div style={{ width: "100%", height: "100%", background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`, backgroundSize: "cover", borderRadius: "5px", padding: "15px" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", marginBottom: "5px" }}>Toplam Satınalma Maliyeti</Text>
        {!summaryData ? (
          <Spin size="small" style={{ alignSelf: "flex-start", margin: "5px 0" }} />
        ) : (
          <Text style={{ fontWeight: "600", fontSize: "24px", color: "white", lineHeight: "1.2" }}>
            {paraBirimi?.Symbol || "TL"} {summaryData.ToplamSatinalmaMaliyeti ? summaryData.ToplamSatinalmaMaliyeti.toLocaleString("tr-TR", { minimumFractionDigits: 2 }) : "0,00"}
          </Text>
        )}
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "8px" }}>Dönem toplam satınalma harcaması</Text>
      </div>
    </div>
  );
}

export default ToplamSatinalmaMaliyeti;
