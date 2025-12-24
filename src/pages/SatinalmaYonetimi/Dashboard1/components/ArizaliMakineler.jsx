import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Typography,
  Spin,
  Button,
  Popover,
  Modal,
  ConfigProvider,
  Input,
} from "antd";
import { DownloadOutlined, MoreOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http.jsx";
import trTR from "antd/lib/locale/tr_TR";
import { useFormContext } from "react-hook-form";
import { CSVLink } from "react-csv";

const { Text } = Typography;

// Türkçe karakterleri normalize etme fonksiyonu
const normalizeText = (text) => {
  return text
    ? text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[ğĞ]/g, (m) => (m === "ğ" ? "g" : "G"))
        .replace(/[üÜ]/g, (m) => (m === "ü" ? "u" : "U"))
        .replace(/[şŞ]/g, (m) => (m === "ş" ? "s" : "S"))
        .replace(/[ıİ]/g, (m) => (m === "ı" ? "i" : "I"))
        .replace(/[öÖ]/g, (m) => (m === "ö" ? "o" : "O"))
        .replace(/[çÇ]/g, (m) => (m === "ç" ? "c" : "C"))
    : "";
};

function MalzemeKullanimAnalizi() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`getMalzemeKullanimlari`);
      const resData = response.data || [];

      if (resData.length > 0) {
        // Kanka burası püf noktası: İlk objenin key'lerinden yılları ayıklıyoruz
        const allKeys = Object.keys(resData[0]);
        const yearKeys = allKeys
          .filter((key) => !isNaN(key)) // Sadece sayı (yıl) olanları al
          .sort((a, b) => b - a); // Büyükten küçüğe (2025, 2024...)

        // Kolonları oluştur
        const cols = [
          {
            title: "Malzeme Tip Adı",
            dataIndex: "MALZEME_TIP_ADI",
            key: "MALZEME_TIP_ADI",
            width: 200,
            fixed: "left",
            sorter: (a, b) => a.MALZEME_TIP_ADI.localeCompare(b.MALZEME_TIP_ADI),
          },
          ...yearKeys.map((year) => ({
            title: year.toString(),
            dataIndex: year,
            key: year,
            width: 100,
            align: "right",
            sorter: (a, b) => (a[year] || 0) - (b[year] || 0),
            render: (val) => (val !== null ? val.toLocaleString("tr-TR") : "-"),
          })),
        ];

        setDynamicColumns(cols);
      }

      const formattedData = resData.map((item, index) => ({
        ...item,
        key: index,
      }));

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Arama fonksiyonu
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const normSearch = normalizeText(value).toLowerCase();

    if (value) {
      const filtered = data.filter((item) =>
        normalizeText(item.MALZEME_TIP_ADI).toLowerCase().includes(normSearch)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const csvHeaders = dynamicColumns.map((col) => ({
    label: col.title,
    key: col.dataIndex,
  }));

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ cursor: "pointer" }} onClick={() => setIsExpandedModalVisible(true)}>Büyüt</div>
      <div style={{ cursor: "pointer" }} onClick={() => fetchData()}>Yenile</div>
    </div>
  );

  return (
    <ConfigProvider locale={trTR}>
      <div style={{ width: "100%", height: "100%", borderRadius: "5px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #f0f0f0" }}>
        
        <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text strong style={{ fontSize: "16px" }}>Yıllık Malzeme Kullanım Analizi</Text>
          <Popover placement="bottom" content={content} trigger="click">
            <Button type="text" icon={<MoreOutlined />} />
          </Popover>
        </div>

        <div style={{ padding: "0 10px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Input placeholder="Malzeme tipi ara..." value={searchTerm} onChange={handleSearch} style={{ width: "250px" }} />
            <CSVLink data={filteredData} headers={csvHeaders} filename="malzeme_kullanim_analizi.csv">
              <Button type="primary" icon={<DownloadOutlined />}>CSV İndir</Button>
            </CSVLink>
          </div>

          <Table
            columns={dynamicColumns}
            dataSource={filteredData}
            loading={isLoading}
            size="small"
            scroll={{ x: 800, y: 400 }}
            pagination={{ defaultPageSize: 5, showSizeChanger: true, showTotal: (total) => `Toplam ${total} kayıt` }}
          />
        </div>

        {/* Büyütülmüş Modal */}
        <Modal
          title="Yıllık Malzeme Kullanım Detaylı Analiz"
          centered
          open={isExpandedModalVisible}
          onCancel={() => setIsExpandedModalVisible(false)}
          width="95%"
          footer={null}
          destroyOnClose
        >
          <Table
            columns={dynamicColumns}
            dataSource={filteredData}
            size="middle"
            scroll={{ x: "max-content", y: "calc(100vh - 300px)" }}
            pagination={{ defaultPageSize: 20 }}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default MalzemeKullanimAnalizi;