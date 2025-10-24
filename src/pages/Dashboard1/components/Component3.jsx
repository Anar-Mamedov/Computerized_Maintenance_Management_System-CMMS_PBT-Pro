import React, { useState, useEffect, useMemo, useCallback } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Spin, Table, Typography } from "antd";
import { FallOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../api/http.jsx";
import EditDrawer from "../../Malzeme&DepoYonetimi/MalzemeTanimlari/Update/EditDrawer.jsx";

const { Text } = Typography;

function Component3(props) {
  const { watch, setValue } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const updateApi = watch("updateApi");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalSummary, setModalSummary] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedStockRow, setSelectedStockRow] = useState(null);
  const [tablePagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get("GetDashboardCards?ID=2");
      setData(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const fetchKritikStoklar = async () => {
    setIsModalLoading(true);
    try {
      const response = await AxiosInstance.get("GetKritikStoklar");
      const rows = response?.data || [];
      const summary = response?.ozet || null;
      setModalData(rows);
      setModalSummary(summary);
      setTablePagination((prev) => ({
        ...prev,
        total: rows.length,
      }));
    } catch (error) {
      console.error("Failed to fetch critical stock data:", error);
      setModalData([]);
      setModalSummary(null);
      setTablePagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setIsModalLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    setTablePagination((prev) => ({
      ...prev,
      current: 1,
    }));
    setModalSummary(null);
    setIsDrawerVisible(false);
    setSelectedStockRow(null);
    fetchKritikStoklar();
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsDrawerVisible(false);
    setSelectedStockRow(null);
  };

  const handleDrawerClose = useCallback(() => {
    setIsDrawerVisible(false);
    setSelectedStockRow(null);
  }, []);

  const handleStockDrawerOpen = useCallback((record) => {
    if (!record) return;
    const resolvedKey = record?.TB_STOK_ID ?? record?.STK_KOD;
    setSelectedStockRow({
      key: resolvedKey,
      ...record,
    });
    setIsDrawerVisible(true);
  }, []);

  const columns = useMemo(
    () => [
      /* {
        title: "Stok Kodu",
        dataIndex: "STK_KOD",
        key: "STK_KOD",
        width: 150,
        ellipsis: true,
      }, */
      {
        title: "Stok Tanım",
        dataIndex: "STK_TANIM",
        key: "STK_TANIM",
        width: 250,
        ellipsis: true,
        render: (text, record) => (
          <Text
            ellipsis={{ tooltip: text }}
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              handleStockDrawerOpen(record);
            }}
          >
            {text}
          </Text>
        ),
      },
      {
        title: "Tip",
        dataIndex: "STK_TIP",
        key: "STK_TIP",
        ellipsis: true,
        width: 100,
      },
      {
        title: "Birim",
        dataIndex: "STK_BIRIM",
        key: "STK_BIRIM",
        ellipsis: true,
        width: 100,
      },
      {
        title: "Min. Miktar",
        dataIndex: "STK_MIN_MIKTAR",
        key: "STK_MIN_MIKTAR",
        ellipsis: true,
        width: 100,
      },
      {
        title: "Max. Miktar",
        dataIndex: "STK_MAX_MIKTAR",
        key: "STK_MAX_MIKTAR",
        ellipsis: true,
        width: 100,
      },
      {
        title: "Mevcut Miktar",
        dataIndex: "STK_MIKTAR",
        key: "STK_MIKTAR",
        ellipsis: true,
        width: 100,
      },
      {
        title: "Kritik Miktar",
        dataIndex: "STK_KRITIK_STOK_MIKTAR",
        key: "STK_KRITIK_STOK_MIKTAR",
        ellipsis: true,
        width: 100,
      },
      {
        title: "Durum",
        dataIndex: "STK_DURUM",
        key: "STK_DURUM",
        ellipsis: true,
        width: 100,
      },
    ],
    [handleStockDrawerOpen]
  );

  const handleTableChange = (paginationInfo) => {
    setTablePagination((prev) => ({
      ...prev,
      current: paginationInfo?.current || prev.current,
      pageSize: paginationInfo?.pageSize || prev.pageSize,
    }));
  };

  const numberFormatter = useMemo(() => new Intl.NumberFormat("tr-TR"), []);

  const summaryItems =
    modalSummary !== null
      ? [
          {
            key: "total",
            label: "Toplam Kritik Stok",
            value: modalSummary?.toplamKritikStok,
            background: "linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)",
          },
          {
            key: "min",
            label: "Minimum Stok Sayısı",
            value: modalSummary?.minStokSayisi,
            background: "linear-gradient(135deg, #faad14 0%, #fadb14 100%)",
          },
          {
            key: "max",
            label: "Maksimum Stok Sayısı",
            value: modalSummary?.maxStokSayisi,
            background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
          },
        ]
      : [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "#fff" }} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={showModal}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontWeight: "500", fontSize: "35px", color: "white" }}>{data?.DUSUK_STOKLU_MALZEMELER !== undefined ? data.DUSUK_STOKLU_MALZEMELER : ""}</Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>Kritik Stoklar</Text>
          </div>
          <FallOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
        </div>
      )}

      <Modal
        width={1400}
        destroyOnClose
        centered
        title="Kritik Stoklar"
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        zIndex={900}
      >
        <Spin spinning={isModalLoading}>
          <Table
            columns={columns}
            dataSource={modalData}
            pagination={{
              ...tablePagination,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            rowKey={(record) => record?.TB_STOK_ID || `${record?.STK_KOD}-${record?.STK_STOK_DURUM}`}
            scroll={{ y: "calc(100vh - 415px)" }}
            bordered
            onChange={handleTableChange}
          />
          {summaryItems.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "14px",
              }}
            >
              {summaryItems.map((item) => (
                <div
                  key={item.key}
                  style={{
                    flex: "1 1 220px",
                    minWidth: "220px",
                    padding: "18px 20px",
                    borderRadius: "12px",
                    background: item.background,
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    boxShadow: "0 12px 25px rgba(15, 23, 42, 0.18)",
                  }}
                >
                  <Text style={{ fontSize: "13px", letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{item.label}</Text>
                  <Text style={{ fontSize: "28px", fontWeight: 700 }}>{typeof item.value === "number" ? numberFormatter.format(item.value) : "-"}</Text>
                </div>
              ))}
            </div>
          )}
        </Spin>
      </Modal>
      <EditDrawer selectedRow={selectedStockRow} drawerVisible={isDrawerVisible} onDrawerClose={handleDrawerClose} onRefresh={fetchKritikStoklar} />
    </div>
  );
}

export default Component3;
