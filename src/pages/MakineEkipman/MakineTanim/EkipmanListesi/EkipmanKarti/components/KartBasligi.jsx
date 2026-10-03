import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuLoader2, LuQrCode, LuX } from "react-icons/lu";
import Rozet from "./ortak/Rozet";

/** Cekmecenin sabit ust bolumu: yol, ekipman kodu / tanimi / rozetler, dugmeler ve sekme cubugu. */
export default function KartBasligi({ sekmeler, aktifSekme, onSekmeDegistir, kaydediliyor, yukleniyor, onKapat, onQr, onGuncelle }) {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const [kod, tanim, aktif, durum] = watch(["makineKodu", "makineTanimi", "makineAktif", "operasyonDurumuText"]);

  return (
    <header className="ek-kart-ust">
      <div className="ek-kart-ust__satir">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" className="ek-kart-ikon-btn" aria-label={t("ekipmanKarti.kapat")} onClick={onKapat}>
              <LuX size={16} />
            </button>
            <p className="ek-kart-yol m-0">{t("ekipmanKarti.yol")}</p>
          </div>
          {!yukleniyor && (
            <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2 pl-1">
              <span className="text-sm font-semibold">{kod}</span>
              {tanim && (
                <>
                  <span className="ek-kart-ayrac-dikey" />
                  <span className="truncate text-sm">{tanim}</span>
                </>
              )}
              <Rozet ton={aktif ? "basari" : "notr"}>{aktif ? t("ekipmanKarti.aktif") : t("ekipmanKarti.pasif")}</Rozet>
              {durum && <Rozet ton="birincil">{durum}</Rozet>}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className="ek-kart-btn" onClick={onQr} disabled={yukleniyor}>
            <LuQrCode size={14} />
            {t("ekipmanKarti.qrKod")}
          </button>
          <button type="button" className="ek-kart-btn" onClick={onKapat}>
            {t("ekipmanKarti.iptal")}
          </button>
          <button type="button" className="ek-kart-btn ek-kart-btn--birincil" onClick={onGuncelle} disabled={yukleniyor || kaydediliyor}>
            {kaydediliyor && <LuLoader2 size={14} className="animate-spin" />}
            {t("ekipmanKarti.guncelle")}
          </button>
        </div>
      </div>

      <nav className="ek-kart-sekmeler" role="tablist" aria-label={t("ekipmanKarti.sekmeler")}>
        {sekmeler.map((sekme) => (
          <button
            key={sekme.key}
            type="button"
            role="tab"
            aria-selected={sekme.key === aktifSekme}
            className={`ek-kart-sekme ${sekme.key === aktifSekme ? "ek-kart-sekme--aktif" : ""}`}
            onClick={() => onSekmeDegistir(sekme.key)}
          >
            {sekme.etiket}
            {sekme.sayi !== undefined && <span className="ek-kart-sekme__sayi">({sekme.sayi})</span>}
          </button>
        ))}
      </nav>
    </header>
  );
}

KartBasligi.propTypes = {
  sekmeler: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string.isRequired, etiket: PropTypes.string.isRequired, sayi: PropTypes.number })).isRequired,
  aktifSekme: PropTypes.string.isRequired,
  onSekmeDegistir: PropTypes.func.isRequired,
  kaydediliyor: PropTypes.bool,
  yukleniyor: PropTypes.bool,
  onKapat: PropTypes.func.isRequired,
  onQr: PropTypes.func.isRequired,
  onGuncelle: PropTypes.func.isRequired,
};
