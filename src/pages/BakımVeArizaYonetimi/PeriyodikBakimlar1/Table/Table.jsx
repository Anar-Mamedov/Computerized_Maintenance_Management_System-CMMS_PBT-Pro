import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Table, Spin } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import dayjs from "dayjs";
import ContextMenu from "../components/ContextMenu/ContextMenu";

export default function MainTable() {
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
      const response = await AxiosInstance.get("PeriyodikBakimList");
      if (response) {
        const formattedData = response.map((item) => {
          return {
            ...item,
            key: item.TB_PERIYODIK_BAKIM_ID,
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
      normalizeString(item.PBK_TANIM).includes(normalizeString(searchTerm))
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
      title: "Bakım Kod",
      dataIndex: "PBK_KOD",
      key: "PBK_KOD",
      width: 150,
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Bakım Tanım",
      dataIndex: "PBK_TANIM",
      key: "PBK_TANIM",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Aktif",
      dataIndex: "PBK_AKTIF",
      key: "PBK_AKTIF",
      width: 100,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      align: "center",
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? (
            <CheckOutlined style={{ color: "green" }} />
          ) : (
            <CloseOutlined style={{ color: "red" }} />
          )}
        </div>
      ),
    },

    {
      title: "Bakım Tip",
      dataIndex: "PBK_TIP",
      key: "PBK_TIP",
      width: 250,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Bakım Grup",
      dataIndex: "PBK_GRUP",
      key: "PBK_GRUP",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Atölye",
      dataIndex: "PBK_ATOLYE",
      key: "PBK_ATOLYE",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Lokasyon",
      dataIndex: "PBK_LOKASYON",
      key: "PBK_LOKASYON",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Öncelik",
      dataIndex: "PBK_ONCELIK",
      key: "PBK_ONCELIK",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Talimat",
      dataIndex: "PBK_TALIMAT",
      key: "PBK_TALIMAT",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "PBK_CALISMA_SURE",
      key: "PBK_CALISMA_SURE",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Duruş Süresi (dk.)",
      dataIndex: "PBK_DURUS_SURE",
      key: "PBK_DURUS_SURE",
      width: 170,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Personel Sayısı (kişi)",
      dataIndex: "PBK_PERSONEL_SAYI",
      key: "PBK_PERSONEL_SAYI",
      width: 170,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Özel Alan 1",
      dataIndex: "PBK_OZEL_ALAN_1",
      key: "PBK_OZEL_ALAN_1",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 2",
      dataIndex: "PBK_OZEL_ALAN_2",
      key: "PBK_OZEL_ALAN_2",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 3",
      dataIndex: "PBK_OZEL_ALAN_3",
      key: "PBK_OZEL_ALAN_3",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 4",
      dataIndex: "PBK_OZEL_ALAN_4",
      key: "PBK_OZEL_ALAN_4",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 5",
      dataIndex: "PBK_OZEL_ALAN_5",
      key: "PBK_OZEL_ALAN_5",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 6",
      dataIndex: "PBK_OZEL_ALAN_6",
      key: "PBK_OZEL_ALAN_6",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 7",
      dataIndex: "PBK_OZEL_ALAN_7",
      key: "PBK_OZEL_ALAN_7",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 8",
      dataIndex: "PBK_OZEL_ALAN_8",
      key: "PBK_OZEL_ALAN_8",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 9",
      dataIndex: "PBK_OZEL_ALAN_9",
      key: "PBK_OZEL_ALAN_9",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 10",
      dataIndex: "PBK_OZEL_ALAN_10",
      key: "PBK_OZEL_ALAN_10",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    // Other columns...
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
        }}
      >
        <Input
          style={{ width: "250px" }}
          type="text"
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <ContextMenu
            selectedRows={selectedRows}
            refreshTableData={refreshTableData}
          />
          <CreateDrawer
            selectedLokasyonId={selectedRowKeys[0]}
            onRefresh={refreshTableData}
          />
        </div>
      </div>
      <Spin spinning={loading}>
        <Table
          rowSelection={rowSelection}
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
