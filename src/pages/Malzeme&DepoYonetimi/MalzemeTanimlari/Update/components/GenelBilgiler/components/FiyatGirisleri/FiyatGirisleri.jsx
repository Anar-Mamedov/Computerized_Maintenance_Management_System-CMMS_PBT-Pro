import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";
import ContextMenu from "./components/ContextMenu/ContextMenu";
import { t } from "i18next";
import dayjs from "dayjs";

const FiyatGirisleri = ({ selectedRowID }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });

  const columns = [
    {
      title: t("tarih"),
      dataIndex: "SFT_TARIH",
      key: "SFT_TARIH",
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{dayjs(text).format("DD.MM.YYYY")}</a> // Updated this line
      ),
    },
    {
      title: t("saat"),
      dataIndex: "SFT_SAAT",
      key: "SFT_SAAT",
    },
    {
      title: t("girisCikis"),
      dataIndex: "SFT_GC_NEW",
      key: "SFT_GC_NEW",
    },
    {
      title: t("aciklama"),
      dataIndex: "SFT_ACIKLAMA",
      key: "SFT_ACIKLAMA",
    },
    {
      title: t("miktar"),
      dataIndex: "SFT_MIKTAR",
      key: "SFT_MIKTAR",
    },
    {
      title: t("tutar"),
      dataIndex: "SFT_TUTAR",
      key: "SFT_TUTAR",
    },
  ];

  const fetchFiyatList = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("GetFiyatGirisList", {
        params: {
          STOK_ID: selectedRowID,
        },
      });
      const mappedData = response.map((item) => ({
        ...item,
        key: item.TB_STOK_FIYAT_ID, // Assuming this is your unique identifier
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fiyat listesi çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchFiyatList();
    }
  }, [isModalOpen]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);

    // Seçilen satırların verisini bul
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Seçilen satırların verilerini state'e ata
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onRefresh = () => {
    fetchFiyatList();
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  const onRowClick = (record) => {
    setDrawer({ visible: true, data: record });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        {t("fiyatGirisleri")}
      </Button>
      <Modal title={t("fiyatGirisleri")} centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={800}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px" }}>
          <ContextMenu selectedRows={selectedRows} refreshTableData={onRefresh} />
          <CreateModal onRefresh={onRefresh} selectedRowID={selectedRowID} />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          loading={loading}
          pagination={{
            pageSize: 10,
            total: data.length,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
        />
        <EditModal selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={onRefresh} />
      </Modal>
    </div>
  );
};

export default FiyatGirisleri;
