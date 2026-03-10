import React from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const stopPropagationCell = () => ({
  onClick: (event) => {
    event.stopPropagation();
  },
});

const renderBooleanIcon = (value) => <div style={{ textAlign: "center" }}>{value ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}</div>;

const createColumn = (title, dataIndex, options = {}) => {
  const { key = dataIndex, width = 150, visible = false, render, onCell = stopPropagationCell, sorter = true } = options;

  return {
    title,
    dataIndex,
    key,
    width,
    ellipsis: true,
    visible,
    onCell,
    sorter,
    ...(render ? { render } : {}),
  };
};

const specialFieldConfigs = [
  ["OZL_OZEL_ALAN_1", "MKN_OZEL_ALAN_1"],
  ["OZL_OZEL_ALAN_2", "MKN_OZEL_ALAN_2"],
  ["OZL_OZEL_ALAN_3", "MKN_OZEL_ALAN_3"],
  ["OZL_OZEL_ALAN_4", "MKN_OZEL_ALAN_4"],
  ["OZL_OZEL_ALAN_5", "MKN_OZEL_ALAN_5"],
  ["OZL_OZEL_ALAN_6", "MKN_OZEL_ALAN_6"],
  ["OZL_OZEL_ALAN_7", "MKN_OZEL_ALAN_7"],
  ["OZL_OZEL_ALAN_8", "MKN_OZEL_ALAN_8"],
  ["OZL_OZEL_ALAN_9", "MKN_OZEL_ALAN_9"],
  ["OZL_OZEL_ALAN_10", "MKN_OZEL_ALAN_10"],
  ["OZL_OZEL_ALAN_11", "MKN_OZEL_ALAN_11_KOD_ID"],
  ["OZL_OZEL_ALAN_12", "MKN_OZEL_ALAN_12_KOD_ID"],
  ["OZL_OZEL_ALAN_13", "MKN_OZEL_ALAN_13_KOD_ID"],
  ["OZL_OZEL_ALAN_14", "MKN_OZEL_ALAN_14_KOD_ID"],
  ["OZL_OZEL_ALAN_15", "MKN_OZEL_ALAN_15_KOD_ID"],
  ["OZL_OZEL_ALAN_16", "MKN_OZEL_ALAN_16"],
  ["OZL_OZEL_ALAN_17", "MKN_OZEL_ALAN_17"],
  ["OZL_OZEL_ALAN_18", "MKN_OZEL_ALAN_18"],
  ["OZL_OZEL_ALAN_19", "MKN_OZEL_ALAN_19"],
  ["OZL_OZEL_ALAN_20", "MKN_OZEL_ALAN_20"],
];

export default function useColumns({ label }) {
  return [
    createColumn("#", "key", { width: 100, visible: false }),
    createColumn("Belge", "MKN_BELGE_VAR", { width: 100, visible: false, render: renderBooleanIcon }),
    createColumn("Resim", "MKN_RESIM_VAR", { width: 100, visible: false, render: renderBooleanIcon }),
    createColumn("Periyodik Bakım", "MKN_PERIYODIK_BAKIM", { width: 100, visible: false, render: renderBooleanIcon }),
    createColumn("Ekipman Kodu", "MKN_KOD", { width: 150, visible: true, render: (text) => <a>{text}</a> }),
    createColumn("Ekipman Tanımı", "MKN_TANIM", { width: 250, visible: true, render: (text) => <a>{text}</a> }),
    createColumn("Aktif", "MKN_AKTIF", { width: 100, visible: false, render: renderBooleanIcon }),
    createColumn("Ekipman Durumu", "MKN_DURUM", { width: 150, visible: false }),
    createColumn("Lokasyon", "MKN_LOKASYON", { width: 150, visible: true }),
    createColumn("Ekipman Tipi", "MKN_TIP", { width: 150, visible: true }),
    createColumn("Kategori", "MKN_KATEGORI", { width: 150, visible: false }),
    createColumn("Marka", "MKN_MARKA", { width: 150, visible: true }),
    createColumn("Model", "MKN_MODEL", { width: 150, visible: true }),
    createColumn("Master Ekipman Tanımı", "MKN_MASTER_MAKINE_TANIM", { width: 150, visible: false }),
    createColumn("Master Ekipman Kod", "MKN_MASTER_MAKINE_KOD", { width: 150, visible: false }),
    createColumn("Çalışma Takvimi", "MKN_TAKVIM", { width: 150, visible: false }),
    createColumn("Üretim Yılı", "MKN_URETIM_YILI", { width: 150, visible: false }),
    createColumn("Masraf Merkezi", "MKN_MASRAF_MERKEZ", { width: 150, visible: false }),
    createColumn("Sorumlu Atölye", "MKN_ATOLYE", { width: 150, visible: false }),
    createColumn("Bakım Grubu", "MKN_BAKIM_GRUP", { width: 150, visible: false }),
    createColumn("Arıza Grubu", "MKN_ARIZA_GRUP", { width: 150, visible: false }),
    createColumn("Öncelik", "MKN_ONCELIK", { width: 150, visible: false }),
    createColumn("Arıza Sıklığı (Gün)", "ARIZA_SIKLIGI", { width: 150, visible: false }),
    createColumn("Arıza Sayısı", "ARIZA_SAYISI", { width: 150, visible: false }),
    createColumn("Tam Lokasyon", "MKN_LOKASYON_TUM_YOL", { width: 300, visible: false }),
    createColumn("Ana Lokasyon", "MKN_LOKASYON_TUM_YOL", {
      key: "ANA_LOKASYON",
      width: 300,
      visible: false,
      render: (text) => {
        if (text === null) {
          return null;
        }

        const parts = text.split("/");
        return parts.length > 1 ? parts[0] : text;
      },
    }),
    createColumn("Seri No", "MKN_SERI_NO", { width: 150, visible: false }),
    ...specialFieldConfigs.map(([titleKey, dataIndex]) => createColumn(<div>{label?.[titleKey]}</div>, dataIndex, { width: 150, visible: false })),
  ];
}
