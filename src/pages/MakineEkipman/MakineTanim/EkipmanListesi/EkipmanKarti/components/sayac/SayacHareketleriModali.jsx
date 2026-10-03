import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import Alan from "../ortak/Alan";
import KartModali from "../ortak/KartModali";
import KartTablosu from "../ortak/KartTablosu";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Rozet from "../ortak/Rozet";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import { basariliMi } from "../../../ekipmanService";
import { getSayacHareketleri, hataMesaji, listeyiAl, yanitHatasi } from "../../ekipmanKartiService";
import { anahtarEkle, apiTarihi, bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";

const hareketTipiRozeti = (tip) => (tip ? <Rozet ton={tip === "SIFIRLAMA" ? "uyari" : "notr"}>{tip}</Rozet> : "—");

const solukMetin = (deger) => <span className="ek-kart-soluk">{bosIse(deger)}</span>;

/** Sayac Hareketleri: secili sayacin okuma kayitlari. Acilista son 3 ay listelenir. */
export default function SayacHareketleriModali({ acik, sayac, onKapat }) {
  const { t, i18n } = useTranslation();
  const methods = useForm({ defaultValues: { basTarih: null, bitTarih: null } });
  const { reset, handleSubmit } = methods;
  const [kayitlar, setKayitlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const istekSirasiRef = useRef(0);
  const sayacId = sayac?.sayacId ?? null;

  // Yalnizca en son istegin yaniti yazilir (tarih araligi hizli degistirilirse).
  const hareketleriGetir = useCallback(
    async (basTarih, bitTarih) => {
      istekSirasiRef.current += 1;
      const istekSirasi = istekSirasiRef.current;
      const guncelMi = () => istekSirasi === istekSirasiRef.current;

      setYukleniyor(true);
      try {
        const yanit = await getSayacHareketleri({ sayacId, basTarih: apiTarihi(basTarih), bitTarih: apiTarihi(bitTarih) });
        if (!guncelMi()) return;
        if (!basariliMi(yanit)) {
          message.error(yanitHatasi(yanit, t));
          setKayitlar([]);
          return;
        }
        setKayitlar(anahtarEkle(listeyiAl(yanit), "TB_SAYAC_OKUMA_ID"));
      } catch (hata) {
        if (!guncelMi()) return;
        console.error("Sayac hareketleri alinamadi:", hata);
        setKayitlar([]);
        message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      } finally {
        if (guncelMi()) setYukleniyor(false);
      }
    },
    [sayacId, t]
  );

  useEffect(() => {
    if (!acik || !sayacId) return;
    const aralik = { basTarih: dayjs().subtract(3, "month"), bitTarih: dayjs() };
    reset(aralik);
    setKayitlar([]);
    hareketleriGetir(aralik.basTarih, aralik.bitTarih);
  }, [acik, sayacId, reset, hareketleriGetir]);

  const listele = handleSubmit(({ basTarih, bitTarih }) => hareketleriGetir(basTarih, bitTarih));

  const kolonlar = useMemo(() => {
    const dil = i18n.language;
    const baslik = (anahtar) => buyukHarf(t(anahtar), dil);
    return [
      {
        key: "tarih",
        title: baslik("ekipmanKarti.tarih"),
        width: 150,
        render: (_, kayit) => <LocalizedDateText value={kayit.SYO_TARIH} timeValue={kayit.SYO_SAAT} mode="datetime" />,
      },
      {
        key: "okunan",
        title: baslik("ekipmanKarti.sayac.okunanDeger"),
        width: 130,
        align: "right",
        className: "tabular-nums",
        render: (_, kayit) => sayiMetni(kayit.SYO_OKUNAN_SAYAC, dil),
      },
      {
        key: "fark",
        title: baslik("ekipmanKarti.sayac.fark"),
        width: 110,
        align: "right",
        className: "tabular-nums",
        responsive: ["sm"],
        render: (_, kayit) => sayiMetni(kayit.SYO_FARK_SAYAC, dil),
      },
      { key: "tip", title: baslik("ekipmanKarti.sayac.hareketTipi"), width: 140, responsive: ["sm"], render: (_, kayit) => hareketTipiRozeti(kayit.SYO_HAREKET_TIP) },
      { key: "vardiya", title: baslik("ekipmanKarti.sayac.vardiya"), width: 150, responsive: ["md"], ellipsis: true, render: (_, kayit) => solukMetin(kayit.SYO_VARDIYA) },
      { key: "aciklama", title: baslik("ekipmanKarti.aciklama"), responsive: ["lg"], ellipsis: true, render: (_, kayit) => solukMetin(kayit.SYO_ACIKLAMA) },
    ];
  }, [t, i18n.language]);

  return (
    <KartModali acik={acik} baslik={t("ekipmanKarti.sayac.hareketler")} altBaslik={sayac?.tanim} genislik={960} onKapat={onKapat} altBilgi={<ModalDugmeleri onKapat={onKapat} />}>
      <FormProvider {...methods}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <Alan etiket={t("ekipmanKarti.baslangicTarihi")} className="w-full sm:w-48">
              <FullDatePicker name1="basTarih" isRequired />
            </Alan>
            <Alan etiket={t("ekipmanKarti.bitisTarihi")} className="w-full sm:w-48">
              <FullDatePicker name1="bitTarih" isRequired />
            </Alan>
            <button type="button" className="ek-kart-btn" onClick={listele} disabled={yukleniyor}>
              <LuSearch size={14} />
              {t("ekipmanKarti.listele")}
            </button>
          </div>
          <KartTablosu ic rowKey="clientKey" columns={kolonlar} dataSource={kayitlar} loading={yukleniyor} />
        </div>
      </FormProvider>
    </KartModali>
  );
}

SayacHareketleriModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  sayac: PropTypes.shape({
    sayacId: PropTypes.number.isRequired,
    tanim: PropTypes.string,
  }),
  onKapat: PropTypes.func.isRequired,
};
