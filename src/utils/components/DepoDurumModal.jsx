import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Modal, Spin, Table, Typography } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";

const { Text } = Typography;

const defaultColumns = [
  {
    title: "Depo Tanımı",
    dataIndex: "depoTanim",
    key: "depoTanim",
    ellipsis: true,
  },
  {
    title: "Üretici Kod",
    dataIndex: "ureticiKod",
    key: "ureticiKod",
    ellipsis: true,
  },
  {
    title: "Giren Miktar",
    dataIndex: "girenMiktar",
    key: "girenMiktar",
    width: 120,
  },
  {
    title: "Çıkan Miktar",
    dataIndex: "cikanMiktar",
    key: "cikanMiktar",
    width: 120,
  },
  {
    title: "Stok Miktar",
    dataIndex: "stokMiktar",
    key: "stokMiktar",
    width: 120,
  },
  {
    title: "Birim",
    dataIndex: "birim",
    key: "birim",
    width: 100,
  },
];

/**
 * Stok kayıtlarının depo bazlı durumunu gösteren, buton + modal birleşik component.
 * Gerektiğinde farklı yerlerde de kullanılabilmesi için utils altında tutulur.
 */
export default function DepoDurumModal({ stokId, stokKod, triggerLabel = "Depodaki Durumu", buttonProps = {}, modalProps = {}, onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    if (!stokId) return;
    onOpenModal?.();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = useCallback(async () => {
    if (!stokId) return;
    setLoading(true);
    setError("");
    try {
      const response = await AxiosInstance.get(`GetMalzemeDepoDurumlari?stokId=${stokId}`);
      const payload = Array.isArray(response?.data) ? response.data : Array.isArray(response?.Data) ? response.Data : [];
      const parsedRows = payload.map((item, index) => ({
        ...item,
        key: item?.key ?? `${item?.depoTanim || "depo"}-${index}`,
      }));
      setRows(parsedRows);
    } catch (err) {
      setRows([]);
      setError("Depo durumu alınırken bir sorun oluştu.");
    } finally {
      setLoading(false);
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

  const mergedButtonProps = useMemo(() => {
    const mergedStyle = { padding: 0, width: "100%", textAlign: "left", ...buttonProps?.style };
    return {
      type: "text",
      ...buttonProps,
      style: mergedStyle,
    };
  }, [buttonProps]);

  return (
    <>
      <Button disabled={!stokId} {...mergedButtonProps} onClick={handleOpen}>
        {triggerLabel}
      </Button>

      <Modal title="Depodaki Durumu" width={900} open={open} onCancel={handleClose} footer={null} destroyOnClose {...modalProps}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(stokKod || stokId) && (
            <Text type="secondary">
              {stokKod && <span style={{ marginRight: 8 }}>Stok Kodu: {stokKod}</span>}
              {stokId && <span>Stok ID: {stokId}</span>}
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
