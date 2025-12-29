import React, { useState, useEffect } from "react";
import bg from "../../../../assets/images/bg-card.png";
import { Modal, Spin, Typography } from "antd";
import { FallOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function Component3() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Yeni API endpoint'in
      const response = await AxiosInstance.get("getAcikSiparisler");
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

  const handleModalClose = () => {
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
              {data?.ADET !== undefined ? data.ADET : "0"}
            </Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>
              Açık Siparişler
            </Text>
          </div>
          <FallOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
        </div>
      )}

      <Modal
        width={800} // Liste yoksa genişliği biraz daralttım, istersen 1400 yapabilirsin
        destroyOnClose
        centered
        title="Açık Sipariş Detayları"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Text>Açık siparişlerin detay listesi yakında eklenecektir.</Text>
        </div>
      </Modal>
    </div>
  );
}

export default Component3;