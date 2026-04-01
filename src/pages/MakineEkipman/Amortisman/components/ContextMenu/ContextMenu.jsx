import React, { useState } from "react";
import { Button, Modal } from "antd";
import { SettingOutlined } from "@ant-design/icons";

// Bileşen importu
import ProfilTablo from "./components/Profil/ProfilTablo"; 

export default function ContextMenu({ refreshTableData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={showModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderColor: "#d9d9d9",
          height: "32px",
          width: "40px"
        }}
      >
        <SettingOutlined
          style={{ color: "#595959", fontSize: "18px", margin: "0" }}
        />
      </Button>

      <Modal
        title="Profil Listesi"
        open={isModalOpen}
        onCancel={handleClose}
        footer={null} // Alt kısımda OK/Cancel butonlarını istemiyorsan null bırakıyoruz
        width={800}   // Genişliği ihtiyacına göre artırabilirsin
        centered      // Ekranın tam ortasında açılması için
        styles={{ body: { padding: '16px 0' } }} // İç boşluğu ProfilTablo'ya göre ayarladık
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 16px' }}>
          <ProfilTablo 
            refreshTableData={refreshTableData} 
            hidePopover={handleClose} // İsmi Modal olduğu için handleClose'a bağladık
          />
        </div>
      </Modal>
    </>
  );
}