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
      const response = await AxiosInstance.get("AtolyeList");
      if (response) {
        const formattedData = response.map((item) => {
          return {
            ...item,
            key: item.TB_ATOLYE_ID,
            ATL_KOD: item.ATL_KOD,
            ATL_TANIM: item.ATL_TANIM,
            ATL_TEL: item.ATL_TEL,
            ATL_YETKILI: item.ATL_YETKILI,
            ATL_DEGISTIRME_TARIH: item.ATL_DEGISTIRME_TARIH,
            ATL_DEGISTIREN_ID: item.ATL_DEGISTIREN_ID,
            ATL_OLUSTURMA_TARIH: item.ATL_OLUSTURMA_TARIH,
            ATL_OLUSTURAN_ID: item.ATL_OLUSTURAN_ID,
            ATL_ACIKLAMA: item.ATL_ACIKLAMA,
            ATL_AKTIF: item.ATL_AKTIF,
            ATL_ATOLYE_GRUP_ID: item.ATL_ATOLYE_GRUP_ID,
            ATL_YETKILI_MAIL: item.ATL_YETKILI_MAIL,
            ATL_GRUP_TANIM: item.ATL_GRUP_TANIM,
            ATL_RESIM: item.ATL_RESIM,
            ALT_BELGE: item.ALT_BELGE,
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
    const filtered = data.filter((item) => normalizeString(item.ATL_TANIM).includes(normalizeString(searchTerm)));
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
      dataIndex: "ATL_KOD",
      key: "ATL_KOD",
    },
    {
      title: "Atölye Tanımı",
      dataIndex: "ATL_TANIM",
      key: "ATL_TANIM",
    },
    {
      title: "Atölye Grup Tanımı",
      dataIndex: "ATL_GRUP_TANIM",
      key: "ATL_GRUP_TANIM",
    },
    {
      title: "Yetkili",
      dataIndex: "ATL_YETKILI",
      key: "ATL_YETKILI",
    },
    {
      title: "Telefon",
      dataIndex: "ATL_TEL",
      key: "ATL_TEL",
    },

    {
      title: "Açıklama",
      dataIndex: "ATL_ACIKLAMA",
      key: "ATL_ACIKLAMA",
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
