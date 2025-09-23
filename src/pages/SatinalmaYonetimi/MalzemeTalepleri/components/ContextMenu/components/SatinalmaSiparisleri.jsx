import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";

const { Text } = Typography;

export default function SatinalmaTablo({ workshopSelectedId, onSubmit, selectedRows }) {
  const { control } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const columns = [
    {
      title: "Talep No",
      dataIndex: "TALEP_NO",
      key: "TALEP_NO",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Sipariş No",
      dataIndex: "SSP_SIPARIS_KODU",
      key: "SSP_SIPARIS_KODU",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Başlık",
      dataIndex: "SSP_BASLIK",
      key: "SSP_BASLIK",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Durum",
      dataIndex: "SSP_DURUM",
      key: "SSP_DURUM",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Sipariş Tarihi",
      dataIndex: "SSP_SIPARIS_TARIHI",
      key: "SSP_SIPARIS_TARIHI",
      width: 150,
      render: (text) => formatDate(text),
    },
    {
      title: "Teslim Tarihi",
      dataIndex: "SSP_TESLIM_TARIHI",
      key: "SSP_TESLIM_TARIHI",
      width: 150,
      render: (text) => formatDate(text),
    },
    {
      title: "Firma",
      dataIndex: "SSP_FIRMA",
      key: "SSP_FIRMA",
      width: 200,
    },
    {
      title: "Lokasyon",
      dataIndex: "SSP_LOKASYON",
      key: "SSP_LOKASYON",
      width: 150,
    },
    {
      title: "Sipariş Veren",
      dataIndex: "SSP_SIPARIS_VEREN",
      key: "SSP_SIPARIS_VEREN",
      width: 150,
    },
  ];

  const fetchData = useCallback(async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    setLoading(true);

    try {
      const selectedKey = selectedRows.map(item => item.key).join(",");
      const response = await AxiosInstance.get(`GetSatinalmaSiparisListBy?fisId=${selectedKey}`);

      console.log("API Cevabı:", response.siparis_listesi); // debug için
      const siparisListesi = response.siparis_listesi || [];
      const formattedData = siparisListesi.map(item => ({
        key: item.TB_SATINALMA_SIPARIS_ID,
        ...item
      }));
      setData(formattedData);
    } catch (err) {
      console.error("API Hatası:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRows]);

  useEffect(() => {
    if (isModalVisible) {
      fetchData();
      setSelectedRowKeys([]);
    }
  }, [isModalVisible, fetchData]);

  const handleModalToggle = () => setIsModalVisible(prev => !prev);

  const handleModalOk = () => {
    const selectedData = data.find(item => item.key === selectedRowKeys[0]);
    if (selectedData && onSubmit) onSubmit(selectedData);
    setIsModalVisible(false);
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
        title={`Satınalma Siparişleri (${selectedRows[0]?.SFS_FIS_NO || ""})`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
      >
        <div style={{ marginBottom: "10px" }}>
          <Controller
            name="fisNo"
            control={control}
            render={({ field }) => (
              <Text {...field} style={{ fontSize: "14px", fontWeight: "600" }} />
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