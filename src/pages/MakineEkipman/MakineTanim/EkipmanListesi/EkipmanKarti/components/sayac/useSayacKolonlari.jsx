import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LuStar } from "react-icons/lu";
import { bayrak } from "./sayacYardimcilari";
import { bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";

/** Kolon basliklari; "Liste Ozellikleri" de ayni metinleri kullanir. */
const KOLON_BASLIKLARI = {
  tanim: "ekipmanKarti.sayac.sayacTanimi",
  birim: "ekipmanKarti.sayac.birimi",
  tip: "ekipmanKarti.sayac.sayacTipi",
  sanal: "ekipmanKarti.sayac.sanal",
  deger: "ekipmanKarti.sayac.deger",
  aciklama: "ekipmanKarti.aciklama",
};

const solukMetin = (deger) => <span className="ek-kart-soluk">{bosIse(deger)}</span>;

/**
 * Sayac tablosunun kolonlari (genislikler tasarimdaki gibi). Varsayilan sayacin taniminin onunde yesil yildiz vardir.
 * Doner: { kolonlar (antd), ozellikKolonlari ({ key, baslikMetni }) }.
 */
export default function useSayacKolonlari() {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    const dil = i18n.language;
    const baslik = (anahtar) => buyukHarf(t(KOLON_BASLIKLARI[anahtar]), dil);
    const kolonlar = [
      {
        key: "tanim",
        title: baslik("tanim"),
        render: (_, kayit) => (
          <span className="flex min-w-0 items-center gap-1.5">
            {bayrak(kayit.MES_VARSAYILAN) && <LuStar size={14} fill="currentColor" className="shrink-0 text-(--ek-k-basari)" title={t("ekipmanKarti.sayac.varsayilanSayac")} />}
            <span className="truncate">{kayit.MES_TANIM}</span>
          </span>
        ),
      },
      { key: "birim", title: baslik("birim"), width: 96, responsive: ["sm"], render: (_, kayit) => solukMetin(kayit.MES_SAYAC_BIRIM ?? kayit.MES_BIRIM) },
      { key: "tip", title: baslik("tip"), width: 144, responsive: ["lg"], render: (_, kayit) => solukMetin(kayit.MES_SAYAC_TIP ?? kayit.MES_TIP) },
      {
        key: "sanal",
        title: baslik("sanal"),
        width: 80,
        responsive: ["sm"],
        render: (_, kayit) => solukMetin(bayrak(kayit.MES_SANAL_SAYAC) ? t("ekipmanKarti.evet") : t("ekipmanKarti.hayir")),
      },
      {
        key: "deger",
        title: baslik("deger"),
        width: 112,
        align: "right",
        className: "tabular-nums",
        render: (_, kayit) => <span className="font-semibold">{sayiMetni(kayit.MES_GUNCEL_DEGER, dil)}</span>,
      },
      { key: "aciklama", title: baslik("aciklama"), width: 224, responsive: ["xl"], ellipsis: true, render: (_, kayit) => solukMetin(kayit.MES_ACIKLAMA) },
    ];
    const ozellikKolonlari = kolonlar.map((kolon) => ({ key: kolon.key, baslikMetni: t(KOLON_BASLIKLARI[kolon.key]) }));
    return { kolonlar, ozellikKolonlari };
  }, [t, i18n.language]);
}
