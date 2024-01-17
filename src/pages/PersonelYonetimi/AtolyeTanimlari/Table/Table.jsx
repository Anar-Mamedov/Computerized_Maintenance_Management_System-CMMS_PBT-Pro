import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Table, Spin } from "antd";
import { CheckOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import dayjs from "dayjs";

export default function MainTable() {
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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
      const response = await AxiosInstance.get("AtolyeList?kulID=24");
      if (response) {
        const formattedData = response.map((item) => {
          return {
            ...item,
            key: item.TB_ATOLYE_ID,
            code: item.ATL_KOD,
            subject: item.ATL_TANIM,
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
    const filtered = data.filter((item) => normalizeString(item.subject).includes(normalizeString(searchTerm)));
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRowClick = (record) => {
    return {
      onClick: () => {
        // Handle row click event
        setDrawer({ visible: true, data: record });
      },
    };
  };

  const refreshTableData = useCallback(() => {
    fetchEquipmentData();
  }, []);

  const columns = [
    {
      title: "Atölye Kodu",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Atölye Tanımı",
      dataIndex: "subject",
      key: "subject",
    },
  ];

  return (
    <div>
      {/* Search input and create drawer */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}>
        <Input
          style={{ width: "250px" }}
          type="text"
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />
        <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
      </div>
      <Spin spinning={loading}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={searchTerm ? filteredData : data}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
            // pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
          }}
          onRow={onRowClick}
          scroll={{ y: "calc(100vh - 380px)" }}
        />
      </Spin>
      <EditDrawer
        selectedRow={drawer.data}
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })}
        drawerVisible={drawer.visible}
        onRefresh={refreshTableData}
      />
    </div>
  );
}
