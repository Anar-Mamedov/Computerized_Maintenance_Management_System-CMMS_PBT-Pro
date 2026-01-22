import React, { useState } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Typography } from "antd";
import { TeamOutlined } from "@ant-design/icons"; // Personel ikonu
import ModalTablo from "../../BakımVeArizaYonetimi/IsEmri/Table/ModalTable/ModalTable.jsx";

const { Text } = Typography;

function Component2() {
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
            Aktif Personel
          </Text>
          
          <Text
            style={{ fontWeight: "600", fontSize: "32px", color: "white", lineHeight: "1.2" }}
          >
            412
          </Text>

          <Text
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "8px" }}
          >
            Giriş/çıkış veya vardiya kaydı bulunan
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
                <TeamOutlined style={{ color: "#fff", fontSize: "28px" }} />
            </div>
        </div>
      </div>

      <Modal 
        width={1400} 
        destroyOnClose 
        centered 
        title="Aktif Personel Listesi" 
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

export default Component2;