import React, { useState, useEffect } from "react";
import { Button, Popover, Modal, Input } from "antd";
import { useFormContext } from "react-hook-form";
import MakineTable from "../../../../MakineEkipman/MakineTanim/Table/Table.jsx";

const MakineFilter = () => {
  const [open, setOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setValue, watch } = useFormContext();

  // Ana formdaki "EkipmanIds" array'ini dinliyoruz kanka
  const currentSelectedIds = watch("EkipmanIds") || [];

  // Modal içindeki tablodan seçilen ham nesne verilerini yerel state'te tutuyoruz
  const [selectedObjects, setSelectedObjects] = useState([]);

  // Seçilen nesneler değiştikçe ana formdaki "EkipmanIds" array'ini id'lerle besliyoruz
  useEffect(() => {
    // MakineTable'dan gelen nesnelerin benzersiz ID key'lerini çekiyoruz (Örn: TB_MAKINE_ID veya item.key)
    const ids = selectedObjects.map((item) => (item.TB_MAKINE_ID || item.key || item.id)?.toString()).filter(Boolean);
    setValue("EkipmanIds", ids);
  }, [selectedObjects, setValue]);

  const handleSubmit = () => {
    setOpen(false);
  };

  const handleCancelClick = () => {
    setSelectedObjects([]);
    setValue("EkipmanIds", []);
    setOpen(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Input içinde görünecek kod stringini güvenle oluşturuyoruz
  const selectedMknKodString = selectedObjects.map((item) => item.MKN_KOD || item.value).filter(Boolean).join(", ");

  const content = (
    <div style={{ width: "300px" }}>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleCancelClick}>İptal</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input disabled value={selectedMknKodString} placeholder="Seçilen ekipmanlar..." />
          <Button onClick={showModal}>+</Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottom">
        <Button
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Ekipman
          <div
            style={{
              marginLeft: "5px",
              background: "#006cb8",
              borderRadius: "50%",
              width: "17px",
              height: "17px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "11px"
            }}
          >
            {currentSelectedIds.length}
          </div>
        </Button>
      </Popover>
      <Modal
        title="Ekipman Seç"
        width={1200}
        destroyOnClose
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        zIndex={2000}
      >
        {/* Tabloya yerel nesne setleme fonksiyonunu geçiyoruz */}
        <MakineTable setSelectedIds={setSelectedObjects} />
      </Modal>
    </>
  );
};

export default MakineFilter;