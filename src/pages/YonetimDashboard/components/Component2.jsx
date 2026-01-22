import React, { useState } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Typography } from "antd";
import { RiseOutlined } from "@ant-design/icons"; // Artış ikonu
import ModalTablo from "../../BakımVeArizaYonetimi/IsEmri/Table/ModalTable/ModalTable.jsx";

const { Text } = Typography;

function Component2() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // API ve Loading state'leri kaldırıldı.

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
            Bütçe Sapması
          </Text>
          
          <Text
            style={{ fontWeight: "600", fontSize: "28px", color: "white", lineHeight: "1.2" }}
          >
            9.7%
          </Text>

          <Text
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "8px" }}
          >
            Bütçe vs gerçekleşen
          </Text>
        </div>

        {/* SAĞ TARAFTAKİ YÜZDE GÖSTERGESİ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "5px 10px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backdropFilter: "blur(4px)"
            }}>
                <RiseOutlined style={{ color: "#ff4d4f", fontSize: "16px" }} /> {/* Sapma olduğu için kırmızı tonu daha uygun olabilir ama artış dediğin için Rise koydum, rengi istersen değiştirebilirsin */}
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>
                    +1.9%
                </Text>
            </div>
        </div>
      </div>

      <Modal 
        width={1400} 
        destroyOnClose 
        centered 
        title="Bütçe Sapması Detayları" 
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