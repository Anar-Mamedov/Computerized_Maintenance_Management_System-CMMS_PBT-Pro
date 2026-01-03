import React from "react";
import { Input, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox.jsx";

const { Text } = Typography;
const { TextArea } = Input;

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

export default function PeriyodikBakimIptalForm({ selectedRow }) {
  const { control } = useFormContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>
        <Text>{t("bakimKodu", { defaultValue: "Bakım Kodu" })}:</Text>{" "}
        <Text strong>{selectedRow?.PBK_KOD || "-"}</Text>
      </div>
      <div>
        <Text>{t("periyodikBakim", { defaultValue: "Periyodik Bakım" })}:</Text>{" "}
        <Text strong>{selectedRow?.PBK_TANIM || "-"}</Text>
      </div>
      <div>
        <Text>{t("hedefTarihi", { defaultValue: "Hedef Tarihi" })}:</Text>{" "}
        <Text strong>{formatDate(selectedRow?.HEDEF_TARIH)}</Text>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Text style={{ fontWeight: 600 }}>{t("iptalNedeni", { defaultValue: "İptal Nedeni" })}:</Text>
        <KodIDSelectbox name1="iptalNedeni" kodID={32913} isRequired />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Text>{t("aciklama", { defaultValue: "Açıklama" })}:</Text>
        <Controller
          name="aciklama"
          control={control}
          render={({ field }) => <TextArea {...field} rows={4} placeholder={t("aciklamaEkle", { defaultValue: "Açıklama ekle" })} />}
        />
      </div>
    </div>
  );
}
