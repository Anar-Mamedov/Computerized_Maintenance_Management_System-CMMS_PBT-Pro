import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "antd";
import { t } from "i18next";
import LastikMarka from "../../components/LastikMarka";
import LastikModel from "../../components/LastikModel";
import FirmaUnvani from "../../components/form/FirmaUnvani";
import KodIDSelectbox from "../../../../utils/components/KodIDSelectbox";
import NumberInput from "../../../../utils/components/NumberInput";
import { KOD_GRUPLARI } from "../../constants";

const Bolum = ({ baslik, children }) => (
  <section>
    {baslik && <div className="mb-3 border-b border-gray-200 pb-2 font-semibold">{baslik}</div>}
    <div className="grid grid-cols-12 gap-x-4 gap-y-3">{children}</div>
  </section>
);

Bolum.propTypes = {
  baslik: PropTypes.node,
  children: PropTypes.node,
};

const Alan = ({ etiket, zorunlu = false, genislik = "col-span-12 md:col-span-4", children }) => (
  <div className={`${genislik} flex flex-col gap-1`}>
    <label>
      {etiket} {zorunlu && <span style={{ color: "red" }}>*</span>}
    </label>
    {children}
  </div>
);

Alan.propTypes = {
  etiket: PropTypes.node.isRequired,
  zorunlu: PropTypes.bool,
  genislik: PropTypes.string,
  children: PropTypes.node,
};

// Lastik tanımı ekle ve güncelle formlarının ortak alanları. `zorunlu` yeni kayıtta zorunlu olan alanları işaretler.
export default function LastikTanimFormu({ zorunlu = false }) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-6 pt-3">
      <Bolum baslik={t("genelBilgiler")}>
        <Alan etiket={t("lastikTanimi")} zorunlu={zorunlu}>
          <Controller
            name="tanim"
            control={control}
            rules={{ required: zorunlu ? t("alanBosBirakilamaz") : false }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} onChange={(e) => field.onChange(e.target.value)} status={error ? "error" : ""} />
                {error && <div style={{ color: "red", marginTop: "5px" }}>{error.message}</div>}
              </>
            )}
          />
        </Alan>
        <Alan etiket={t("marka")} zorunlu={zorunlu}>
          <LastikMarka name1="marka" isRequired={zorunlu} allowAdd />
        </Alan>
        <Alan etiket={t("model")} zorunlu={zorunlu}>
          <LastikModel name1="model" isRequired={zorunlu} watchName="marka" allowAdd />
        </Alan>
        <Alan etiket={t("ebat")} zorunlu={zorunlu}>
          <KodIDSelectbox name1="ebat" kodID={KOD_GRUPLARI.lastikEbati} isRequired={zorunlu} />
        </Alan>
        <Alan etiket={t("tip")}>
          <KodIDSelectbox name1="tip" kodID={KOD_GRUPLARI.lastikTipi} isRequired={false} />
        </Alan>
        <Alan etiket={t("disDerinligi")}>
          <NumberInput name1="disDerinlik" />
        </Alan>
        <Alan etiket={t("basinc")}>
          <NumberInput name1="basinc" />
        </Alan>
        <Alan etiket={t("lastikOmru")}>
          <NumberInput name1="lastikOmru" />
        </Alan>
      </Bolum>

      <Bolum baslik={t("satinalmaBilgiler")}>
        <Alan etiket={t("firma")}>
          <Controller name="firmaId" control={control} render={({ field }) => <FirmaUnvani field={field} />} />
        </Alan>
        <Alan etiket={t("fiyat")}>
          <NumberInput name1="fiyat" />
        </Alan>
      </Bolum>

      <Bolum>
        <Alan etiket={t("aciklama")} genislik="col-span-12">
          <Controller name="aciklama" control={control} render={({ field }) => <Input.TextArea {...field} rows={3} />} />
        </Alan>
      </Bolum>
    </div>
  );
}

LastikTanimFormu.propTypes = {
  zorunlu: PropTypes.bool,
};
