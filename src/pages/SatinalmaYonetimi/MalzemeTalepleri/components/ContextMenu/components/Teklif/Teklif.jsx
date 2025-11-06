import React, { useState } from "react";
import { Modal, Button } from "antd";
import TalepTeklifeAktarmaAntd from "./components/TalepTeklifAktarmaAntd";

export default function TalepTeklifeAktarmaModal({ selectedRow, refreshTableData, disabled = false }) {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);
  const handleCancel = () => {
    setOpen(false); // modal kapanıyor
    if (typeof refreshTableData === "function") {
      refreshTableData(); // tablo sadece modal kapandığında yenileniyor
    }
  };

  return (
    <>
      <Button
        style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
        onClick={showModal}
        type="text"
      >
        {selectedRow && (selectedRow.SFS_TALEP_DURUM_ID === 2 || selectedRow.SFS_TALEP_DURUM_ID === 5) ? "Fiyat Teklifleri" : "Talep → Teklife Aktar"}
      </Button>

      <Modal
        title={selectedRow && selectedRow.SFS_TALEP_DURUM_ID === 2 ? "Fiyat Teklifleri" : "Talep → Teklife Aktarma"}
        open={open}
        onCancel={handleCancel}
        footer={null}
        width="73%"
        style={{ top: 20 }}
        Style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <TalepTeklifeAktarmaAntd fisId={selectedRow?.TB_STOK_FIS_ID} baslik={selectedRow?.SFS_BASLIK} fisNo={selectedRow?.SFS_FIS_NO} refreshTableData={refreshTableData} disabled={disabled} />
      </Modal>
    </>
  );
}