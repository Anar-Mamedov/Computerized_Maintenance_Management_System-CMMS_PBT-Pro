import React, { useState, useEffect } from "react";
import bg from "../../../../assets/images/bg-card.png";
import { Modal, Spin, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

const DEFAULT_STATUS_FILTER = [0, 1];

function Component6({ updateApi }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Kanka burayı senin yeni verdiğin API ismine göre güncelledim
      const response = await AxiosInstance.get("getBekleyenMalzemeTalepleri");
      setData(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
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
          <Spin size="large" style={{ color: "#fff" }}></Spin>
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
              {/* Kanka API'den dönen veri ADET olduğu için burayı data.ADET yaptım */}
              {data?.ADET !== undefined ? data.ADET : "0"}
            </Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>
              Bekleyen Malzeme Talepleri
            </Text>
          </div>
          <ClockCircleOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
        </div>
      )}
    </div>
  );
}

export default Component6;