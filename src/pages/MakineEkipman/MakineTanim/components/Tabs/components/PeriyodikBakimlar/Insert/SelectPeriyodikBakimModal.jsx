import React, { useState, useCallback } from "react";
import { Button, Modal, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../../api/http";

export default function SelectPeriyodikBakimModal({ makineId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchList = useCallback(
    async (page = 1) => {
      if (!makineId) return;
      setLoading(true);
      try {
        const response = await AxiosInstance.get(`PeriyodikBakimListSelectable?makineID=${makineId}&page=${page}`);
        const list = response?.list || [];
        const fetched = list.map((item) => ({
          ...item,
          key: item.TB_PERIYODIK_BAKIM_ID,
        }));
        setData(fetched);
        setTotalCount(response?.kayit_sayisi || 0);
      } catch (error) {
        console.error("Periyodik bakım listesi yüklenemedi:", error);
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [makineId]
  );

  const handleOpen = () => {
    setSelectedRowKeys([]);
    setCurrentPage(1);
    setIsModalVisible(true);
    fetchList(1);
  };

  const handleOk = () => {
    const selectedItems = selectedRowKeys.map((key) => data.find((item) => item.key === key)).filter(Boolean);
    if (selectedItems.length > 0) {
      onSubmit && onSubmit(selectedItems);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: t("bakimKodu", { defaultValue: "Bakım Kodu" }),
      dataIndex: "PBK_KOD",
      key: "PBK_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: t("periyodikBakim", { defaultValue: "Periyodik Bakım" }),
      dataIndex: "PBK_TANIM",
      key: "PBK_TANIM",
      width: 250,
      ellipsis: true,
    },
    {
      title: t("periyot", { defaultValue: "Periyot" }),
      dataIndex: "PERIYOT_ACIKLAMA",
      key: "PERIYOT_ACIKLAMA",
      ellipsis: true,
    },
  ];

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
        {t("ekle", { defaultValue: "Ekle" })}
      </Button>
      <Modal
        width="800px"
        centered
        title={t("periyodikBakimSec", { defaultValue: "Periyodik Bakım Seç" })}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalCount,
            onChange: (page) => {
              setCurrentPage(page);
              fetchList(page);
            },
          }}
          scroll={{ y: 400 }}
        />
      </Modal>
    </>
  );
}
