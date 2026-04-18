import React, { useState } from "react";
import { FormOutlined } from "@ant-design/icons";
import MenuItem from "./MenuItem";
import NotEkleModal from "./NotEkleModal";

export default function NotEkle({ selectedRows, refreshTableData, hidePopover }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const row = selectedRows[0];

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    hidePopover && hidePopover();
  };

  return (
    <>
      <MenuItem
        icon={<FormOutlined />}
        title="Not Ekle"
        description="Seçili iş emrine hızlı not ekle."
        onClick={openModal}
      />
      <NotEkleModal open={isModalOpen} onClose={closeModal} row={row} refreshTableData={refreshTableData} />
    </>
  );
}
