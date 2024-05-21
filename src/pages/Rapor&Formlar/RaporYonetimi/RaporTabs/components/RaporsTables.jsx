import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Spin, Table, Typography } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../api/http.jsx";

const { Text } = Typography;

function RaporsTables({ tabKey, tabName }) {
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(
        `RaporListele?RaporGrupID=${tabKey}`
      );
      if (response) {
        const formattedData = response.map((item) => {
          return {
            ...item,
            key: item.TB_RAPOR_ID,
          };
        });
        setData(formattedData); // Directly set the data
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
    const filtered = data.filter((item) =>
      normalizeString(item.RPR_TANIM).includes(normalizeString(searchTerm))
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }

    // Seçilen satırların verisini bul
    const newSelectedRows = data.filter((row) =>
      newSelectedRowKeys.includes(row.key)
    );
    setSelectedRows(newSelectedRows); // Seçilen satırların verilerini state'e ata
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const refreshTableData = useCallback(() => {
    fetchEquipmentData();
  }, []);

  const columns = [
    {
      title: "",
      dataIndex: "RPR_TANIM",
      key: "RPR_TANIM",
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <a onClick={() => setDrawer({ visible: true, data: record })}>{text}</a>
      ),
    },
    // {
    //   title: "Özel Alan 10",
    //   dataIndex: "PBK_OZEL_ALAN_10",
    //   key: "PBK_OZEL_ALAN_10",
    //   width: 150,
    //   ellipsis: true,
    // },
    // Other columns...
  ];

  return (
    <div>
      {/* Search input and create drawer */}
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
          // rowSelection={rowSelection}
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
    </div>
  );
}

export default RaporsTables;
