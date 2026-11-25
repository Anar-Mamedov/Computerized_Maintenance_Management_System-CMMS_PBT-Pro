import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuCoins, LuFuel, LuGauge, LuWallet } from "react-icons/lu";
import { isaretliYuzde, ondalikli, sayi } from "../../ortak/yakitBicim";

/**
 * 3. KPI (dokuman 3.1): km varsa L / 1000 km ve toplam km; filo tamamen is makinesiyse (km 0, saat > 0) L / saat
 * ve toplam saat gosterilir.
 */
const ortalamaTuketim = (kpi, dil, t) => {
  const toplamKm = Number(kpi.ToplamKm) || 0;
  const toplamSaat = Number(kpi.ToplamSaat) || 0;
  if (toplamKm === 0 && toplamSaat > 0) {
    return {
      deger: t("yakitAnalizleri.kpi.litreSaat", { deger: ondalikli(kpi.OrtalamaTuketimSaat, dil) }),
      alt: t("yakitAnalizleri.kpi.toplamSaat", { deger: sayi(toplamSaat, dil) }),
    };
  }
  return {
    deger: t("yakitAnalizleri.kpi.litre1000Km", { deger: ondalikli(kpi.OrtalamaTuketim1000Km, dil) }),
    alt: t("yakitAnalizleri.kpi.toplamKm", { deger: sayi(toplamKm, dil) }),
  };
};

export default function KpiKartlari({ kpi }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const tuketim = kpi ? ortalamaTuketim(kpi, dil, t) : null;

  const kartlar = [
    {
      key: "miktar",
      Ikon: LuFuel,
      ton: "mavi",
      baslik: t("yakitAnalizleri.kpi.toplamYakitMiktari"),
      deger: kpi && `${ondalikli(kpi.ToplamYakitMiktari, dil)} ${t("yakitOrtak.litreKisa")}`,
      fark: kpi?.ToplamYakitFarkYuzde,
      alt: t("yakitAnalizleri.kpi.secilenTarihAraligi"),
    },
    {
      key: "tutar",
      Ikon: LuCoins,
      ton: "turuncu",
      baslik: t("yakitAnalizleri.kpi.toplamYakitTutari"),
      deger: kpi && `${ondalikli(kpi.ToplamYakitTutari, dil)} ${t("yakitOrtak.tl")}`,
      fark: kpi?.ToplamTutarFarkYuzde,
      alt: kpi && t("yakitAnalizleri.kpi.ortalamaFiyat", { deger: ondalikli(kpi.OrtalamaBirimFiyat, dil) }),
    },
    {
      key: "tuketim",
      Ikon: LuGauge,
      ton: "yesil",
      baslik: t("yakitAnalizleri.kpi.ortalamaTuketim"),
      deger: tuketim?.deger,
      fark: kpi?.OrtalamaTuketimFarkYuzde,
      alt: tuketim?.alt,
    },
    {
      key: "maliyet",
      Ikon: LuWallet,
      ton: "mor",
      baslik: t("yakitAnalizleri.kpi.ekipmanBasinaMaliyet"),
      deger: kpi && `${ondalikli(kpi.EkipmanBasinaMaliyet, dil)} ${t("yakitOrtak.tl")}`,
      fark: kpi?.EkipmanBasinaMaliyetFarkYuzde,
      alt: kpi && t("yakitAnalizleri.kpi.ekipmanSayisi", { deger: sayi(kpi.EkipmanSayisi, dil) }),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kartlar.map(({ key, Ikon, ton, baslik, deger, fark, alt }) => (
        <div key={key} className="ya-kart p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className={`ya-kpi-ikon ya-kpi-ikon--${ton}`}>
                <Ikon size={18} />
              </span>
              <p className="m-0 text-[12px] leading-tight font-semibold tracking-wide text-(--ya-muted) uppercase">{baslik}</p>
            </div>
            {kpi && <span className="ya-rozet ya-rozet--basari">{isaretliYuzde(fark, dil, t)}</span>}
          </div>
          <p className="m-0 mt-4 text-[24px] leading-tight font-bold tracking-tight">{deger || "–"}</p>
          <p className="m-0 mt-1 truncate text-[12px] text-(--ya-muted)">{alt}</p>
        </div>
      ))}
    </div>
  );
}

KpiKartlari.propTypes = {
  kpi: PropTypes.shape({
    ToplamYakitMiktari: PropTypes.number,
    ToplamYakitFarkYuzde: PropTypes.number,
    ToplamYakitTutari: PropTypes.number,
    ToplamTutarFarkYuzde: PropTypes.number,
    OrtalamaBirimFiyat: PropTypes.number,
    OrtalamaTuketim1000Km: PropTypes.number,
    OrtalamaTuketim100Km: PropTypes.number,
    OrtalamaTuketimSaat: PropTypes.number,
    OrtalamaTuketimFarkYuzde: PropTypes.number,
    ToplamKm: PropTypes.number,
    ToplamSaat: PropTypes.number,
    EkipmanBasinaMaliyet: PropTypes.number,
    EkipmanBasinaMaliyetFarkYuzde: PropTypes.number,
    EkipmanSayisi: PropTypes.number,
  }),
};
