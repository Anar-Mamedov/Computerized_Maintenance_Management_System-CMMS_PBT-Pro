import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Table, Spin } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import { SearchOutlined } from "@ant-design/icons";
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
      const response = await AxiosInstance.get("GetVardiyaList");
      if (response) {
        const formattedData = response.VARDIYA_LISTE.map((item) => {
          return {
            ...item,
            key: item.TB_VARDIYA_ID,
            VAR_TANIM: item.VAR_TANIM,
            VAR_LOKASYON_ID: item.VAR_LOKASYON_ID,
            VAR_LOKASYON: item.VAR_LOKASYON,
            VAR_PROJE_ID: item.VAR_PROJE_ID,
            VAR_PROJE: item.VAR_PROJE,
            VAR_ACIKLAMA: item.VAR_ACIKLAMA,
            VAR_BASLAMA_SAATI: item.VAR_BASLAMA_SAATI,
            VAR_BITIS_SAATI: item.VAR_BITIS_SAATI,
            VAR_MOLA_SURESI: item.VAR_MOLA_SURESI,
            VAR_VARDIYA_TIPI_KOD_ID: item.VAR_VARDIYA_TIPI_KOD_ID,
            VAR_VARDIYA_TIPI: item.VAR_VARDIYA_TIPI,
            VAR_VARSAYILAN: item.VAR_VARSAYILAN,
            VAR_RENK: item.VAR_RENK,
            VAR_OLUSTURAN_ID: item.VAR_OLUSTURAN_ID,
            VAR_OLUSTURMA_TARIH: item.VAR_OLUSTURMA_TARIH,
            VAR_DEGISTIREN_ID: item.VAR_DEGISTIREN_ID,
            VAR_DEGISTIRME_TARIH: item.VAR_DEGISTIRME_TARIH,
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
    const filtered = data.filter((item) => normalizeString(item.VAR_TANIM).includes(normalizeString(searchTerm)));
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
      title: "Vardiya Tanımı",
      dataIndex: "VAR_TANIM",
      key: "VAR_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Başlangıç Saati",
      dataIndex: "VAR_BASLAMA_SAATI",
      key: "VAR_BASLAMA_SAATI",
      width: 200,
      ellipsis: true,
      render: (time) => {
        // Prepend a default date. Here I use '1970-01-01' as an example.
        const dateTime = `1970-01-01 ${time}`;
        return dayjs(dateTime).format("HH:mm");
      },
    },
    {
      title: "Bitiş Saati",
      dataIndex: "VAR_BITIS_SAATI",
      key: "VAR_BITIS_SAATI",
      width: 200,
      ellipsis: true,
      render: (time) => {
        // Prepend a default date. Here I use '1970-01-01' as an example.
        const dateTime = `1970-01-01 ${time}`;
        return dayjs(dateTime).format("HH:mm");
      },
    },
    // {
    //   title: "Mola Süresi (dk)",
    //   dataIndex: "VAR_MOLA_SURESI",
    //   key: "VAR_MOLA_SURESI",
    //   width: 200,
    //   ellipsis: true,
    //   align: "center",
    //   render: (text) => {
    //     return <div style={{ textAlign: "right" }}>{text}</div>;
    //   },
    // },
    {
      title: "Lokasyon Bilgisi",
      dataIndex: "VAR_LOKASYON",
      key: "VAR_LOKASYON",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Proje Bilgisi",
      dataIndex: "VAR_PROJE",
      key: "VAR_PROJE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Vardiya Tipi",
      dataIndex: "VAR_VARDIYA_TIPI",
      key: "VAR_VARDIYA_TIPI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Varsayılan",
      dataIndex: "VAR_VARSAYILAN",
      key: "VAR_VARSAYILAN",
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        return record.VAR_VARSAYILAN ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CheckOutlined style={{ color: "green" }} />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CloseOutlined style={{ color: "red" }} />
          </div>
        );
      },
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
