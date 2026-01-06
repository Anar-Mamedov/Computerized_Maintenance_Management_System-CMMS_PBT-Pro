import React, { useState, useEffect } from "react";
import bg from "../../../../assets/images/bg-card.png";
import { Modal, Spin, Typography } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function Component4() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Yeni API endpoint'in
      const response = await AxiosInstance.get("getToplamSiparisTutar");
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
    setModalVisible(true);
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
            <Text
              style={{ fontWeight: "500", fontSize: "30px", color: "white" }}
            >
              {/* API'den dönen TOPLAM_TUTAR verisini buraya bastım */}
              {data?.TOPLAM_TUTAR !== undefined ? `${data.TOPLAM_TUTAR} ₺` : "0 ₺"}
            </Text>
            <Text
              style={{ color: "white", fontSize: "15px", fontWeight: "400" }}
            >
              Toplam Sipariş Tutarı
            </Text>
          </div>
          <HistoryOutlined
            style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }}
          />
        </div>
      )}

      <Modal
        title="Sipariş Tutarı Detayları"
        width={800}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        centered
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Text>Toplam sipariş tutarına ait detaylar yakında eklenecektir.</Text>
        </div>
      </Modal>
    </div>
  );
}

export default Component4;