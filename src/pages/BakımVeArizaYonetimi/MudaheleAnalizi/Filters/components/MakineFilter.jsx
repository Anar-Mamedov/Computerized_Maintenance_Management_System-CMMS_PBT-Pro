import React, { useState, useEffect } from "react";
import { Select, Button, Popover, Spin, Modal, Input } from "antd";
import AxiosInstance from "../../../../../api/http";
import { Controller, useFormContext } from "react-hook-form";
import MakineTable from "../../../../MakineEkipman/MakineTanim/Table/Table.jsx";

const { Option } = Select;

const MakineFilter = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const handleChange = (selectedValues) => {
    // Seçilen değerlerin id'lerini kullanarak selectedIds dizisini güncelle
    const newSelectedIds = selectedValues
      .map((value) => {
        const option = options.find((option) => option.value === value);
        return option ? option.key : null;
      })
      .filter((id) => id !== null); // null değerleri filtrele
    setSelectedIds(newSelectedIds);
  };

  const handleSubmit = () => {
    // console.log("Selected IDs:", selectedIds);
    // Seçilen id'leri setValue ile ayarla
    // Map selectedIds to their key values and join them with commas
    const selectedIdsString = selectedIds.map((id) => id.key).join(",");
    setValue("makineIds", selectedIdsString);
    setOpen(false);
    // onSubmit(selectedIds); // onSubmit ile id'leri gönder
  };

  const handleCancelClick = () => {
    setSelectedIds([]);
    setValue("makineIds", "");
    // console.log(watch("locationIds"));
    setOpen(false);
    // onSubmit([]);
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

  // Map selectedIds to MKN_KOD values and join them with commas
  const selectedMknKodString = selectedIds.map((id) => id.MKN_KOD).join(", ");

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
          <Input disabled value={selectedMknKodString} />
          <Button onClick={showModal}>+</Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Popover content={content} trigger={null} open={open} onOpenChange={setOpen} placement="bottom">
        <Button
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(!open)}
        >
          Makine
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
            }}
          >
            {selectedIds.length}
          </div>
        </Button>
      </Popover>
      <Modal
        title="Makine Seç"
        width={1200}
        destroyOnClose
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        zIndex={2000} // Ensure the modal is above the popover
      >
        <MakineTable setSelectedIds={setSelectedIds} />
      </Modal>
    </>
  );
};

export default MakineFilter;
