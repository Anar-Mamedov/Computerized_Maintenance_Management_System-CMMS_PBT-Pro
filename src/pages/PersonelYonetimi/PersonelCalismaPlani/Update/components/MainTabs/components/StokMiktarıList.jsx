import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { t } from "i18next";

const StokMiktariList = ({ stokId }) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (stokId) {
      fetchTableData();
    }
  }, [stokId]);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      // Senin belirttiğin endpoint yapısı: GetYakitTankDetay?stokId=
      const res = await AxiosInstance.get(`GetYakitTankDetay?stokId=${stokId}`);
      
      // API'den gelen verinin yapısına göre burayı düzenleyebilirsin
      // Genelde res.data veya res.data.data şeklinde gelir
      const data = Array.isArray(res) ? res : (res.data || []);
      setDataSource(data);
    } catch (err) {
      message.error(t("Veriler yüklenirken bir hata oluştu."));
      console.error("Stok Detay Hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t("Depo / Tank"),
      dataIndex: "DEP_TANIM", // API'den gelen kolon adıyla eşleştir kanka
      key: "DEP_TANIM",
      width: 200,
    },
    {
      title: t("Üretici Kod"),
      dataIndex: "STK_URETICI_KOD",
      key: "STK_URETICI_KOD",
    },
    {
      title: t("Giren Miktar"),
      dataIndex: "DPS_GIREN_MIKTAR",
      key: "DPS_GIREN_MIKTAR",
      align: "right",
      render: (text) => (
        <span style={{ fontWeight: "600" }}>
          {Number(text).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} Lt
        </span>
      ),
    },
    {
      title: t("Çıkan Miktar"),
      dataIndex: "DPS_CIKAN_MIKTAR",
      key: "DPS_CIKAN_MIKTAR",
      align: "right",
      render: (text) => (
        <span style={{ fontWeight: "600" }}>
          {Number(text).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} Lt
        </span>
      ),
    },
    {
      title: t("Stok Miktar"),
      dataIndex: "DPS_MIKTAR",
      key: "DPS_MIKTAR",
      align: "right",
      render: (text) => (
        <span style={{ fontWeight: "600" }}>
          {Number(text).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} Lt
        </span>
      ),
    },
    {
      title: t("Birim"),
      dataIndex: "STK_BIRIM",
      key: "STK_BIRIM",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false} // Detay listesi olduğu için genelde sayfalama gerekmez
      rowKey={(record) => record.TB_DEPO_ID || Math.random()} // Benzersiz bir key
      size="middle"
      locale={{ emptyText: t("Veri Bulunamadı") }}
      scroll={{ y: 400 }} // Liste çok uzarsa modalda kaydırma yapar
    />
  );
};

export default StokMiktariList;