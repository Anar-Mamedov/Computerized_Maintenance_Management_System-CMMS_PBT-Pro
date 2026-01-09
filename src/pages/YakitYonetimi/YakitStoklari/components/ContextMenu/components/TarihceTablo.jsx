import React, { useCallback, useState } from "react";
import { Modal, Table, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import { HistoryOutlined } from "@ant-design/icons"; // İkon eklendi

const { Text } = Typography;

export default function TarihceTablo({ workshopSelectedId, onSubmit, selectedRows }) {
  const { control } = useFormContext(); // setValue kullanılmıyorsa sildim
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const columns = [
    { title: "İşlem", dataIndex: "islem", key: "islem", width: 250, ellipsis: true },
    { title: "Tarih", dataIndex: "islemZamani", key: "tarih", width: 150, render: (text) => formatDate(text) },
    { title: "Saat", dataIndex: "islemZamani", key: "saat", width: 100, render: (text) => formatTime(text) },
    { title: "İşlem Yapan", dataIndex: "islemYapanAdi", key: "islemYapanAdi", width: 200, ellipsis: true, render: (text) => text || "-" },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    const selectedKey = selectedRows.map((item) => item.key).join(",");
    AxiosInstance.get(`GetMalzemeSatinalmaTarihceDetayli?fisId=${selectedKey}`)
      .then((response) => {
        const fetchedData = response.data.map((item) => ({
          key: item.tarihceId,
          ...item,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [selectedRows]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  return (
    <div>
      <div
        className="menu-item-hover"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: "pointer",
          padding: "10px 12px",
          transition: "background-color 0.3s",
          width: "100%",
        }}
        onClick={handleModalToggle}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <div>
          <HistoryOutlined style={{ color: "#595959", fontSize: "18px", marginTop: "4px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>
            Tarihçe
          </span>
          <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>
            Sipariş üzerindeki tüm işlem geçmişini göster.
          </span>
        </div>
      </div>

      <Modal
        width={1000}
        centered
        title="Satınalma Siparişleri Tarihçesi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
      >
        <div style={{ marginBottom: "10px" }}>
          <Controller
            name="fisNo"
            control={control}
            render={({ field }) => <Text {...field} style={{ fontSize: "14px", fontWeight: "600" }} />}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ y: "calc(100vh - 360px)" }}
        />
      </Modal>
    </div>
  );
}