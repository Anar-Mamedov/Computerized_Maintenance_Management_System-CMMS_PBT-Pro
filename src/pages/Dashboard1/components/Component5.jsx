import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Modal, Typography, Spin, Table, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http.jsx";
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";
import MakineTablo from "./../../MakineEkipman/MakineTanim/Table/Table.jsx";
import AcikIsEmrirleri from "../../BakımVeArizaYonetimi/IsEmri/Table/ModalTable/ModalTable.jsx";
import EditDrawer from "../../Malzeme&DepoYonetimi/MalzemeTanimlari/Update/EditDrawer.jsx";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;
const DEFAULT_STATUS_FILTER = [0, 1];

function Component5(updateApi) {
  const { watch, setValue } = useFormContext();
  const kritikStokModalTrigger = watch("kritikStokModalVisible");
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [kritikModalVisible, setKritikModalVisible] = useState(false);
  const [kritikModalLoading, setKritikModalLoading] = useState(false);
  const [kritikModalData, setKritikModalData] = useState([]);
  const [kritikModalSummary, setKritikModalSummary] = useState(null);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedKritikRow, setSelectedKritikRow] = useState(null);
  const [kritikPagination, setKritikPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [kritikDurumTip, setKritikDurumTip] = useState("");
  const [kritikSearchTerm, setKritikSearchTerm] = useState("");
  const [kritikSortField, setKritikSortField] = useState(null);
  const [kritikSortOrder, setKritikSortOrder] = useState(null);
  const kritikSearchTimeout = useRef(null);

  useEffect(() => {
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
    fetchData();
  }, []);

  useEffect(() => {
    if (kritikStokModalTrigger) {
      showKritikModal();
      setValue("kritikStokModalVisible", false);
    }
  }, [kritikStokModalTrigger]);

  const showModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchKritikStoklar = useCallback(
    async (page, pageSize, searchTerm, durumTip, sortField, sortOrder) => {
      setKritikModalLoading(true);
      try {
        let url = `GetKritikStoklar?pagingDeger=${page}&pageSize=${pageSize}&prm=${encodeURIComponent(searchTerm || "")}`;
        if (durumTip) {
          url += `&durumTip=${durumTip}`;
        }
        if (sortField && sortOrder) {
          const normalizedOrder = sortOrder === "ascend" ? "ASC" : "DESC";
          url += `&sortField=${sortField}&sortOrder=${normalizedOrder}`;
        }
        const response = await AxiosInstance.get(url);
        const rows = response?.data || [];
        const summary = response?.ozet || null;
        setKritikModalData(rows);
        setKritikModalSummary(summary);
        setKritikPagination((prev) => ({
          ...prev,
          total: response?.kayit_sayisi || rows.length,
        }));
      } catch (error) {
        console.error("Failed to fetch critical stock data:", error);
        setKritikModalData([]);
        setKritikModalSummary(null);
        setKritikPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      } finally {
        setKritikModalLoading(false);
      }
    },
    []
  );

  const showKritikModal = () => {
    setKritikPagination((prev) => ({
      ...prev,
      current: 1,
      pageSize: 10,
    }));
    setKritikModalSummary(null);
    setEditDrawerVisible(false);
    setSelectedKritikRow(null);
    setKritikDurumTip("");
    setKritikSearchTerm("");
    setKritikSortField(null);
    setKritikSortOrder(null);
    setKritikModalVisible(true);
    fetchKritikStoklar(1, 10, "", "", null, null);
  };

  const handleKritikModalClose = () => {
    setKritikModalVisible(false);
    setEditDrawerVisible(false);
    setSelectedKritikRow(null);
  };

  const handleKritikTableChange = (paginationInfo, _filters, sorter) => {
    const nextPage = paginationInfo?.current || kritikPagination.current;
    const nextPageSize = paginationInfo?.pageSize || kritikPagination.pageSize;
    let nextSortField = kritikSortField;
    let nextSortOrder = kritikSortOrder;

    if (sorter && (sorter.field || sorter.columnKey)) {
      if (sorter.order) {
        nextSortField = sorter.field || sorter.columnKey;
        nextSortOrder = sorter.order;
      } else {
        nextSortField = null;
        nextSortOrder = null;
      }
    }

    setKritikPagination((prev) => ({
      ...prev,
      current: nextPage,
      pageSize: nextPageSize,
    }));
    setKritikSortField(nextSortField);
    setKritikSortOrder(nextSortOrder);
    fetchKritikStoklar(nextPage, nextPageSize, kritikSearchTerm, kritikDurumTip, nextSortField, nextSortOrder);
  };

  const handleDurumTipChange = (value) => {
    setKritikDurumTip(value);
    setKritikPagination((prev) => ({ ...prev, current: 1 }));
    fetchKritikStoklar(1, kritikPagination.pageSize, kritikSearchTerm, value, kritikSortField, kritikSortOrder);
  };

  const handleKritikSearch = (value) => {
    setKritikSearchTerm(value);
    if (kritikSearchTimeout.current) {
      clearTimeout(kritikSearchTimeout.current);
    }
    kritikSearchTimeout.current = setTimeout(() => {
      setKritikPagination((prev) => ({ ...prev, current: 1 }));
      fetchKritikStoklar(1, kritikPagination.pageSize, value, kritikDurumTip, kritikSortField, kritikSortOrder);
    }, 500);
  };

  const handleEditDrawerClose = useCallback(() => {
    setEditDrawerVisible(false);
    setSelectedKritikRow(null);
  }, []);

  const handleEditDrawerOpen = useCallback((record) => {
    if (!record) return;
    const resolvedKey = record?.TB_STOK_ID ?? record?.STK_KOD;
    setSelectedKritikRow({
      key: resolvedKey,
      ...record,
    });
    setEditDrawerVisible(true);
  }, []);

  const kritikColumns = useMemo(
    () => [
      {
        title: "Stok Tanım",
        dataIndex: "STK_TANIM",
        key: "STK_TANIM",
        width: 250,
        ellipsis: true,
        sorter: true,
        render: (text, record) => (
          <Text
            ellipsis={{ tooltip: text }}
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              handleEditDrawerOpen(record);
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
        sorter: true,
      },
      {
        title: "Birim",
        dataIndex: "STK_BIRIM",
        key: "STK_BIRIM",
        ellipsis: true,
        width: 100,
        sorter: true,
      },
      {
        title: "Min. Miktar",
        dataIndex: "STK_MIN_MIKTAR",
        key: "STK_MIN_MIKTAR",
        ellipsis: true,
        width: 100,
        sorter: true,
      },
      {
        title: "Max. Miktar",
        dataIndex: "STK_MAX_MIKTAR",
        key: "STK_MAX_MIKTAR",
        ellipsis: true,
        width: 100,
        sorter: true,
      },
      {
        title: "Mevcut Miktar",
        dataIndex: "STK_MIKTAR",
        key: "STK_MIKTAR",
        ellipsis: true,
        width: 100,
        sorter: true,
      },
      {
        title: "Kritik Miktar",
        dataIndex: "STK_KRITIK_STOK_MIKTAR",
        key: "STK_KRITIK_STOK_MIKTAR",
        ellipsis: true,
        width: 100,
        sorter: true,
      },
      {
        title: "Durum",
        dataIndex: "STK_DURUM",
        key: "STK_DURUM",
        ellipsis: true,
        width: 100,
      },
    ],
    [handleEditDrawerOpen]
  );

  const kritikNumberFormatter = useMemo(() => new Intl.NumberFormat("tr-TR"), []);

  const kritikSummaryItems =
    kritikModalSummary !== null
      ? [
          {
            key: "total",
            label: "Toplam Kritik Stok",
            value: kritikModalSummary?.toplamKritikStok,
            background: "linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)",
          },
          {
            key: "min",
            label: "Minimum Stok Sayısı",
            value: kritikModalSummary?.minStokSayisi,
            background: "linear-gradient(135deg, #faad14 0%, #fadb14 100%)",
          },
          {
            key: "max",
            label: "Maksimum Stok Sayısı",
            value: kritikModalSummary?.maxStokSayisi,
            background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
          },
        ]
      : [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #f0f0f0",
      }}
    >
      <div style={{ padding: "10px" }}>
        <Text style={{ fontWeight: "500", fontSize: "17px" }}>Özet Durum</Text>
      </div>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <div
            onClick={() => showModal("Devam Eden İş Talepleri", <ModalTablo />)}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "blue",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Devam Eden İş Talepleri </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "rgb(0 0 255 / 35%)", // blue with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "blue",
              }}
            >
              {data?.DEVAM_EDEN_IS_TALEPLERI !== undefined ? data.DEVAM_EDEN_IS_TALEPLERI : ""}
            </Text>
          </div>
          <div
            onClick={() => showModal("Bekleyen İş Talepleri", <ModalTablo defaultStatusKeys={DEFAULT_STATUS_FILTER} />)}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "purple",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Bekleyen İş Talepleri </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "rgba(128, 0, 128, 0.2)", // purple with 20% opacity
                padding: "0px 5px 0px 5px",
                color: "purple",
              }}
            >
              {data?.BEKLEYEN_IS_TALEPLERI !== undefined ? data.BEKLEYEN_IS_TALEPLERI : ""}
            </Text>
          </div>
          <div
            onClick={() => showModal("Açık İş Emirleri", <AcikIsEmrirleri />)}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "green",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Açık İş Emirleri </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "#C8F4DD", // green with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "green",
              }}
            >
              {data?.ACIK_IS_EMIRLERI !== undefined ? data.ACIK_IS_EMIRLERI : ""}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
            onClick={showKritikModal}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Kritik Stoklar </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "#ff000078", // red with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "red",
              }}
            >
              {data?.DUSUK_STOKLU_MALZEMELER !== undefined ? data.DUSUK_STOKLU_MALZEMELER : ""}
            </Text>
          </div>
          <div
            onClick={() => showModal("Makineler", <MakineTablo />)}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "orange",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Toplam Makine Sayısı </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "rgba(255, 165, 0, 0.35)", // orange with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "#b57500",
              }}
            >
              {data?.MAKINE_SAYISI !== undefined ? data.MAKINE_SAYISI : ""}
            </Text>
          </div>
        </div>
      )}
      <Modal width="90%" centered destroyOnClose title={modalTitle} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div>{modalContent}</div>
      </Modal>
      <Modal
        width={1400}
        destroyOnClose
        centered
        title="Kritik Stoklar"
        open={kritikModalVisible}
        onOk={handleKritikModalClose}
        onCancel={handleKritikModalClose}
        zIndex={900}
      >
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
            <Input
              style={{ width: "250px" }}
              placeholder="Arama yap..."
              value={kritikSearchTerm}
              onChange={(e) => handleKritikSearch(e.target.value)}
              prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
              allowClear
            />
            <Select
              style={{ width: "120px" }}
              value={kritikDurumTip}
              onChange={handleDurumTipChange}
              options={[
                { value: "", label: "Tümü" },
                { value: "MAX", label: "Max." },
                { value: "MIN", label: "Min." },
              ]}
            />
          </div>
          <Table
            columns={kritikColumns}
            dataSource={kritikModalData}
            pagination={{
              ...kritikPagination,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            rowKey={(record) => record?.TB_STOK_ID || `${record?.STK_KOD}-${record?.STK_STOK_DURUM}`}
            scroll={{ y: "calc(100vh - 415px)" }}
            bordered
            onChange={handleKritikTableChange}
            loading={kritikModalLoading}
          />
          {kritikSummaryItems.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "14px",
              }}
            >
              {kritikSummaryItems.map((item) => (
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
                  <Text style={{ fontSize: "28px", fontWeight: 700 }}>{typeof item.value === "number" ? kritikNumberFormatter.format(item.value) : "-"}</Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
      <EditDrawer
        selectedRow={selectedKritikRow}
        drawerVisible={editDrawerVisible}
        onDrawerClose={handleEditDrawerClose}
        onRefresh={() => fetchKritikStoklar(kritikPagination.current, kritikPagination.pageSize, kritikSearchTerm, kritikDurumTip, kritikSortField, kritikSortOrder)}
      />
    </div>
  );
}

export default Component5;
