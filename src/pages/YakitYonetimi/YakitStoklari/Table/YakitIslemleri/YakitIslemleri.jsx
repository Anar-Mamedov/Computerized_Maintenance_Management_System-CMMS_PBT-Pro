import React, { useState, useEffect } from "react";
import { Modal, Tabs, Typography } from "antd";
import YakitGiris from "./YakitGiris";
import YakitCikis from "./YakitCikis";
import YakitTransfer from "./YakitTransfer";

const { Title, Text } = Typography;

const MainYakitModal = ({ visible, onClose, onRefresh, selectedRows, defaultTab }) => {
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    if (visible && defaultTab) {
      setActiveKey(defaultTab);
    }
  }, [visible, defaultTab]);

  const items = [
    {
      key: "1",
      label: "Giriş",
      children: <YakitGiris onClose={onClose} onRefresh={onRefresh} selectedRows={selectedRows} />,
    },
    {
      key: "2",
      label: "Çıkış",
      children: <YakitCikis onClose={onClose} onRefresh={onRefresh} selectedRows={selectedRows} />,
    },
    {
      key: "3",
      label: "Transfer",
      children: <YakitTransfer onClose={onClose} onRefresh={onRefresh} selectedRows={selectedRows} />,
    },
  ];

  return (
    <Modal
      title={
        <div style={{ marginBottom: "10px" }}>
          <Title level={5} style={{ margin: 0 }}>Stok Giriş İşlemi</Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Yakıt Depoları / Tanklar üzerinden hızlı stok işlemi
          </Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null} // Butonlar alt bileşenlerin içinde
      width={800}
      destroyOnClose
      centered
    >
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        items={items}
        type="card" // Görseldeki sekmeli yapıya daha yakın durur
        style={{ marginTop: "-10px" }}
      />
    </Modal>
  );
};

export default MainYakitModal;