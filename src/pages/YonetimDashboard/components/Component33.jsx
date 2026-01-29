import React, { useState } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons"; // Aktif/Çalışıyor ikonu
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";

const { Text } = Typography;

function Component1({ updateApi }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        padding: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          height: "100%",
        }}
        onClick={showModal}
      >
        {/* SOL TARAFTAKİ METİNLER */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Text
            style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", marginBottom: "5px" }}
          >
            Aktif
          </Text>
          
          <Text
            style={{ fontWeight: "600", fontSize: "32px", color: "white", lineHeight: "1.2" }}
          >
            2
          </Text>

          <Text
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "8px" }}
          >
            Çalışır durumda
          </Text>
        </div>

        {/* SAĞ TARAFTAKİ İKON */}
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "12px",
                borderRadius: "50%", // Yuvarlak ikon alanı
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)"
            }}>
                <CheckCircleOutlined style={{ color: "#fff", fontSize: "28px" }} />
            </div>
        </div>
      </div>

      <Modal
        width={1400}
        centered
        title="Aktif Ekipman Detayları"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <ModalTablo />
        </div>
      </Modal>
    </div>
  );
}

export default Component1;