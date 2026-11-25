import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Modal, Select, Spin, message } from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FullDatePicker from "../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../utils/components/FullTimePicker";
import NumberInput from "../../../../../utils/components/NumberInput";
import FirmaTablo from "../../../../../utils/components/FirmaTablo";
import KodIDSelectbox from "../../../../../utils/components/KodIDSelectbox";
import TextInput from "../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../utils/components/Form/Textarea";
import { hataMetni } from "../../../ortak/yakitApi";
import { ondalikli } from "../../../ortak/yakitBicim";
import { addYakitIslemi, getYakitStokIslemById, updateYakitStokIslem } from "../../yakitStokIslemService";
import TankSecimi from "./TankSecimi";
import { ISLEM_NEDENI_KOD_GRUBU, ISLEM_TIPLERI, bosFisFormu, detaydanFisFormu, fisGovdesi, kayitEngeli, transferHedefleri, varsayilanBirimFiyat } from "./fisFormu";

function Alan({ etiket, zorunlu = false, genis = false, children }) {
  return (
    <div className={genis ? "sm:col-span-2" : undefined}>
      <div className="ys-etiket">
        {etiket}
        {zorunlu && <span className="text-(--ys-danger)"> *</span>}
      </div>
      {children}
    </div>
  );
}

Alan.propTypes = {
  etiket: PropTypes.string.isRequired,
  zorunlu: PropTypes.bool,
  genis: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * Giris / Cikis / Transfer fisi (Depo/Tank ekranindan tasinan modal). Yeni kayitta AddYakitIslemi'ne,
 * duzenlemede GetYakitStokIslemById ile doldurulup UpdateYakitStokIslem'e gider. Duzenlemede islem tipi kilitlidir.
 * `acilis`: { islemTipi } yeni kayit, { fisId } duzenleme; null ise modal kapali.
 */
export default function YakitFisModali({ acilis, tanklar, yakitKartlari, onKapat, onKaydedildi }) {
  const { t, i18n } = useTranslation();
  const form = useForm({ defaultValues: bosFisFormu("GIRIS") });
  const { control, reset, watch, setValue, getValues, handleSubmit, setError } = form;
  const [orijinal, setOrijinal] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const duzenleme = Boolean(acilis?.fisId);
  const fisId = acilis?.fisId ?? null;

  // Her acilista (her acilis yeni bir nesnedir) form sifirlanir; duzenlemede fis detayi cekilir.
  useEffect(() => {
    if (!acilis) return undefined;
    setOrijinal(null);
    if (!acilis.fisId) {
      reset(bosFisFormu(acilis.islemTipi));
      return undefined;
    }

    let iptal = false;
    setYukleniyor(true);
    getYakitStokIslemById(acilis.fisId)
      .then((yanit) => {
        if (iptal) return;
        const detay = yanit?.data ?? null;
        if (!detay) throw new Error();
        setOrijinal(detay);
        reset(detaydanFisFormu(detay));
      })
      .catch((error) => {
        if (iptal) return;
        message.error(hataMetni(error, t));
        onKapat();
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [acilis, reset, t, onKapat]);

  const islemTipi = watch("islemTipi");
  const [miktar, birimFiyat, kaynakDepoId, hedefDepoId, cariId] = watch(["miktar", "birimFiyat", "kaynakDepoId", "hedefDepoId", "cariId"]);
  const engel = kayitEngeli({ islemTipi, miktar, kaynakDepoId, hedefDepoId }, tanklar, orijinal);
  const tutar = (Number(miktar) || 0) * (Number(birimFiyat) || 0);

  // Yeni kayitta tank secilince, birim fiyat bos ise yakit kartindaki fiyat onerilir (GetYakitList).
  const tankSecildi = (depoId) => {
    if (duzenleme || islemTipi === "TRANSFER") return;
    const bos = getValues("birimFiyat") === null || getValues("birimFiyat") === undefined || getValues("birimFiyat") === "";
    const fiyat = varsayilanBirimFiyat(tanklar, yakitKartlari, depoId, islemTipi);
    if (bos && fiyat !== null) setValue("birimFiyat", fiyat);
  };

  const kaynakSecildi = (depoId) => {
    if (islemTipi === "TRANSFER" && !transferHedefleri(tanklar, depoId).some((tank) => tank.TB_DEPO_ID === getValues("hedefDepoId"))) {
      setValue("hedefDepoId", null);
    }
    tankSecildi(depoId);
  };

  const kaydet = async (degerler) => {
    if (!(Number(degerler.miktar) > 0)) {
      setError("miktar", { message: t("yakitStokIslemleri.fis.miktarSifirdanBuyuk") });
      return;
    }
    if (engel) return;

    setKaydediliyor(true);
    try {
      const govde = fisGovdesi(degerler);
      const yanit = duzenleme ? await updateYakitStokIslem({ ...govde, TB_STOK_FIS_ID: fisId }) : await addYakitIslemi(govde);
      message.success(yanit?.status || t("islemBasarili"));
      onKaydedildi();
      onKapat();
    } catch (error) {
      message.error(hataMetni(error, t));
    } finally {
      setKaydediliyor(false);
    }
  };

  const tankAlani = (name1, secenekTanklari, onSecildi) => (
    <TankSecimi name1={name1} secenekTanklari={secenekTanklari} tumTanklar={tanklar} orijinal={orijinal} onSecildi={onSecildi} />
  );

  const fiyatsiz = islemTipi === "TRANSFER";
  const baslik = t(`yakitStokIslemleri.fis.baslik.${islemTipi}`);

  return (
    <Modal
      open={Boolean(acilis)}
      title={duzenleme && orijinal?.FisNo ? `${baslik} · ${orijinal.FisNo}` : baslik}
      onCancel={onKapat}
      width={680}
      centered
      destroyOnClose
      wrapClassName="ys-tokenlar"
      footer={[
        <Button key="vazgec" onClick={onKapat}>
          {t("vazgec")}
        </Button>,
        <Button key="kaydet" type="primary" loading={kaydediliyor} disabled={yukleniyor || Boolean(engel)} onClick={handleSubmit(kaydet)}>
          {t("kaydet")}
        </Button>,
      ]}
    >
      <Spin spinning={yukleniyor}>
        <FormProvider {...form}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 pt-2 sm:grid-cols-2">
            <Alan etiket={t("yakitStokIslemleri.fis.islemTipi")} zorunlu>
              <Controller
                name="islemTipi"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    disabled={duzenleme}
                    options={ISLEM_TIPLERI.map((tip) => ({ value: tip, label: t(`yakitOrtak.islemTuru.${tip}`) }))}
                    style={{ width: "100%" }}
                  />
                )}
              />
            </Alan>
            <Alan etiket={t("yakitStokIslemleri.fis.tarihSaat")} zorunlu>
              <div className="flex gap-2">
                <div className="min-w-0 flex-[3]">
                  <FullDatePicker name1="tarih" isRequired allowClear={false} />
                </div>
                <div className="min-w-0 flex-[2]">
                  <FullTimePicker name1="saat" isRequired allowClear={false} />
                </div>
              </div>
            </Alan>

            {islemTipi === "GIRIS" && (
              <Alan etiket={t("yakitStokIslemleri.fis.islemYapilanTank")} zorunlu genis>
                {tankAlani("hedefDepoId", tanklar, tankSecildi)}
              </Alan>
            )}
            {islemTipi === "CIKIS" && (
              <Alan etiket={t("yakitStokIslemleri.fis.islemYapilanTank")} zorunlu genis>
                {tankAlani("kaynakDepoId", tanklar, tankSecildi)}
              </Alan>
            )}
            {islemTipi === "TRANSFER" && (
              <>
                <Alan etiket={t("yakitStokIslemleri.fis.kaynakTank")} zorunlu>
                  {tankAlani("kaynakDepoId", tanklar, kaynakSecildi)}
                </Alan>
                <Alan etiket={t("yakitStokIslemleri.fis.hedefTank")} zorunlu>
                  {tankAlani("hedefDepoId", transferHedefleri(tanklar, kaynakDepoId))}
                </Alan>
              </>
            )}

            <Alan etiket={t("yakitStokIslemleri.fis.miktar")} zorunlu>
              <NumberInput name1="miktar" isRequired minNumber={0} />
              {engel && <div className="mt-1 text-[12px] text-(--ys-danger)">{t(engel.anahtar, { deger: ondalikli(engel.deger, i18n.language) })}</div>}
            </Alan>

            {!fiyatsiz && (
              <>
                <Alan etiket={t(islemTipi === "GIRIS" ? "yakitStokIslemleri.fis.girisNedeni" : "yakitStokIslemleri.fis.cikisNedeni")}>
                  <KodIDSelectbox name1="islemNedeni" kodID={ISLEM_NEDENI_KOD_GRUBU} isRequired={false} placeholder={t("yakitStokIslemleri.fis.seciniz")} />
                </Alan>
                <Alan etiket={t(islemTipi === "GIRIS" ? "yakitStokIslemleri.fis.tedarikci" : "yakitStokIslemleri.fis.firmaAlici")}>
                  <FirmaTablo firmaFieldName="cariTanim" firmaIdFieldName="cariId" workshopSelectedId={cariId || undefined} />
                </Alan>
                <Alan etiket={t("yakitStokIslemleri.fis.belgeNo")}>
                  <TextInput name="belgeNo" length={50} />
                </Alan>
                <Alan etiket={t("yakitStokIslemleri.fis.birimFiyat")}>
                  <NumberInput name1="birimFiyat" minNumber={0} />
                </Alan>
                <Alan etiket={t("yakitStokIslemleri.fis.tutar")}>
                  <Input readOnly value={`${ondalikli(tutar, i18n.language)} ${t("yakitOrtak.tl")}`} />
                </Alan>
              </>
            )}

            <Alan etiket={t("yakitStokIslemleri.fis.aciklama")} genis>
              <Textarea name="aciklama" styles={{ minHeight: 72 }} />
            </Alan>
          </div>
        </FormProvider>
      </Spin>
    </Modal>
  );
}

YakitFisModali.propTypes = {
  acilis: PropTypes.shape({ islemTipi: PropTypes.oneOf(ISLEM_TIPLERI), fisId: PropTypes.number }),
  tanklar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yakitKartlari: PropTypes.arrayOf(PropTypes.object).isRequired,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
