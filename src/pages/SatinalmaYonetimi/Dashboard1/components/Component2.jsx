import React, { useState, useEffect } from "react";
import bg from "../../../../assets/images/bg-card.png";
import { Modal, Spin, Typography } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function Component2(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Kanka burayı senin yeni verdiğin API ismine göre güncelledim
      const response = await AxiosInstance.get("getBekleyenFiyatTeklifleri");
      setData(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `url(${bg}), linear-gradient(#ff7e29, #ffad42)`,
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
          onClick={showModal}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontWeight: "500", fontSize: "35px", color: "white" }}>
              {/* API'den dönen ADET alanını buraya bastım */}
              {data?.ADET !== undefined ? data.ADET : "0"}
            </Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>
              Bekleyen Fiyat Teklifleri
            </Text>
          </div>
          <FormOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
        </div>
      )}
    </div>
  );
}

export default Component2;