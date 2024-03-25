import React from "react";
import { Modal } from "antd";

const EditModal = ({ visible, onOk, onCancel, selectedFile }) => (
  <Modal title="Dosya Detayları" open={visible} onOk={onOk} onCancel={onCancel}>
    <p>{selectedFile ? selectedFile.name : ""}</p>
    <a href={selectedFile ? selectedFile.url : "#"} target="_blank" rel="noopener noreferrer">
      Dosyayı İndir
    </a>
  </Modal>
);

export default EditModal;
