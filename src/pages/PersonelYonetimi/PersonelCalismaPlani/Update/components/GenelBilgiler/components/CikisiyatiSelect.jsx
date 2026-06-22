import React from "react";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function CikisiyatiSelect() {
  const {
    control,
    setValue,
    watch,
  } = useFormContext();

  // Analiz verilerini ve o anki giriş fiyatını izliyoruz
  const analizVerileri = {
    1: watch("ilkAlisFiyati"), // Çıkış için de genelde alış analizleri baz alınır
    2: watch("sonAlisFiyati"),
    3: watch("ortalamaFiyat"),
    4: watch("enYuksekFiyat"),
    5: watch("enDusukFiyat"),
    7: watch("girisFiyati"),   // Giriş fiyatını kullan seçeneği için
  };

  const options = [
    { value: 1, label: t("ilkAlisFiyati") },
    { value: 2, label: t("sonAlisFiyati") },
    { value: 3, label: t("ortalamaFiyat") },
    { value: 4, label: t("enYuksekFiyat") },
    { value: 5, label: t("enDusukFiyat") },
    { value: 6, label: t("sabitFiyat") },
    { value: 7, label: t("girisFiyatiKullan") },
  ];

  const handleSelectChange = (val, field) => {
    // Form state'ini güncelle (ID'yi kaydet)
    field.onChange(val);

    // Eğer Sabit Fiyat (6) dışındaki otomatik seçeneklerden biri seçildiyse
    if (val !== 6 && val !== undefined && val !== null) {
      const yeniFiyat = analizVerileri[val];
      // Değer varsa (0 dahil olabilir) çıkış fiyatı kutusuna yaz
      if (yeniFiyat !== undefined && yeniFiyat !== null) {
        setValue("cikisFiyati", yeniFiyat);
      }
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Controller
        name="cikisFiyatTuru"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            // 0 veya null gelirse placeholder'ı göster
            value={field.value === 0 || field.value === null ? undefined : field.value}
            placeholder={t("secimYapiniz")}
            allowClear
            options={options}
            style={{ width: "100%" }}
            onChange={(val) => handleSelectChange(val, field)}
          />
        )}
      />
    </div>
  );
}

export default CikisiyatiSelect;