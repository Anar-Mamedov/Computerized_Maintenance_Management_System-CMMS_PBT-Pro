import React, { useState } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Typography } from "antd";
import { RiseOutlined } from "@ant-design/icons"; // Artış ikonu
import MakineTablo from "./../../MakineEkipman/MakineTanim/Table/Table.jsx";

const { Text } = Typography;

function Component4(props) {
  const [modalVisible, setModalVisible] = useState(false);

  // API fonksiyonları ve useEffect kaldırıldı.

  const showModal = () => {
    setModalVisible(true);
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
            Toplam Satınalma Tutarı
          </Text>
          
          <Text
            style={{ fontWeight: "600", fontSize: "28px", color: "white", lineHeight: "1.2" }}
          >
            ₺24.850.000
          </Text>

          <Text
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "8px" }}
          >
            Dönem toplam satınalma harcaması
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
                    +5.3%
                </Text>
            </div>
        </div>
      </div>

      <Modal
        title="Satınalma Detayları"
        width="90%"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        centered
        footer={null}
      >
        <div>
          <MakineTablo />
        </div>
      </Modal>
    </div>
  );
}

export default Component4;