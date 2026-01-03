import React, { useMemo } from "react";
import { DatePicker, Input, Typography } from "antd";
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

export default function IleriTarihePlanlaForm({ selectedRow }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const localeDateFormat = useMemo(() => {
    const sampleDate = new Date(2021, 10, 21);
    const formatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);
    return formatted.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM");
  }, []);

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
        <Text>{t("mevcutHedefTarih", { defaultValue: "Mevcut Hedef Tarih" })}:</Text>{" "}
        <Text strong>{formatDate(selectedRow?.HEDEF_TARIH)}</Text>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Text style={{ fontWeight: 600 }}>{t("hedefTarihi", { defaultValue: "Hedef Tarihi" })}:</Text>
        <Controller
          name="hedefTarihi"
          control={control}
          rules={{ required: t("zorunluAlan", { defaultValue: "Alan boş bırakılamaz." }) }}
          render={({ field }) => (
            <DatePicker
              {...field}
              status={errors.hedefTarihi ? "error" : ""}
              style={{ width: "200px" }}
              format={localeDateFormat}
              placeholder={t("tarihSeciniz", { defaultValue: "Tarih seçiniz" })}
            />
          )}
        />
        {errors.hedefTarihi && <Text type="danger">{errors.hedefTarihi.message}</Text>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Text style={{ fontWeight: 600 }}>{t("planlamaNedeni", { defaultValue: "Planlama Nedeni" })}:</Text>
        <KodIDSelectbox name1="planlamaNedeni" kodID={32914} isRequired />
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
