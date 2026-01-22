import React, { useState } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Typography } from "antd";
import { RiseOutlined } from "@ant-design/icons"; // Artış ikonu ekledim
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";

const { Text } = Typography;

function Component1({ updateApi }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // API fonksiyonları ve useEffect kaldırıldı.

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
        padding: "15px", // Paddingi bir tık artırdım ferah olsun
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // Dikey ortalama
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
            Toplam Harcama
          </Text>
          
          <Text
            style={{ fontWeight: "600", fontSize: "28px", color: "white", lineHeight: "1.2" }}
          >
            ₺18.750.000
          </Text>

          <Text
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "8px" }}
          >
            Yakıt + bakım + parça + taşeron
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
                    +6.2%
                </Text>
            </div>
        </div>
      </div>

      <Modal
        width={1400}
        centered
        title="Toplam Harcama Detayları"
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