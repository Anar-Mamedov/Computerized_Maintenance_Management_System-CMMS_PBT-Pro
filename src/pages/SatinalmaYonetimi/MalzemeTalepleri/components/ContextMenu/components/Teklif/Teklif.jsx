import React, { useState } from "react";
import { Modal, Button } from "antd";
import TalepTeklifeAktarmaAntd from "./components/TalepTeklifAktarmaAntd";

export default function TalepTeklifeAktarmaModal() {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  return (
    <>
      <Button
        style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
        onClick={showModal}
        type="text"
      >
        Talep → Teklife Aktar
      </Button>

      <Modal
        title="Talep → Teklife Aktarma"
        open={open}
        onCancel={handleCancel}
        footer={null} // İçeride zaten kendi butonları var
        width={1500} // Genişlik ayarı, istersen değiştirebilirsin
      >
        <TalepTeklifeAktarmaAntd />
      </Modal>
    </>
  );
}