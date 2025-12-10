import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Modal, Spin, Table, Typography, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";

const { Text } = Typography;

const defaultColumns = [
  {
    title: "Malzeme Kodu",
    dataIndex: "malzemeKodu",
    key: "malzemeKodu",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Malzeme Tanımı",
    dataIndex: "malzemeTanimi",
    key: "malzemeTanimi",
    width: 250,
    ellipsis: true,
  },
  {
    title: "Malzeme Tipi",
    dataIndex: "malzemeTipi",
    key: "malzemeTipi",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Malzeme Grubu",
    dataIndex: "malzemeGrubu",
    key: "malzemeGrubu",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Marka",
    dataIndex: "malzemeMarka",
    key: "malzemeMarka",
    width: 120,
    ellipsis: true,
  },
  {
    title: "Model",
    dataIndex: "malzemeModel",
    key: "malzemeModel",
    width: 120,
    ellipsis: true,
  },
  {
    title: "Giren Miktar",
    dataIndex: "girenMiktar",
    key: "girenMiktar",
    width: 110,
    align: "right",
  },
  {
    title: "Çıkan Miktar",
    dataIndex: "cikanMiktar",
    key: "cikanMiktar",
    width: 110,
    align: "right",
  },
  {
    title: "Miktar",
    dataIndex: "miktar",
    key: "miktar",
    width: 100,
    align: "right",
  },
  {
    title: "Kullanılabilir Miktar",
    dataIndex: "kullanilabilirMiktar",
    key: "kullanilabilirMiktar",
    width: 140,
    align: "right",
  },
  {
    title: "Birim",
    dataIndex: "birim",
    key: "birim",
    width: 100,
  },
  {
    title: "Sınıf",
    dataIndex: "malzemeSinifi",
    key: "malzemeSinifi",
    width: 120,
    ellipsis: true,
  },
  {
    title: "Üretici Kod",
    dataIndex: "ureticiKod",
    key: "ureticiKod",
    width: 150,
    ellipsis: true,
  },
];

export default function DepoStokDurumlariModal({ depoId, depoKod, icon, iconColor, title, description, modalProps = {}, onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleOpen = useCallback(() => {
    if (!depoId) return;
    onOpenModal?.();
    setOpen(true);
  }, [onOpenModal, depoId]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const fetchData = useCallback(
    async (searchText = "") => {
      if (!depoId) return;
      const currentRequestId = requestIdRef.current + 1;
      requestIdRef.current = currentRequestId;
      setLoading(true);
      setError("");
      try {
        const response = await AxiosInstance.get(`GetDepoStokDurumlari?depoId=${depoId}&pagingDeger=${currentPage}&pageSize=${pageSize}&prm=${searchText}`);

        if (isMountedRef.current && requestIdRef.current === currentRequestId) {
          const payload = response?.data || [];
          const parsedRows = payload.map((item, index) => ({
            ...item,
            key: item?.depoStokId ?? `${item?.stokId || "item"}-${index}`,
          }));
          setRows(parsedRows);
          setTotalCount(response?.kayit_sayisi || 0);
        }
      } catch (err) {
        if (isMountedRef.current && requestIdRef.current === currentRequestId) {
          setRows([]);
          setError("Depo stok durumları alınırken bir sorun oluştu.");
        }
      } finally {
        if (isMountedRef.current && requestIdRef.current === currentRequestId) {
          setLoading(false);
        }
      }
    },
    [depoId, currentPage, pageSize]
  );

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  useEffect(() => {
    if (!open) {
      setRows([]);
      setError("");
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [open]);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(searchTerm);
  };

  const isDisabled = !depoId;

  return (
    <>
      <div
        onClick={isDisabled ? undefined : handleOpen}
        className="menu-item-hover"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          padding: "10px 12px",
          transition: "background-color 0.3s",
          width: "100%",
          opacity: isDisabled ? 0.5 : 1,
        }}
        onMouseEnter={(e) => !isDisabled && (e.currentTarget.style.backgroundColor = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <div>{icon && <span style={{ color: iconColor, fontSize: "18px", marginTop: "4px" }}>{icon}</span>}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {title && <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>{title}</span>}
          {description && <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>{description}</span>}
        </div>
      </div>

      <Modal title={title || "Depo Stok Durumları"} width={1400} open={open} onCancel={handleClose} footer={null} destroyOnClose {...modalProps}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {depoKod && (
            <Text type="secondary">
              <span style={{ marginRight: 8 }}>Depo Kodu: {depoKod}</span>
            </Text>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Input placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onPressEnter={handleSearch} style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Ara
            </Button>
          </div>

          {error && <Alert type="error" showIcon message={error} />}

          <Spin spinning={loading}>
            <Table
              columns={defaultColumns}
              dataSource={rows}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalCount,
                showSizeChanger: true,
                showTotal: (total) => `Toplam ${total} kayıt`,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              onChange={handleTableChange}
              scroll={{ x: 1800, y: 400 }}
              size="small"
            />
          </Spin>
        </div>
      </Modal>
    </>
  );
}
