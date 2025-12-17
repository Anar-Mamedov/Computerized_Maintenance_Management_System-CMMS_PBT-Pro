import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Modal, Spin, Table, Typography } from "antd";
import AxiosInstance from "../../api/http";

const { Text } = Typography;

const defaultColumns = [
  {
    title: "Makine Kodu",
    dataIndex: "MKN_KOD",
    key: "MKN_KOD",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Makine Tanımı",
    dataIndex: "MKN_TANIM",
    key: "MKN_TANIM",
    ellipsis: true,
  },
  {
    title: "Lokasyon",
    dataIndex: "LOK_TANIM",
    key: "LOK_TANIM",
    width: 200,
    ellipsis: true,
  },
  {
    title: "Miktar",
    dataIndex: "MIKTAR",
    key: "MIKTAR",
    width: 100,
    align: "center",
  },
];

export default function KullanilanMakinelerModal({ stokId, stokKod, icon, iconColor, title, description, modalProps = {}, onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleOpen = useCallback(() => {
    if (!stokId) return;
    onOpenModal?.();
    setOpen(true);
  }, [onOpenModal, stokId]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const fetchData = useCallback(async () => {
    if (!stokId) return;
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;
    setLoading(true);
    setError("");
    try {
      const response = await AxiosInstance.get(`GetStokMakineKullanim?stokID=${stokId}`);
      const payload = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const parsedRows = payload.map((item, index) => ({
        ...item,
        key: item?.MKN_KOD ? `${item.MKN_KOD}-${index}` : `makine-${index}`,
      }));
      if (isMountedRef.current && requestIdRef.current === currentRequestId) {
        setRows(parsedRows);
      }
    } catch (err) {
      if (isMountedRef.current && requestIdRef.current === currentRequestId) {
        setRows([]);
        setError("Makine kullanım bilgileri alınırken bir sorun oluştu.");
      }
    } finally {
      if (isMountedRef.current && requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  }, [stokId]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  useEffect(() => {
    if (!open) {
      setRows([]);
      setError("");
    }
  }, [open, stokId]);

  return (
    <>
      <div
        onClick={!stokId ? undefined : handleOpen}
        className="menu-item-hover"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: stokId ? "pointer" : "not-allowed",
          padding: "10px 12px",
          transition: "background-color 0.3s",
          width: "100%",
          opacity: stokId ? 1 : 0.5,
        }}
        onMouseEnter={(e) => stokId && (e.currentTarget.style.backgroundColor = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <div>{icon && <span style={{ color: iconColor, fontSize: "18px", marginTop: "4px" }}>{icon}</span>}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {title && <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>{title}</span>}
          {description && <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>{description}</span>}
        </div>
      </div>

      <Modal title={title || "Kullanılan Makineler"} width={900} open={open} onCancel={handleClose} footer={null} destroyOnClose {...modalProps}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(stokKod || stokId) && (
            <Text type="secondary">
              {stokKod && <span style={{ marginRight: 8 }}>Stok Kodu: {stokKod}</span>}
            </Text>
          )}

          {error && <Alert type="error" showIcon message={error} />}

          <Spin spinning={loading}>
            <Table columns={defaultColumns} dataSource={rows} pagination={false} scroll={{ y: 400 }} size="small" />
          </Spin>
        </div>
      </Modal>
    </>
  );
}
