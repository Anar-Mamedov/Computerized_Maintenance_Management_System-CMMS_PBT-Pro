import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";
import { SAYFA_BOYUTLARI } from "../constants";

const BOSLUK = "…";

/** Ilk, son, aktif sayfa ve komsulari gosterilir; aradaki bosluklar "…" ile kisaltilir. */
const sayfaNumaralari = (sayfa, toplamSayfa) => {
  const numaralar = [];
  for (let numara = 1; numara <= toplamSayfa; numara += 1) {
    if (numara === 1 || numara === toplamSayfa || Math.abs(numara - sayfa) <= 1) {
      numaralar.push(numara);
    } else if (numaralar[numaralar.length - 1] !== BOSLUK) {
      numaralar.push(BOSLUK);
    }
  }
  return numaralar;
};

export default function Sayfalama({ sayfa, sayfaBoyutu, toplam, onSayfaDegistir, onSayfaBoyutuDegistir }) {
  const { t, i18n } = useTranslation();
  const toplamSayfa = Math.max(1, Math.ceil(toplam / sayfaBoyutu));
  const baslangic = toplam === 0 ? 0 : (sayfa - 1) * sayfaBoyutu + 1;
  const bitis = Math.min(sayfa * sayfaBoyutu, toplam);
  const sayi = (deger) => formatNumberWithSeparators(deger, i18n.language);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-(--ek-border) px-3 py-3 sm:flex-row">
      <p className="m-0 text-[12px] text-(--ek-muted)">{t("ekipmanListesi.kayitAraligi", { baslangic: sayi(baslangic), bitis: sayi(bitis), toplam: sayi(toplam) })}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-(--ek-subtle)">{t("ekipmanListesi.sayfaBasina")}</span>
          <Select
            size="middle"
            className="w-[76px]"
            aria-label={t("ekipmanListesi.sayfaBasinaAria")}
            value={sayfaBoyutu}
            onChange={onSayfaBoyutuDegistir}
            options={SAYFA_BOYUTLARI.map((boyut) => ({ value: boyut, label: String(boyut) }))}
          />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-1" aria-label={t("ekipmanListesi.sayfalamaAria")}>
          <button type="button" className="ek-sayfa-btn" disabled={sayfa <= 1} aria-label={t("ekipmanListesi.oncekiSayfa")} onClick={() => onSayfaDegistir(sayfa - 1)}>
            <LuChevronLeft size={16} />
          </button>
          {sayfaNumaralari(sayfa, toplamSayfa).map((numara, index) =>
            numara === BOSLUK ? (
              <span key={`bosluk-${index}`} className="px-1 text-[12px] text-(--ek-subtle)">
                {BOSLUK}
              </span>
            ) : (
              <button
                key={numara}
                type="button"
                className={`ek-sayfa-btn ${numara === sayfa ? "ek-sayfa-btn--aktif" : ""}`}
                aria-label={t("ekipmanListesi.sayfaNo", { no: numara })}
                aria-current={numara === sayfa ? "page" : undefined}
                onClick={() => onSayfaDegistir(numara)}
              >
                {sayi(numara)}
              </button>
            )
          )}
          <button type="button" className="ek-sayfa-btn" disabled={sayfa >= toplamSayfa} aria-label={t("ekipmanListesi.sonrakiSayfa")} onClick={() => onSayfaDegistir(sayfa + 1)}>
            <LuChevronRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
}

Sayfalama.propTypes = {
  sayfa: PropTypes.number.isRequired,
  sayfaBoyutu: PropTypes.number.isRequired,
  toplam: PropTypes.number.isRequired,
  onSayfaDegistir: PropTypes.func.isRequired,
  onSayfaBoyutuDegistir: PropTypes.func.isRequired,
};
