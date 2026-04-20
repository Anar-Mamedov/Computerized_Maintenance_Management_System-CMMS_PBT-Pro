import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../api/http";

export default function NotEkleModal({ open, onClose, row, refreshTableData }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNote(row?.ISM_DIS_NOT ?? "");
    }
  }, [open, row]);

  const closeModal = () => {
    if (loading) return;
    onClose && onClose();
  };

  const handleSave = async () => {
    if (!note.trim()) {
      message.warning("Not içeriği boş olamaz.");
      return;
    }
    if (!row?.key) {
      message.error("İş emri bilgisi bulunamadı.");
      return;
    }
    setLoading(true);
    try {
      const response = await AxiosInstance.post("UpdateIsEmriDisNot", {
        IsEmriId: row.key,
        DisNot: note.trim(),
      });
      if (response.status_code === 200 || response.status_code === 201) {
        message.success("Not başarıyla kaydedildi.");
        refreshTableData && refreshTableData();
        onClose && onClose();
      } else if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Not kaydedilemedi.");
      }
    } catch (error) {
      console.error("Not kaydetme hatası:", error);
      if (navigator.onLine) {
        message.error("Hata: " + error.message);
      } else {
        message.error("İnternet bağlantısı mevcut değil.");
      }
    } finally {
      setLoading(false);
    }
  };

  const makineLine = [row?.MAKINE_KODU, row?.MAKINE_TANIMI].filter(Boolean).join(" · ");
  const isEdit = row?.ISM_DIS_NOT !== null && row?.ISM_DIS_NOT !== undefined && row?.ISM_DIS_NOT !== "";
  const headerTitle = isEdit ? "Notu Düzenle" : "Not Ekle";

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      destroyOnClose
      centered
      width={620}
      footer={null}
      closable={false}
      title={null}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>{headerTitle}</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "6px" }}>
            Seçili kayıt: <span style={{ fontWeight: 600, color: "#0F172A" }}>{row?.ISEMRI_NO}</span>
          </div>
        </div>
        <Button onClick={closeModal} style={{ borderRadius: "10px", fontWeight: 500 }}>
          Kapat
        </Button>
      </div>

      <div style={{ padding: "16px 24px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 16px",
            borderRadius: "12px",
            background: "#FEF9E7",
            border: "1px solid #FDE68A",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B45309",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            <FileTextOutlined />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {row?.KONU || "-"}
            </div>
            {makineLine && (
              <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {makineLine}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 24px 8px" }}>
        <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "8px" }}>Not İçeriği</div>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notunuzu yazın..."
          autoSize={{ minRows: 8, maxRows: 12 }}
          style={{ borderRadius: "12px", fontSize: "14px", padding: "12px 14px" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px 20px", borderTop: "1px solid #F1F5F9", marginTop: "8px" }}>
        <Button onClick={closeModal} disabled={loading} style={{ borderRadius: "10px", fontWeight: 500 }}>
          Vazgeç
        </Button>
        <Button
          onClick={handleSave}
          loading={loading}
          style={{
            borderRadius: "10px",
            fontWeight: 500,
            background: "#0F172A",
            color: "#fff",
            borderColor: "#0F172A",
          }}
        >
          Kaydet
        </Button>
      </div>
    </Modal>
  );
}
