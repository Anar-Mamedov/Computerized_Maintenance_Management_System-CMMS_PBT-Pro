import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";

const { Text } = Typography;

export default function TarihceTablo({ workshopSelectedId, onSubmit, selectedRows }) {
  const { control, setValue } = useFormContext();
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
    {
      title: "İşlem",
      dataIndex: "islem",
      key: "islem",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Tarih",
      dataIndex: "islemZamani",
      key: "tarih",
      width: 150,
      render: (text) => formatDate(text),
    },
    {
      title: "Saat",
      dataIndex: "islemZamani",
      key: "saat",
      width: 100,
      render: (text) => formatTime(text),
    },
    {
      title: "İşlem Yapan",
      dataIndex: "islemYapanAdi",
      key: "islemYapanAdi",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    const selectedKey = selectedRows.map((item) => item.key).join(",");
    AxiosInstance.get(`GetMalzemeSatinalmaTarihceDetayli?fisId=${selectedKey}&detayId=`)
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

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  return (
    <div>
      <Button
        style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
        onClick={handleModalToggle}
        type="text"
      >
        Tarihçe
      </Button>
      <Modal
        width={1000}
        centered
        title="Malzeme Talebi Tarihçesi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
      >
        <div style={{ marginBottom: "10px" }}>
          <Controller
            name="fisNo"
            control={control}
            render={({ field }) => (
              <Text {...field} style={{ fontSize: "14px", fontWeight: "600" }}>
              </Text>
            )}
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