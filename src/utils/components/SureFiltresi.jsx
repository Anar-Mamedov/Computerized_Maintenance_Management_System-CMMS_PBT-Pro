import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Popover, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import FullDatePicker from "./FullDatePicker";
import LocalizedDateText from "./LocalizedDateText";

/**
 * Hazir sureler. `period` anahtarlari backend'e oldugu gibi gider (ör. CounterMovement filtresi);
 * `aralik` yalnizca tarih kutularinda gosterilecek baslangic / bitisi hesaplar.
 */
const HAZIR_SURELER = [
  { period: "last7days", labelKey: "sureFiltresi.son7Gun", aralik: (bugun) => [bugun.subtract(7, "day"), bugun] },
  { period: "last30days", labelKey: "sureFiltresi.son30Gun", aralik: (bugun) => [bugun.subtract(30, "day"), bugun] },
  { period: "last90days", labelKey: "sureFiltresi.son90Gun", aralik: (bugun) => [bugun.subtract(90, "day"), bugun] },
  { period: "thisMonth", labelKey: "sureFiltresi.buAy", aralik: (bugun) => [bugun.startOf("month"), bugun] },
  { period: "thisYear", labelKey: "sureFiltresi.buYil", aralik: (bugun) => [bugun.startOf("year"), bugun] },
  { period: "all", labelKey: "sureFiltresi.tumu", aralik: () => [null, null] },
];

const hazirSure = (period) => HAZIR_SURELER.find((sure) => sure.period === period);

const ayniGun = (a, b) => (a && b ? a.isSame(b, "day") : !a && !b);

/**
 * Taslaktaki tarihler secili hazir surenin araligiyla ayniysa o sure, degilse null (ozel aralik). Tarih yazilip
 * Enter / odak kaybiyla girilince secici onChange cagirmadigi icin secim tarihlerden hesaplanir.
 */
const eslesenSure = ({ period, baslangic, bitis }) => {
  const sure = hazirSure(period);
  if (!sure) return null;
  const [hazirBaslangic, hazirBitis] = sure.aralik(dayjs());
  return ayniGun(baslangic, hazirBaslangic) && ayniGun(bitis, hazirBitis) ? sure.period : null;
};

/** Secili degerden acilir pencerenin taslagini kurar. */
const taslakOlustur = (deger) => {
  const sure = hazirSure(deger.period);
  if (!sure) return { period: null, baslangic: deger.startDate ?? null, bitis: deger.endDate ?? null };
  const [baslangic, bitis] = sure.aralik(dayjs());
  return { period: sure.period, baslangic, bitis };
};

/**
 * "Sure" filtresi: dugmeye basinca acilan pencerede hazir sure (Son 7 / 30 / 90 Gun, Bu Ay, Bu Yil, Tumu) ya da
 * tarih araligi secilir. Deger `{ period, startDate, endDate }` bicimindedir: hazir surede `period` dolu, tarihler null;
 * ozel aralikta `period` null, tarihler dayjs. Degisiklik penceredeki "Uygula" ile `onChange`'e verilir.
 * Ikinci arguman secimin tarih araligidir (`{ baslangic, bitis }`, "Tumu"de null): API'si `period` yerine tarih
 * bekleyen ekranlar bunu kullanir. `baslikGoster` false ise dugmede yalnizca secili deger yazar ("Tumu").
 */
export default function SureFiltresi({ value, onChange, baslikGoster = true }) {
  const { t } = useTranslation();
  const [acik, setAcik] = useState(false);
  const form = useForm({ defaultValues: taslakOlustur(value) });
  const { reset, setValue, watch, getValues, setError } = form;
  const [period, baslangic, bitis] = watch(["period", "baslangic", "bitis"]);
  const gorunenSecim = eslesenSure({ period, baslangic, bitis }) ?? "ozel";

  const acikDegisti = (yeniAcik) => {
    // Pencere her acilista secili degerden kurulur; "Iptal" ya da disari tiklama taslagi atar.
    if (yeniAcik) reset(taslakOlustur(value));
    setAcik(yeniAcik);
  };

  const hazirSureSecildi = (yeniPeriod) => {
    const [baslangic, bitis] = hazirSure(yeniPeriod).aralik(dayjs());
    setValue("period", yeniPeriod);
    setValue("baslangic", baslangic);
    setValue("bitis", bitis);
  };

  const uygula = () => {
    const taslak = getValues();
    const secilenSure = eslesenSure(taslak);
    if (secilenSure) {
      onChange({ period: secilenSure, startDate: null, endDate: null }, { baslangic: taslak.baslangic, bitis: taslak.bitis });
      setAcik(false);
      return;
    }
    if (!taslak.baslangic || !taslak.bitis) {
      setError(taslak.baslangic ? "bitis" : "baslangic", { message: t("alanBosBirakilamaz") });
      return;
    }
    if (taslak.baslangic.isAfter(taslak.bitis, "day")) {
      setError("bitis", { message: t("sureFiltresi.tarihSirasiHatasi") });
      return;
    }
    onChange({ period: null, startDate: taslak.baslangic, endDate: taslak.bitis }, { baslangic: taslak.baslangic, bitis: taslak.bitis });
    setAcik(false);
  };

  const secili = hazirSure(value.period);
  const etiket = secili ? (
    t(secili.labelKey)
  ) : (
    <>
      <LocalizedDateText value={value.startDate} /> – <LocalizedDateText value={value.endDate} />
    </>
  );

  const icerik = (
    <FormProvider {...form}>
      <div style={{ display: "flex", width: 300, flexDirection: "column", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Button onClick={() => acikDegisti(false)}>{t("iptal")}</Button>
          <Button type="primary" onClick={uygula}>
            {t("uygula")}
          </Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)", alignItems: "start", gap: 6 }}>
          <div>
            <FullDatePicker name1="baslangic" placeholder={t("sureFiltresi.baslangic")} />
          </div>
          <span style={{ lineHeight: "32px" }}>–</span>
          <div>
            <FullDatePicker name1="bitis" placeholder={t("sureFiltresi.bitis")} />
          </div>
        </div>
        <Select
          value={gorunenSecim}
          onChange={(yeni) => yeni !== "ozel" && hazirSureSecildi(yeni)}
          options={[
            ...HAZIR_SURELER.map((sure) => ({ value: sure.period, label: t(sure.labelKey) })),
            { value: "ozel", label: t("sureFiltresi.ozelAralik"), disabled: true },
          ]}
        />
      </div>
    </FormProvider>
  );

  return (
    <Popover trigger="click" placement="bottomLeft" open={acik} onOpenChange={acikDegisti} content={icerik} destroyTooltipOnHide>
      <Button style={{ width: "100%", justifyContent: "space-between" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {baslikGoster ? (
            <>
              <strong>{t("sureFiltresi.sure")}</strong>
              <span style={{ marginLeft: 6, opacity: 0.75 }}>{etiket}</span>
            </>
          ) : (
            etiket
          )}
        </span>
        <DownOutlined style={{ fontSize: 10, opacity: 0.6 }} />
      </Button>
    </Popover>
  );
}

SureFiltresi.propTypes = {
  value: PropTypes.shape({
    period: PropTypes.string,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  baslikGoster: PropTypes.bool,
};
