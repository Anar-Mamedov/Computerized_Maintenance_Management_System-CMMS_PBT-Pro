import React from "react";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import Rozet from "../ortak/Rozet";
import { bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";
import { ROZET_TONLARI, dolguSinifi, gecikmisMi, ilerlemeOrani, kalanMetinleri, sonSayac } from "./bakimYardimcilari";

const bakimHucresi = (kayit) => (
  <>
    <p className="truncate font-medium">{bosIse(kayit.PBK_TANIM)}</p>
    {kayit.PBK_KOD && <p className="ek-kart-soluk truncate text-[11px]">{kayit.PBK_KOD}</p>}
  </>
);

const kalanHucresi = (kayit, t, dil) => {
  const oran = ilerlemeOrani(kayit);
  const { ana, diger } = kalanMetinleri(kayit, t, dil);
  return (
    <>
      {oran !== null && (
        <div className="ek-kart-ilerleme">
          <div className={dolguSinifi(kayit.DURUM_CLASS)} style={{ width: `${Math.round(oran * 100)}%` }} />
        </div>
      )}
      <p className={`truncate text-xs ${oran !== null ? "mt-1" : ""}`}>{bosIse(ana)}</p>
      {diger && <p className="ek-kart-soluk truncate text-[11px]">{diger}</p>}
    </>
  );
};

const durumHucresi = (kayit, onIsEmriAc) => (
  <>
    {kayit.DURUM_TEXT ? <Rozet ton={ROZET_TONLARI[kayit.DURUM_CLASS] ?? "notr"}>{kayit.DURUM_TEXT}</Rozet> : "—"}
    {kayit.IS_EMRI_NO && (
      <button
        type="button"
        className="ek-kart-soluk mt-1 block max-w-full cursor-pointer truncate text-left text-[11px] hover:underline"
        onClick={(olay) => {
          // satir tiklamasi (detay modali) tetiklenmesin
          olay.stopPropagation();
          onIsEmriAc(kayit);
        }}
      >
        {kayit.IS_EMRI_NO}
      </button>
    )}
  </>
);

/**
 * Periyodik bakim listesinin kolonlari (tasarimdaki genislikler). `baslikMetni` Liste Ozellikleri penceresinde,
 * `width` tablo genisligi hesabinda kullanilir; genisligi olmayan tek kolon (Bakim) kalan alani doldurur.
 */
export const bakimKolonlari = ({ t, dil, onIsEmriAc }) => {
  const kolon = (key, metinAnahtari, ozellikler) => ({ key, baslikMetni: t(metinAnahtari), title: buyukHarf(t(metinAnahtari), dil), ...ozellikler });

  return [
    kolon("bakim", "ekipmanKarti.bakim.bakim", { render: (_, kayit) => bakimHucresi(kayit) }),
    kolon("periyot", "ekipmanKarti.bakim.periyot", {
      width: 128,
      responsive: ["lg"],
      render: (_, kayit) => <span className="ek-kart-soluk">{bosIse(kayit.PERIYOT_ACIKLAMA)}</span>,
    }),
    kolon("sonUygulama", "ekipmanKarti.bakim.sonUygulamaKisa", {
      width: 112,
      responsive: ["sm"],
      render: (_, kayit) => (
        <span className="ek-kart-soluk">
          <LocalizedDateText value={kayit.SON_UYGULAMA_TARIH} fallback="—" />
        </span>
      ),
    }),
    kolon("sonraki", "ekipmanKarti.bakim.sonraki", {
      width: 112,
      className: "tabular-nums",
      render: (_, kayit) => (
        <span className={gecikmisMi(kayit) ? "text-(--ek-k-hata)" : ""}>
          <LocalizedDateText value={kayit.HEDEF_TARIH} fallback="—" />
        </span>
      ),
    }),
    kolon("sonSayac", "ekipmanKarti.bakim.sonSayac", {
      width: 96,
      responsive: ["xl"],
      align: "right",
      className: "tabular-nums",
      render: (_, kayit) => <span className="ek-kart-soluk">{bosIse(sayiMetni(sonSayac(kayit), dil))}</span>,
    }),
    kolon("kalan", "ekipmanKarti.bakim.kalan", { width: 144, render: (_, kayit) => kalanHucresi(kayit, t, dil) }),
    kolon("durum", "ekipmanKarti.bakim.durum", { width: 128, render: (_, kayit) => durumHucresi(kayit, onIsEmriAc) }),
  ];
};
