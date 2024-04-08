import { Spin, Table, Input } from "antd";
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
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veri için yeni state
  const [searchTerm, setSearchTerm] = useState(""); // Arama terimi için state

  // Örnek kolonlar ve başlangıçta hepsinin görünür olacağı varsayılıyor
  const columns = [
    {
      title: "",
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
        setFilteredData(formattedData); // filteredData'yı da aynı veriyle güncelle
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

  // Arama terimindeki değişiklikleri işleyen fonksiyon
  // Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ğ/g, "g")
      .replace(/Ğ/g, "G")
      .replace(/ü/g, "u")
      .replace(/Ü/g, "U")
      .replace(/ş/g, "s")
      .replace(/Ş/g, "S")
      .replace(/ı/g, "i")
      .replace(/İ/g, "I")
      .replace(/ö/g, "o")
      .replace(/Ö/g, "O")
      .replace(/ç/g, "c")
      .replace(/Ç/g, "C");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const normalizedSearchTerm = normalizeText(value); // Arama terimini normalize et
      const filtered = data.filter((item) =>
        Object.keys(item).some(
          (key) =>
            item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <div style={{ width: "200px", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
      <style>
        {`
          .boldRow {
            font-weight: bold;
          }
        `}
      </style>
      <Input
        placeholder="Ara..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "-48px", zIndex: "2" }} // Arama kutusunun altındaki boşluk
      />
      <Spin spinning={loading}>
        <Table
          columns={columns}
          // rowSelection={rowSelection}
          dataSource={filteredData}
          pagination={false}
          onRow={onRowClick}
          scroll={{ y: "500px" }}
        />
      </Spin>
      <TipEkle onRefresh={refreshTableData} />
    </div>
  );
}
