import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table, Tag } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../../../../../api/http";
import IsEmriEditDrawer from "../../../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer.jsx";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatSignedValue = (value, formatter) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return value;
  }
  const sign = numericValue > 0 ? "+" : numericValue < 0 ? "-" : "";
  const absValue = formatter.format(Math.abs(numericValue));
  return `${sign}${absValue}`;
};

const formatKalan = (record, gunLabel) => {
  const kalanSayac = record?.KALAN_SAYAC;
  const kalanGun = record?.KALAN_GUN;
  const formatter = new Intl.NumberFormat(navigator.language);

  if (kalanSayac !== null && kalanSayac !== undefined && kalanSayac !== "") {
    const formattedValue = formatSignedValue(kalanSayac, formatter);
    const unit = record?.SAYAC_BIRIM || "";
    return `${formattedValue}${unit ? ` ${unit}` : ""}`;
  }

  if (kalanGun !== null && kalanGun !== undefined && kalanGun !== "") {
    const formattedValue = formatSignedValue(kalanGun, formatter);
    return `${formattedValue} ${gunLabel}`;
  }

  return "-";
};

const statusColorMap = {
  danger: "red",
  warning: "orange",
  primary: "blue",
  success: "green",
};

const kalanTagStyles = {
  neutral: {
    backgroundColor: "#f2f4f7",
    borderColor: "#d0d5dd",
    color: "#475467",
  },
  danger: {
    backgroundColor: "#ffe4e6",
    borderColor: "#fecdd3",
    color: "#b42318",
  },
};

export default function PeriyodikBakimlarTablo({ makineId, isActive = false }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isEmriDrawerVisible, setIsEmriDrawerVisible] = useState(false);
  const [selectedIsEmriRow, setSelectedIsEmriRow] = useState(null);
  const isMountedRef = useRef(true);

  const fetchList = useCallback(async () => {
    if (!makineId) {
      if (isMountedRef.current) {
        setRows([]);
        setTotal(0);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await AxiosInstance.get(`GetMakinePeriyodikBakimListesi?makineId=${makineId}`);
      if (!isMountedRef.current) return;
      setRows(response?.list || []);
      setTotal(response?.count ?? 0);
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Periyodik bakim listesi yuklenemedi:", error);
      setRows([]);
      setTotal(0);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [makineId]);

  useEffect(() => {
    if (isActive) {
      fetchList();
    }
  }, [fetchList, isActive]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const gunLabel = t("gun", { defaultValue: "Gün" });

  const columns = [
    {
      title: t("bakimKodu", { defaultValue: "Bakım Kodu" }),
      dataIndex: "PBK_KOD",
      key: "PBK_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: t("periyodikBakim", { defaultValue: "Periyodik Bakım" }),
      dataIndex: "PBK_TANIM",
      key: "PBK_TANIM",
      width: 240,
      ellipsis: true,
    },
    {
      title: t("periyot", { defaultValue: "Periyot" }),
      dataIndex: "PERIYOT_ACIKLAMA",
      key: "PERIYOT_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
    {
      title: t("sonUygulama", { defaultValue: "Son Uygulama" }),
      dataIndex: "SON_UYGULAMA_TARIH",
      key: "SON_UYGULAMA_TARIH",
      width: 160,
      render: (value) => formatDate(value) || "-",
    },
    {
      title: t("sonraki", { defaultValue: "Sonraki" }),
      dataIndex: "HEDEF_TARIH",
      key: "HEDEF_TARIH",
      width: 160,
      render: (value) => formatDate(value) || "-",
    },
    {
      title: t("kalan", { defaultValue: "Kalan" }),
      key: "KALAN",
      width: 150,
      align: "right",
      render: (_, record) => {
        const kalanValue = formatKalan(record, gunLabel);
        if (kalanValue === "-") {
          return "---";
        }
        const kalanSayac = record?.KALAN_SAYAC;
        const hasSayac = kalanSayac !== null && kalanSayac !== undefined && kalanSayac !== "";
        const kalanGun = record?.KALAN_GUN;
        const isGunBased = !hasSayac && kalanGun !== null && kalanGun !== undefined && kalanGun !== "";
        const numericGun = Number(kalanGun);
        const tagStyle = isGunBased && Number.isFinite(numericGun) && numericGun < 0 ? kalanTagStyles.danger : kalanTagStyles.neutral;

        return (
          <Tag style={{ borderRadius: "999px", padding: "2px 10px", fontWeight: 500, ...tagStyle }}>
            {kalanValue}
          </Tag>
        );
      },
    },
    {
      title: t("durum"),
      dataIndex: "DURUM_TEXT",
      key: "DURUM_TEXT",
      width: 140,
      render: (value, record) => {
        if (!value) return "";
        const color = statusColorMap[record?.DURUM_CLASS];
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: t("isEmri", { defaultValue: "İş Emri" }),
      dataIndex: "IS_EMRI_NO",
      key: "IS_EMRI_NO",
      width: 140,
      ellipsis: true,
      render: (value, record) => {
        if (!value) return "---";
        return (
          <a
            onClick={(event) => {
              event?.stopPropagation();
              setSelectedIsEmriRow({ key: record?.IS_EMRI_ID });
              setIsEmriDrawerVisible(true);
            }}
          >
            {value}
          </a>
        );
      },
    },
  ];

  return (
    <>
      <Table
        rowKey={(record) => record?.TB_PERIYODIK_BAKIM_ID ?? record?.PBK_KOD}
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: 10, total, hideOnSinglePage: true }}
        locale={{ emptyText: t("kayitBulunamadi", { defaultValue: "Kayit bulunamadi." }) }}
        scroll={{ x: 1200 }}
      />
      <IsEmriEditDrawer selectedRow={selectedIsEmriRow} onDrawerClose={() => setIsEmriDrawerVisible(false)} drawerVisible={isEmriDrawerVisible} onRefresh={fetchList} />
    </>
  );
}
