import React, { useState, useEffect } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Spin, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

function Component2(props) {
  const { watch } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const dashboardData = watch("dashboardData");

  useEffect(() => {
    // dashboardData nesnesi her değiştiğinde isLoading durumunu güncelle
    if (dashboardData?.ACIK_IS_EMIRLERI) {
      setIsLoading(false);
    }
  }, [dashboardData]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "#fff" }} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text
              style={{ fontWeight: "500", fontSize: "35px", color: "white" }}
            >
              {dashboardData?.ACIK_IS_EMIRLERI}
            </Text>
            <Text
              style={{ color: "white", fontSize: "15px", fontWeight: "400" }}
            >
              Açık İş Emirleri
            </Text>
          </div>
          <ClockCircleOutlined
            style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }}
          />
        </div>
      )}
    </div>
  );
}

export default Component2;
