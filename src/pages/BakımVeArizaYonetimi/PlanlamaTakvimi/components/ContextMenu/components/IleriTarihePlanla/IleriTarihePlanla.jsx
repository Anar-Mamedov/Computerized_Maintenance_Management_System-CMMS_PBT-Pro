import React, { useState } from "react";
import { Button, Modal } from "antd";

function IleriTarihePlanla({ selectedCells }) {
  const [modalVisible, setModalVisible] = useState(false);
  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
    console.log(selectedCells);
  };
  return (
    <div>
      <Button
        style={{
          display: "flex",
          padding: "0px 0px",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        type="success"
        onClick={handleModalToggle}
      >
        İleri Tarihe Planla
      </Button>
      <Modal
        title="Basic Modal"
        open={modalVisible}
        onOk={handleModalToggle}
        onCancel={handleModalToggle}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}

export default IleriTarihePlanla;
