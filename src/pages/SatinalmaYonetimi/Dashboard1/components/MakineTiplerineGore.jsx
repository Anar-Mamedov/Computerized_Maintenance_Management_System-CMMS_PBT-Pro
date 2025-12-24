import React, { useEffect, useState } from "react";
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
import jsPDF from "jspdf";
import "jspdf-autotable";
import customFontBase64 from "./RobotoBase64.js";
import { CSVLink } from "react-csv";

const { Text } = Typography;

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

function TeslimAlinmamisSiparisler() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false);

  const columns = [
    {
      title: "Sipariş No",
      dataIndex: "Sipariş No",
      key: "siparisNo",
      width: 120,
    },
    {
      title: "Tedarikçi",
      dataIndex: "Tedarikçi",
      key: "tedarikci",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Sipariş Tarihi",
      dataIndex: "Sipariş Tarihi",
      key: "siparisTarihi",
      width: 120,
    },
    {
      title: "Planlanan Teslim",
      dataIndex: "Planlanan Teslim Tarihi",
      key: "planlananTeslim",
      width: 130,
    },
    {
      title: "Durum",
      dataIndex: "Teslim Durumu",
      key: "teslimDurumu",
      width: 150,
      render: (text) => {
        const isGecikme = text.toLowerCase().includes("gecikti");
        return <Text type={isGecikme ? "danger" : "success"}>{text}</Text>;
      },
    },
    {
      title: "Tutar",
      dataIndex: "Sipariş Tutarı",
      key: "siparisTutari",
      width: 100,
      align: "right",
      render: (text) => `${text} ₺`,
    },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`getTeslimAlinmamisSiparisler`);
      const resData = response.data || [];
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const normalizedSearch = normalizeText(value).toLowerCase();
    
    if (value) {
      const filtered = data.filter((item) =>
        Object.values(item).some((val) =>
          normalizeText(val).toLowerCase().includes(normalizedSearch)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", customFontBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    const head = [["No", "Tedarikçi", "S.Tarihi", "P.Teslim", "Durum", "Tutar"]];
    const body = filteredData.map((item) => [
      item["Sipariş No"],
      item["Tedarikçi"],
      item["Sipariş Tarihi"],
      item["Planlanan Teslim Tarihi"],
      item["Teslim Durumu"],
      item["Sipariş Tutarı"],
    ]);

    doc.autoTable({ head, body, styles: { font: "Roboto" } });
    doc.save("teslim_alinmamis_siparisler.pdf");
  };

  const csvHeaders = columns.map((col) => ({
    label: col.title,
    key: col.dataIndex,
  }));

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ cursor: "pointer" }} onClick={() => setIsExpandedModalVisible(true)}>Büyüt</div>
      <div style={{ cursor: "pointer" }} onClick={downloadPDF}>PDF İndir</div>
      <div style={{ cursor: "pointer" }} onClick={fetchData}>Yenile</div>
    </div>
  );

  return (
    <ConfigProvider locale={trTR}>
      <div style={{ width: "100%", height: "100%", borderRadius: "5px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #f0f0f0" }}>
        <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text strong style={{ fontSize: "16px" }}>Teslim Alınmamış Siparişler</Text>
          <Popover placement="bottom" content={content} trigger="click">
            <Button type="text" icon={<MoreOutlined />} />
          </Popover>
        </div>

        <div style={{ padding: "0 10px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Input placeholder="Sipariş veya tedarikçi ara..." value={searchTerm} onChange={handleSearch} style={{ width: "250px" }} />
            <CSVLink data={filteredData} headers={csvHeaders} filename="teslim_alinmamis_siparisler.csv">
              <Button type="primary" icon={<DownloadOutlined />}>CSV İndir</Button>
            </CSVLink>
          </div>

          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={filteredData}
              size="small"
              pagination={{ defaultPageSize: 5, showSizeChanger: true }}
              scroll={{ y: 400 }}
            />
          </Spin>
        </div>

        <Modal
          title="Teslim Alınmamış Sipariş Detaylı Liste"
          centered
          open={isExpandedModalVisible}
          onCancel={() => setIsExpandedModalVisible(false)}
          width="95%"
          footer={null}
          destroyOnClose
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ defaultPageSize: 20 }}
            scroll={{ y: "calc(100vh - 350px)" }}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default TeslimAlinmamisSiparisler;