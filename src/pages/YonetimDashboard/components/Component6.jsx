import React, { useState } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Typography } from "antd";
import { RiseOutlined } from "@ant-design/icons"; // Artış ikonu
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";

const { Text } = Typography;

const DEFAULT_STATUS_FILTER = [0, 1];

function Component6() {
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
            Aylık Run-Rate
          </Text>
          
          <Text
            style={{ fontWeight: "600", fontSize: "28px", color: "white", lineHeight: "1.2" }}
          >
            ₺5.150.000
          </Text>

          <Text
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "8px" }}
          >
            Son 3 ay ortalaması
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
                <RiseOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>
                    +2.6%
                </Text>
            </div>
        </div>
      </div>

      <Modal 
        width={1400} 
        centered 
        title="Aylık Run-Rate Detayları" 
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <div>
          <ModalTablo defaultStatusKeys={DEFAULT_STATUS_FILTER} />
        </div>
      </Modal>
    </div>
  );
}

export default Component6;