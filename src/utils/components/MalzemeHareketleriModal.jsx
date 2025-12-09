import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Modal, Spin, Table, Tag, Typography, message } from "antd";
import AxiosInstance from "../../api/http";
import dayjs from "dayjs";
import Filters from "../../pages/SatinalmaYonetimi/MalzemeTalepleri/Update/components/SecondTabs/components/FisIcerigi/MalzemeHareketleri/filter/Filters";

const { Text } = Typography;

const defaultColumns = [
  {
    title: "G/C",
    dataIndex: "gc",
    key: "gc",
    width: 60,
    render: (value) => {
      if (value === "G") {
        return <Tag color="green">+</Tag>;
      }
      if (value === "C" || value === "T") {
        return <Tag color="red">-</Tag>;
      }
      return value;
    },
  },
  {
    title: "Malzeme Kodu",
    dataIndex: "makineKodu",
    key: "makineKodu",
    width: 150,
  },
  {
    title: "Malzeme Tanımı",
    dataIndex: "makineTanim",
    key: "makineTanim",
    width: 200,
    ellipsis: { showTitle: true },
  },
  {
    title: "Tarih",
    dataIndex: "tarih",
    key: "tarih",
    width: 120,
    render: (text) => (text ? new Date(text).toLocaleDateString("tr-TR") : ""),
  },
  {
    title: "Fiş No",
    dataIndex: "fisNo",
    key: "fisNo",
    width: 120,
  },
  {
    title: "Hareket Tipi",
    dataIndex: "hareketTipi",
    key: "hareketTipi",
    width: 120,
  },
  {
    title: "Depo",
    dataIndex: "depo",
    key: "depo",
    width: 200,
  },
  {
    title: "Firma",
    dataIndex: "firma",
    key: "firma",
    width: 150,
    render: (text) => text || "-",
  },
  {
    title: "Miktar",
    dataIndex: "miktar",
    key: "miktar",
    width: 100,
    align: "right",
  },
  {
    title: "Birim",
    dataIndex: "birim",
    key: "birim",
    width: 80,
  },
  {
    title: "Birim Fiyat",
    dataIndex: "birimFiyat",
    key: "birimFiyat",
    width: 120,
    align: "right",
    render: (text) => (text ? text.toFixed(2) : "0.00"),
  },
  {
    title: "Toplam",
    dataIndex: "toplam",
    key: "toplam",
    width: 120,
    align: "right",
    render: (text) => (text ? text.toFixed(2) : "0.00"),
  },
  {
    title: "İş Emri No",
    dataIndex: "isEmriNo",
    key: "isEmriNo",
    width: 150,
    render: (text) => text || "-",
  },
  {
    title: "Açıklama",
    dataIndex: "aciklama",
    key: "aciklama",
    width: 200,
    render: (text) => text || "-",
  },
  {
    title: "Firma Kodu",
    dataIndex: "firmaKodu",
    key: "firmaKodu",
    width: 150,
    render: (text) => text || "-",
  },
];

export default function MalzemeHareketleriModal({ stokId, stokKod, icon, iconColor, title, description, modalProps = {}, onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    basTarih: null,
    bitTarih: null,
    depoId: null,
    hareketTip: "",
  });
  const isMountedRef = useRef(true);

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

  const handleFiltersChange = useCallback((_, newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!stokId) {
      message.warning("Lütfen önce bir stok seçiniz.");
      return;
    }

    const basTarih = filters.basTarih ? dayjs(filters.basTarih).format("YYYY-MM-DD") : undefined;
    const bitTarih = filters.bitTarih ? dayjs(filters.bitTarih).format("YYYY-MM-DD") : undefined;

    const requestBody = {
      stokId: stokId,
      ...(basTarih ? { basTarih } : {}),
      ...(bitTarih ? { bitTarih } : {}),
      ...(filters.depoId ? { depoId: filters.depoId } : {}),
      ...(filters.hareketTip ? { hareketTip: filters.hareketTip } : {}),
    };

    setLoading(true);
    setError("");
    try {
      const response = await AxiosInstance.post("GetMalzemeHareketListesi", requestBody);
      const payload = Array.isArray(response?.data) ? response.data : [];
      if (isMountedRef.current) {
        setRows(payload);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setRows([]);
        setError("Malzeme hareketleri alınırken bir sorun oluştu.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [stokId, filters]);

  useEffect(() => {
    if (!open) {
      setRows([]);
      setError("");
      setFilters({
        basTarih: null,
        bitTarih: null,
        depoId: null,
        hareketTip: "",
      });
    }
  }, [open]);

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

      <Modal title={stokKod ? `${title || "Malzeme Hareketleri"} - ${stokKod}` : title || "Malzeme Hareketleri"} width={1200} open={open} onCancel={handleClose} footer={null} destroyOnClose {...modalProps}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stokKod && (
            <Text type="secondary">
              <span style={{ marginRight: 8 }}>Stok Kodu: {stokKod}</span>
            </Text>
          )}

          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Filters onChange={handleFiltersChange} />
            <Button type="primary" onClick={handleSearch}>
              Sorgula
            </Button>
          </div>

          {error && <Alert type="error" showIcon message={error} />}

          <Spin spinning={loading}>
            <Table
              columns={defaultColumns}
              dataSource={rows}
              rowKey={(record, index) => `${record.makineKodu}-${index}`}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                position: ["bottomRight"],
                showTotal: (total) => `Toplam ${total}`,
                showQuickJumper: true,
              }}
              scroll={{ y: 400 }}
              size="small"
            />
          </Spin>
        </div>
      </Modal>
    </>
  );
}
