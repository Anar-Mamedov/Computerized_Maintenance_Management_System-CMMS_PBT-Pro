import React, { useCallback, useMemo, useState } from "react";
import { Modal, Table, Tag } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../api/http";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function Tarihce({ makineId, hidePopover, icon, iconColor, title, description }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const isDisabled = !makineId;
  const resolvedTitle = title || t("tarihce", { defaultValue: "Tarihçe" });
  const resolvedDescription =
    description || t("periyodikBakimTarihcesiAciklama", { defaultValue: "Seçili makineye ait periyodik bakım tarihçesini görüntüler." });

  const fetchHistory = useCallback(async () => {
    if (!makineId) return;
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`GetPeriyodikBakimTarihceByMakineId?makineId=${makineId}`);
      setRows(response?.list || []);
    } catch (error) {
      console.error("Periyodik bakim tarihcesi alinmadi:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [makineId]);

  const handleModalToggle = () => {
    const nextVisible = !isModalVisible;
    setIsModalVisible(nextVisible);
    if (nextVisible) {
      hidePopover?.();
      fetchHistory();
    }
  };

  const gecikmeStatusMap = {
    1: { color: "green", text: t("zamaninda", { defaultValue: "Zamanında" }) },
    2: { color: "red", text: t("gecikmis", { defaultValue: "Gecikmiş" }) },
  };

  const columns = useMemo(
    () => [
      {
        title: t("bakimKodu", { defaultValue: "Bakım Kodu" }),
        dataIndex: "PBK_KOD",
        key: "PBK_KOD",
        width: 140,
        ellipsis: true,
      },
      {
        title: t("periyodikBakim", { defaultValue: "Periyodik Bakım" }),
        dataIndex: "PBK_TANIM",
        key: "PBK_TANIM",
        width: 200,
        ellipsis: true,
      },
      {
        title: t("planlananTarih", { defaultValue: "Planlanan Tarih" }),
        dataIndex: "PBL_PLANLANAN_TARIH",
        key: "PBL_PLANLANAN_TARIH",
        width: 160,
        render: (value) => formatDate(value),
      },
      {
        title: t("gerceklesenTarih", { defaultValue: "Gerçekleşen Tarih" }),
        dataIndex: "PBL_GERCEKLESEN_TARIH",
        key: "PBL_GERCEKLESEN_TARIH",
        width: 160,
        render: (value) => formatDate(value),
      },
      {
        title: t("gunFarki", { defaultValue: "Gün Farkı" }),
        dataIndex: "PBL_GUN_FARK",
        key: "PBL_GUN_FARK",
        width: 110,
        align: "right",
        render: (value) => (value === null || value === undefined ? "-" : value),
      },
      {
        title: t("uygulamaSayaci", { defaultValue: "Uygulama Sayacı" }),
        dataIndex: "PBL_SON_UYGULAMA_SAYAC",
        key: "PBL_SON_UYGULAMA_SAYAC",
        width: 150,
        align: "right",
        render: (value) => (value === null || value === undefined ? "-" : value),
      },
      {
        title: t("hedefSayac", { defaultValue: "Hedef Sayaç" }),
        dataIndex: "PBL_HEDEF_SAYAC",
        key: "PBL_HEDEF_SAYAC",
        width: 150,
        align: "right",
        render: (value) => (value === null || value === undefined ? "-" : value),
      },
      {
        title: t("isEmriNo"),
        dataIndex: "PBL_ISEMRI_NO",
        key: "PBL_ISEMRI_NO",
        width: 130,
        ellipsis: true,
        render: (value) => value || "---",
      },
      {
        title: t("durum"),
        dataIndex: "PBL_GECIKME_DURUM_ICON",
        key: "PBL_GECIKME_DURUM_ICON",
        width: 120,
        render: (value) => {
          const status = gecikmeStatusMap[value];
          if (!status) return "-";
          return <Tag color={status.color}>{status.text}</Tag>;
        },
      },
      {
        title: t("aciklama", { defaultValue: "Açıklama" }),
        dataIndex: "PBL_ACIKLAMA",
        key: "PBL_ACIKLAMA",
        width: 240,
        ellipsis: true,
        render: (value) => value || "-",
      },
    ],
    [t]
  );

  return (
    <div style={isDisabled ? { display: "none" } : {}}>
      <div
        className="menu-item-hover"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: "pointer",
          padding: "10px 12px",
          transition: "background-color 0.3s",
          width: "100%",
        }}
        onMouseEnter={(event) => (event.currentTarget.style.backgroundColor = "#f5f5f5")}
        onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = "transparent")}
        onClick={handleModalToggle}
      >
        <div>{icon && <span style={{ color: iconColor, fontSize: "18px", marginTop: "4px" }}>{icon}</span>}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>{resolvedTitle}</span>
          <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>{resolvedDescription}</span>
        </div>
      </div>
      <Modal
        width={1200}
        centered
        destroyOnClose
        title={t("periyodikBakimTarihcesi", { defaultValue: "Periyodik Bakım Tarihçesi" })}
        open={isModalVisible}
        onOk={handleModalToggle}
        onCancel={handleModalToggle}
      >
        <Table
          rowKey={(record, index) => record?.PBL_PLANLANAN_TARIH ?? `${record?.PBK_KOD}-${index}`}
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          locale={{ emptyText: t("tarihceKayitBulunamadi", { defaultValue: "Tarihçe kaydı bulunamadı." }) }}
          scroll={{ x: 1200 }}
        />
      </Modal>
    </div>
  );
}
