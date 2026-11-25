import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuCalendar } from "react-icons/lu";
import FullDatePicker from "./FullDatePicker";
import { DONEMLER, donemAraligi } from "../donemSecimi";

/**
 * Sure secici: hazir donem secilince baslangic / bitis alanlari donemin araligiyla doldurulur;
 * "Tarih Araligi" secilince iki tarih kutusu acilir ve tarihleri kullanici girer.
 * Ekran, istegini baslangic / bitis alanlarindan kurar (react-hook-form icinde kullanilir).
 */
export default function DonemSelectbox({ name1 = "donem", baslangicName = "baslangicTarihi", bitisName = "bitisTarihi", style }) {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext();
  const donem = watch(name1);

  const donemDegisti = (yeniDonem, field) => {
    field.onChange(yeniDonem);
    const aralik = donemAraligi(yeniDonem);
    if (!aralik) return;
    setValue(baslangicName, aralik[0]);
    setValue(bitisName, aralik[1]);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...style }}>
      <Controller
        name={name1}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onChange={(yeniDonem) => donemDegisti(yeniDonem, field)}
            options={DONEMLER.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
            prefix={<LuCalendar size={14} />}
            style={{ minWidth: 160, flex: "1 1 160px" }}
            aria-label={t("donemSecimi.sure")}
          />
        )}
      />
      {donem === "tarihAraligi" && (
        <>
          <div style={{ flex: "1 1 130px", minWidth: 130 }}>
            <FullDatePicker name1={baslangicName} placeholder={t("donemSecimi.baslangic")} allowClear={false} />
          </div>
          <div style={{ flex: "1 1 130px", minWidth: 130 }}>
            <FullDatePicker name1={bitisName} placeholder={t("donemSecimi.bitis")} allowClear={false} />
          </div>
        </>
      )}
    </div>
  );
}

DonemSelectbox.propTypes = {
  name1: PropTypes.string,
  baslangicName: PropTypes.string,
  bitisName: PropTypes.string,
  style: PropTypes.object,
};
