import { Spin, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../../api/http";
import TipEkle from "../../Insert/TipEkle";

export default function MainTabs({ onSelectedRow }) {
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  // Örnek kolonlar ve başlangıçta hepsinin görünür olacağı varsayılıyor
  const columns = [
    {
      title: "İş Emri Tipi",
      dataIndex: "IMT_TANIM",
      key: "IMT_TANIM",
      width: "150px",
      ellipsis: true,
    },

    // Diğer kolonlarınız...
  ];

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  // ana tablo api isteği için kullanılan useEffect son

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`IsEmriTip`);
      if (response) {
        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_ISEMRI_TIP_ID,
          // Diğer alanlarınız...
        }));
        setData(formattedData);
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
    // Seçilen satırların verisini bul
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Seçilen satırların verilerini state'e ata
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRowClick = (record) => {
    return {
      onClick: () => {
        onSelectedRow(record); // Üst bileşene tıklanan satırın verisini aktar
      },
    };
  };

  // const refreshTableData = useCallback(() => {
  //   fetchEquipmentData();
  // }, []);

  const refreshTableData = useCallback(() => {
    // Tablodan seçilen kayıtların checkbox işaretini kaldır
    setSelectedRowKeys([]);
    setSelectedRows([]);

    // Verileri yeniden çekmek için `fetchEquipmentData` fonksiyonunu çağır
    fetchEquipmentData();
  }, []); // Bağımlılıkları kaldırdık, çünkü fonksiyon içindeki değerler zaten en güncel halleriyle kullanılıyor.

  return (
    <div style={{ width: "200px", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
      <style>
        {`
          .boldRow {
            font-weight: bold;
          }
        `}
      </style>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          // rowSelection={rowSelection}
          dataSource={data}
          pagination={false}
          onRow={onRowClick}
          scroll={{ y: "500px" }}
        />
      </Spin>
      <TipEkle onRefresh={refreshTableData} />
    </div>
  );
}
