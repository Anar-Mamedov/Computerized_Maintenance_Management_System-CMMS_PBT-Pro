import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Spin, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import Filters from "../components/Filters/Filters.jsx";
import AxiosInstance from "../../../../../api/http.jsx";
import RaporDetay from "./RaporDetay/RaporDetay.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

function RaporsTables({ tabKey, tabName }) {
  const { setValue, watch } = useFormContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isFirstModalVisible, setIsFirstModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null); // Yeni state

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`RaporListele?RaporGrupID=${tabKey}`);
      if (response) {
        const formattedData = response.map((item) => {
          return {
            ...item,
            key: item.TB_RAPOR_ID,
          };
        });
        setData(formattedData);
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
    }
  };

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  useEffect(() => {
    const filtered = data.filter((item) => normalizeString(item.RPR_TANIM).includes(normalizeString(searchTerm)));
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleRowClick = (record) => {
    setValue("locationIds", "");
    setValue("atolyeIds", "");
    setValue("baslangicTarihi", "");
    setValue("bitisTarihi", "");
    setValue("resetField", 2);
    setSelectedRowData(record); // Tıklanan satırın verilerini kaydet
    setIsFirstModalVisible(true);
  };

  const handleFirstModalOk = () => {
    setIsFirstModalVisible(false);
    setIsSecondModalVisible(true);
  };

  const handleSecondModalOk = () => {
    setIsSecondModalVisible(false);
    setValue("locationIds", "");
    setValue("atolyeIds", "");
    setValue("baslangicTarihi", "");
    setValue("bitisTarihi", "");
  };

  const handleSecondModalCancel = () => {
    setIsSecondModalVisible(false);
    setValue("locationIds", "");
    setValue("atolyeIds", "");
    setValue("baslangicTarihi", "");
    setValue("bitisTarihi", "");
  };

  const columns = [
    {
      title: "",
      dataIndex: "RPR_TANIM",
      key: "RPR_TANIM",
      width: 150,
      ellipsis: true,
      render: (text, record) => <a onClick={() => handleRowClick(record)}>{text}</a>,
    },
  ];

  const LokasyonId = watch("locationIds");
  const AtolyeId = watch("atolyeIds");
  const BaslangicTarih = watch("baslangicTarihi") ? dayjs(watch("baslangicTarihi")).format("DD/MM/YYYY") : null;
  const BitisTarih = watch("bitisTarihi") ? dayjs(watch("bitisTarihi")).format("DD/MM/YYYY") : null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}
      >
        <Text style={{ fontSize: "16px", fontWeight: 500 }}>{tabName}</Text>
        <Input
          style={{ width: "250px" }}
          type="text"
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={searchTerm ? filteredData : data}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            showTotal: (total, range) => `Toplam ${total}`,
            showQuickJumper: true,
          }}
          scroll={{ y: "calc(100vh - 380px)" }}
        />
      </Spin>
      <Modal title="Rapor İçin Filtreleme Yap" open={isFirstModalVisible} onOk={handleFirstModalOk} onCancel={() => setIsFirstModalVisible(false)}>
        <Filters />
      </Modal>
      <Modal
        title={
          selectedRowData
            ? `${selectedRowData.RPR_TANIM} - Lokasyon: ${LokasyonId ? LokasyonId : ""}, Atölye: ${AtolyeId ? AtolyeId : ""}, Başlangıç Tarihi: ${
                BaslangicTarih ? BaslangicTarih : ""
              }, Bitiş Tarihi: ${BitisTarih ? BitisTarih : ""}`
            : null
        }
        destroyOnClose
        width="1400px"
        open={isSecondModalVisible}
        onOk={handleSecondModalOk}
        onCancel={handleSecondModalCancel}
      >
        <RaporDetay selectedRowData={selectedRowData} />
      </Modal>
    </div>
  );
}

export default RaporsTables;
