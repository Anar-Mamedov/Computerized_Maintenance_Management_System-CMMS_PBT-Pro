import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";

const { Text } = Typography;

export default function SatinalmaTablo({ workshopSelectedId, onSubmit, selectedRows }) {
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
      title: "Talep No",
      dataIndex: "islem",
      key: "islem",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Sipariş No",
      dataIndex: "islem",
      key: "islem",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Başlık",
      dataIndex: "islem",
      key: "islem",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Durum",
      dataIndex: "islem",
      key: "islem",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Sipariş Tarihi",
      dataIndex: "islemZamani",
      key: "tarih",
      width: 150,
      render: (text) => formatDate(text),
    },
    {
      title: "Teslim Tarihi",
      dataIndex: "islemZamani",
      key: "tarih",
      width: 150,
      render: (text) => formatDate(text),
    },
    {
      title: "Firma",
      dataIndex: "islemZamani",
      key: "tarih",
      width: 150,
      render: (text) => formatDate(text),
    },
    {
      title: "Lokasyon",
      dataIndex: "islemZamani",
      key: "tarih",
      width: 150,
      render: (text) => formatDate(text),
    },
    {
      title: "Sipariş Veren",
      dataIndex: "islemZamani",
      key: "tarih",
      width: 150,
      render: (text) => formatDate(text),
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    const selectedKey = selectedRows.map((item) => item.key).join(",");
    AxiosInstance.get(`GetSatinalmaSiparisListBy?fisId=${selectedKey}`)
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
  Satınalma Siparişleri
</Button>
      <Modal
        width={1000}
        centered
        title="Satınalma Siparişleri"
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