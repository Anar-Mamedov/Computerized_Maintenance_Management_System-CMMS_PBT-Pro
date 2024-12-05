import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../api/http";
import { Table, Tag, Input, Button, message } from "antd";
import { useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";

function AtolyeYetkisi() {
  const { watch } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const currentUserId = watch("siraNo");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`GetAtolyeYetki?id=${currentUserId}`);
      if (response) {
        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.map((item) => ({
          ...item,
          key: item.KAT_ATOLYE_ID,
          // Diğer alanlarınız...
        }));
        setData(formattedData);
        setOriginalData(formattedData); // Orijinal veriyi sakla
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
        setLoading(false);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchData();
    }
  }, [currentUserId]);

  // Arama fonksiyonu
  const onSearch = () => {
    if (searchText) {
      const filteredData = originalData.filter((item) => item.KAT_ATOLYE && item.KAT_ATOLYE.toLowerCase().includes(searchText.toLowerCase()));
      setData(filteredData);
    } else {
      setData(originalData);
    }
  };

  // Function to update KAT_GOR value in the data tree
  const updateDataKLT_GOR = (dataArray, KAT_ATOLYE_ID, newKLT_GOR) => {
    return dataArray.map((item) => {
      if (item.KAT_ATOLYE_ID === KAT_ATOLYE_ID) {
        return { ...item, KAT_GOR: newKLT_GOR };
      } else if (item.children) {
        return { ...item, children: updateDataKLT_GOR(item.children, KAT_ATOLYE_ID, newKLT_GOR) };
      } else {
        return item;
      }
    });
  };

  // Handler for toggling KAT_GOR
  const handleToggleKLT_GOR = async (record) => {
    const newKLT_GOR = !record.KAT_GOR;
    const requestData = {
      KAT_KULLANICI_ID: record.KAT_KULLANICI_ID,
      KAT_ATOLYE_ID: record.KAT_ATOLYE_ID,
      KAT_GOR: newKLT_GOR,
    };

    try {
      const response = await AxiosInstance.post("UpdateAtolyeYetki", requestData);
      if (response.status_code === 202) {
        // Update the state to reflect the change
        const updatedData = updateDataKLT_GOR(data, record.KAT_ATOLYE_ID, newKLT_GOR);
        setData(updatedData);
        message.success("İşlem Başarılı");
      } else {
        message.error("İşlem Başarısız");
      }
    } catch (error) {
      console.error("Error updating KAT_GOR:", error);
      message.error("İşlem Başarısız");
    }
  };

  const columns = [
    {
      title: "Atolye",
      dataIndex: "KAT_ATOLYE",
      key: "KAT_ATOLYE",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Gör",
      dataIndex: "KAT_GOR",
      key: "KAT_GOR",
      width: 80,
      ellipsis: true,
      render: (text, record) => (
        <Tag color={record.KAT_GOR ? "red" : "gray"} onClick={() => handleToggleKLT_GOR(record)} style={{ cursor: "pointer" }}>
          {record.KAT_GOR ? "Gör" : "Görme"}
        </Tag>
      ),
    },
    // Diğer kolonlarınızı ekleyin...
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Input placeholder="Ara" value={searchText} onChange={(e) => setSearchText(e.target.value)} onPressEnter={onSearch} style={{ width: 200, marginRight: 8 }} />
        <Button type="primary" onClick={onSearch} icon={<SearchOutlined />}>
          Ara
        </Button>
      </div>
      <Table loading={loading} columns={columns} dataSource={data} scroll={{ y: "calc(100vh - 300px)" }} rowKey="KAT_ATOLYE_ID" pagination={true} />
    </div>
  );
}

export default AtolyeYetkisi;
