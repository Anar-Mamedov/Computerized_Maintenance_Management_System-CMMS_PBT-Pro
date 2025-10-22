import React, { useEffect, useMemo, useState } from "react";
import { Modal, Typography, Spin, Table } from "antd";
import AxiosInstance from "../../../api/http.jsx";
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";
import MakineTablo from "./../../MakineEkipman/MakineTanim/Table/Table.jsx";
import AcikIsEmrirleri from "../../BakımVeArizaYonetimi/IsEmri/Table/ModalTable/ModalTable.jsx";

const { Text } = Typography;
const DEFAULT_STATUS_FILTER = [0, 1];

function Component5(updateApi) {
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [kritikModalVisible, setKritikModalVisible] = useState(false);
  const [kritikModalLoading, setKritikModalLoading] = useState(false);
  const [kritikModalData, setKritikModalData] = useState([]);
  const [kritikPagination, setKritikPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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

  const kritikColumns = useMemo(
    () => [
      {
        title: "Stok Tanım",
        dataIndex: "STK_TANIM",
        key: "STK_TANIM",
        width: 250,
        ellipsis: true,
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
    []
  );

  const fetchKritikStoklar = async () => {
    setKritikModalLoading(true);
    try {
      const response = await AxiosInstance.get("GetKritikStoklar");
      const rows = response?.data || [];
      setKritikModalData(rows);
      setKritikPagination((prev) => ({
        ...prev,
        total: rows.length,
      }));
    } catch (error) {
      console.error("Failed to fetch critical stock data:", error);
      setKritikModalData([]);
      setKritikPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setKritikModalLoading(false);
    }
  };

  const showKritikModal = () => {
    setKritikPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    setKritikModalVisible(true);
    fetchKritikStoklar();
  };

  const handleKritikModalClose = () => {
    setKritikModalVisible(false);
  };

  const handleKritikTableChange = (paginationInfo) => {
    setKritikPagination((prev) => ({
      ...prev,
      current: paginationInfo?.current || prev.current,
      pageSize: paginationInfo?.pageSize || prev.pageSize,
    }));
  };

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
      <Modal width={1400} destroyOnClose centered title="Kritik Stoklar" open={kritikModalVisible} onOk={handleKritikModalClose} onCancel={handleKritikModalClose}>
        <div style={{ flex: 1, minHeight: 0 }}>
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
        </div>
      </Modal>
    </div>
  );
}

export default Component5;
