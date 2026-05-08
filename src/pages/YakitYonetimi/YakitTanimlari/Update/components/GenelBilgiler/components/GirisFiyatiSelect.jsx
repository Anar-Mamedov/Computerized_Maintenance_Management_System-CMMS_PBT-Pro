import React from "react";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function GirisFiyatiSelect() {
  const { control, setValue, watch } = useFormContext();

  // Analiz verilerini formdan izliyoruz (EditDrawer'da set etmiştik)
  const analizVerileri = {
    1: watch("ilkAlisFiyati"),
    2: watch("sonAlisFiyati"),
    3: watch("ortalamaFiyat"),
    4: watch("enYuksekFiyat"),
    5: watch("enDusukFiyat"),
  };

  const options = [
    { value: 1, label: t("ilkAlisFiyati") },
    { value: 2, label: t("sonAlisFiyati") },
    { value: 3, label: t("ortalamaFiyat") },
    { value: 4, label: t("enYuksekFiyat") },
    { value: 5, label: t("enDusukFiyat") },
    { value: 6, label: t("sabitFiyat") },
  ];

  const handleSelectChange = (val, field) => {
    // Önce selectbox'ın kendi değerini güncelle
    field.onChange(val);

    // Eğer Sabit Fiyat (6) dışında bir şey seçildiyse, rakamı otomatik yapıştır
    if (val !== 6 && analizVerileri[val] !== undefined) {
      setValue("girisFiyati", analizVerileri[val]);
    } else if (val === 6) {
      // Sabit fiyat seçilirse istersen kutuyu sıfırlayabilirsin ya da boş bırakabilirsin
      // setValue("girisFiyati", 0); 
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Controller
        name="girisFiyatTuru"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value === 0 || field.value === null ? undefined : field.value}
            placeholder={t("secimYapiniz")}
            allowClear
            options={options}
            style={{ width: "100%" }}
            onChange={(val) => handleSelectChange(val, field)} // Değişimi burada yakalıyoruz
          />
        )}
      />
    </div>
  );
}

export default GirisFiyatiSelect;