import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ondalikli } from "../../../ortak/yakitBicim";
import { tankDurumu } from "./fisFormu";

/**
 * Tank / depo secimi ve altinda dokumandaki yardimci metin: "Yakit Tipi · Mevcut Stok / Kalan Kapasite"
 * (GetYakitTankList). Secenekler sayfadaki tank listesinden gelir; silme / kayit sonrasi orada yenilenir.
 */
export default function TankSecimi({ name1, secenekTanklari, tumTanklar, orijinal, disabled = false, onSecildi }) {
  const { t, i18n } = useTranslation();
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const durum = tankDurumu(tumTanklar, watch(name1), orijinal);

  return (
    <>
      <Controller
        name={name1}
        control={control}
        rules={{ required: t("alanBosBirakilamaz") }}
        render={({ field }) => (
          <Select
            value={field.value ?? undefined}
            onChange={(deger) => {
              field.onChange(deger);
              onSecildi?.(deger);
            }}
            onBlur={field.onBlur}
            disabled={disabled}
            status={errors[name1] ? "error" : ""}
            showSearch
            optionFilterProp="label"
            placeholder={t("yakitStokIslemleri.fis.tankSeciniz")}
            options={secenekTanklari.map((tank) => ({ value: tank.TB_DEPO_ID, label: `${tank.DEP_KOD} (${tank.DEP_TANIM})` }))}
            style={{ width: "100%" }}
          />
        )}
      />
      {errors[name1] && <div className="mt-1 text-[12px] text-(--ys-danger)">{errors[name1].message}</div>}
      {durum && (
        <div className="mt-1 text-[11px] text-(--ys-muted)">
          {t("yakitStokIslemleri.fis.tankBilgisi", {
            yakitTipi: durum.tank.YAKIT_TURU || "–",
            mevcut: ondalikli(durum.kullanilabilir, i18n.language),
            kalan: ondalikli(durum.kalanKapasite, i18n.language),
          })}
        </div>
      )}
    </>
  );
}

TankSecimi.propTypes = {
  name1: PropTypes.string.isRequired,
  secenekTanklari: PropTypes.arrayOf(PropTypes.object).isRequired,
  tumTanklar: PropTypes.arrayOf(PropTypes.object).isRequired,
  orijinal: PropTypes.object,
  disabled: PropTypes.bool,
  onSecildi: PropTypes.func,
};
