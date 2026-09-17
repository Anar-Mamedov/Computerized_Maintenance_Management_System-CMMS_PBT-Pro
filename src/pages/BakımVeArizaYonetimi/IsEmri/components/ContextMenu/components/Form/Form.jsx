import React, { useState } from "react";
import PropTypes from "prop-types";
import { FileTextOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import MenuItem from "../MenuItem";
import IsEmriFormlariModal from "./IsEmriFormlariModal";

const Form = ({ selectedRows }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedRow = selectedRows?.[0];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <MenuItem icon={<FileTextOutlined />} title={t("workOrder.forms.menuTitle")} description={t("workOrder.forms.menuDescription")} onClick={openModal} />

      <IsEmriFormlariModal open={isModalOpen} onClose={closeModal} isEmriId={selectedRow?.key} isEmriNo={selectedRow?.ISEMRI_NO} />
    </>
  );
};

Form.propTypes = {
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

export default Form;
