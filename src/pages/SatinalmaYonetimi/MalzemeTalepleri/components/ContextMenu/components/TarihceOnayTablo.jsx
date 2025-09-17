import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";

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

  const formatDateTime = (value) => {
  if (!value) return "";
  return dayjs(value).format("DD.MM.YYYY HH:mm"); 
};

  const columns = [
    {
      title: "Kullanıcı",
      dataIndex: "kullanici",
      key: "kullanici",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "Gönderim Zamanı",
      dataIndex: "gonderimZamani",
      key: "gonderimZamani",
      width: 150,
      render: (text) => formatDateTime(text),
    },
    {
      title: "İşlem Zamanı",
      dataIndex: "islemZamani",
      key: "islemZamani",
      width: 150,
      render: (text) => formatDateTime(text),
    },
    {
      title: "Talep Kodu",
      dataIndex: "tabloKod",
      key: "tabloKod",
      width: 250,
      ellipsis: true,
    },
    {
      title: "İşlem",
      dataIndex: "islem",
      key: "islem",
      width: 150,
      ellipsis: true,
      render: (text) => {
        let style = {
          borderRadius: "12px",
          padding: "2px 8px",
          fontWeight: 500,
          fontSize: "14px",
        };

      switch (text) {
        case "Onaylandı":
          style = { ...style, backgroundColor: "#d4f8e8", color: "#207868" }; // pastel yeşil
        break;
        case "Onay Bekliyor":
          style = { ...style, backgroundColor: "#fff4d6", color: "#b8860b" }; // pastel sarı
        break;
        case "Reddedildi":
          style = { ...style, backgroundColor: "#ffe0e0", color: "#b22222" }; // pastel kırmızı
        break;
        case "Bekliyor":
          style = { ...style, backgroundColor: "#f5f5f5", color: "#595959" }; // gri 
        default:
        style = { ...style, backgroundColor: "#f5f5f5", color: "#595959" }; // gri
      }

        return <span style={style}>{text}</span>;
      },
    },
    {
      title: "Süre (Fark)",
      dataIndex: "fark",
      key: "fark",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "Açıklama",
      dataIndex: "redAciklama",
      key: "redAciklama",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    const selectedKey = selectedRows.map((item) => item.key).join(",");
    AxiosInstance.get(`GetOnayTarihceBy?tabloId=${selectedKey}`)
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
        Onay Tarihçesi
      </Button>
      <Modal
        width={1000}
        centered
        title={`Malzeme Talebi Onay Tarihçesi (${selectedRows[0]?.SFS_FIS_NO || ""})`}
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