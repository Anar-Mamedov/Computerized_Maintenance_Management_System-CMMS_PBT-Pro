import React, { useEffect, useState } from "react";
import { Typography, Input, DatePicker, InputNumber, Select, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import PersonelTablo from "../../../../../../utils/components/PersonelTablo";
import ProjeTablo from "../../../../../../utils/components/ProjeTablo";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../../api/http";

const { Text } = Typography;
const { TextArea } = Input;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();
  const [izinTanimlari, setIzinTanimlari] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);

  // Başlangıç ve bitiş tarihlerini izliyoruz
  const baslamaTarihi = watch("PIZ_BASLAMA_TARIHI");
  const bitisTarihi = watch("PIZ_BITIS_TARIHI");

  // --- İzin Türleri Dropdown Verisini Çekme ---
  useEffect(() => {
    const fetchIzinTanimlari = async () => {
      try {
        setSelectLoading(true);
        const res = await AxiosInstance.get("GetIzinTanimlari");
        if (res && res.has_error === false) {
          setIzinTanimlari(res.data || []);
        } else {
          message.error("İzin tanımları yüklenirken bir hata oluştu.");
        }
      } catch (err) {
        console.error("İzin tanımları yükleme hatası:", err);
      } finally {
        setSelectLoading(false);
      }
    };

    fetchIzinTanimlari();
  }, []);

  // --- Otomatik Gün Sayısı Hesaplama ---
  useEffect(() => {
    if (baslamaTarihi && bitisTarihi) {
      const start = dayjs(baslamaTarihi, "YYYY-MM-DD");
      const end = dayjs(bitisTarihi, "YYYY-MM-DD");

      if (end.isAfter(start) || end.isSame(start)) {
        const gunSayisi = end.diff(start, "day") + 1;
        setValue("PIZ_SURE", gunSayisi);
      } else {
        setValue("PIZ_SURE", 0);
      }
    } else {
      setValue("PIZ_SURE", 0);
    }
  }, [baslamaTarihi, bitisTarihi, setValue]);

  // --- Stiller ---
  const LabelStyle = {
    display: "flex",
    fontSize: "14px",
    flexDirection: "row",
    alignItems: "center",
    minWidth: "140px",
    fontWeight: 600,
  };

  const InputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
  };

  const RowStyle = {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    width: "100%",
    marginBottom: "10px",
    gap: "15px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "40px",
        width: "100%",
        padding: "20px",
      }}
    >
      {/* SOL KOLON - Güncel İzin Bilgileri */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
          minWidth: "300px",
        }}
      >
        {/* 1. Personel Seçimi */}
        <div style={RowStyle}>
  <Text style={LabelStyle}>{t("Personel")}</Text>
  <div style={InputContainerStyle}>
    <PersonelTablo
      name1="PIZ_PERSONEL_" // 👈 Buraya alt çizgiyi koyduk!
      workshopSelectedId={watch("PIZ_PERSONEL_ID")} // Burası aynı kalıyor
      isRequired={true}
    />
  </div>
</div>

        {/* 2. İzin Türü / Nedeni (Dropdown / Select Yapıldı) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("İzin Nedeni / Türü")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="PIZ_IZIN_TANIM_ID"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder={t("İzin türü seçiniz")}
                  loading={selectLoading}
                  allowClear
                  options={izinTanimlari.map((item) => ({
                    value: item.Id, // API'den gelen gerçek sayısal ID (payload'a basılacak)
                    label: item.Tanim, // Kullanıcının ekranda göreceği metin
                  }))}
                />
              )}
            />
          </div>
        </div>

        {/* 7. Lokasyon Seçimi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Lokasyon")}</Text>
          <div style={InputContainerStyle}>
            <LokasyonTablo
              lokasyonFieldName="LOKASYON"
              lokasyonIdFieldName="PIZ_LOKASYON_ID"
              workshopSelectedId={watch("PIZ_LOKASYON_ID")}
              isRequired={false}
            />
          </div>
        </div>

        {/* 8. Proje Seçimi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Proje")}</Text>
          <div style={InputContainerStyle}>
            <ProjeTablo
              name1="PIZ_PROJE"
              workshopSelectedId={watch("PIZ_PROJE_ID")}
              isRequired={true}
            />
          </div>
        </div>
      </div>

      {/* SAĞ KOLON - Geçmiş İzin Bilgileri ve Tarihler */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
          minWidth: "300px",
          borderLeft: "1px solid #f0f0f0",
          paddingLeft: "20px",
        }}
      >
        {/* 3. İzin Başlangıç Tarihi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("İzin Başlangıç")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="PIZ_BASLAMA_TARIHI"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <DatePicker
                  {...fieldProps}
                  value={value ? dayjs(value, "YYYY-MM-DD") : null}
                  onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
                  style={{ width: "100%" }}
                  format="DD.MM.YYYY"
                  placeholder={t("Başlangıç tarihi seçin")}
                />
              )}
            />
          </div>
        </div>

        {/* 4. İzin Bitiş Tarihi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("İzin Bitiş")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="PIZ_BITIS_TARIHI"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <DatePicker
                  {...fieldProps}
                  value={value ? dayjs(value, "YYYY-MM-DD") : null}
                  onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
                  style={{ width: "100%" }}
                  format="DD.MM.YYYY"
                  placeholder={t("Bitiş tarihi seçin")}
                />
              )}
            />
          </div>
        </div>

        {/* 5. İzin Süresi (Gün) */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("İzin Süresi (Gün)")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="PIZ_SURE"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  style={{ width: "100%" }}
                  disabled
                />
              )}
            />
          </div>
        </div>

        {/* 9. Önceki İzin Tarihi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Önceki İzin Tarihi")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="ONCEKI_IZIN_TARIHI"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  value={value || ""}
                  disabled
                />
              )}
            />
          </div>
        </div>

        {/* 10. Önceki İzin Nedeni */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Önceki İzin Nedeni")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="ONCEKI_IZIN_NEDENI"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                />
              )}
            />
          </div>
        </div>

        {/* 11. Önceki İzin Süresi */}
        <div style={RowStyle}>
          <Text style={LabelStyle}>{t("Önceki İzin Süresi")}</Text>
          <div style={InputContainerStyle}>
            <Controller
              name="ONCEKI_IZIN_SURESI"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}