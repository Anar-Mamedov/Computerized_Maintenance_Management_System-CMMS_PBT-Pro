import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Empty, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { LuCog, LuMoreVertical } from "react-icons/lu";
import { BakimRozeti, DurumRozeti, LokasyonBilgisi } from "./Rozetler";
import SatirIslemMenusu from "./islemler/SatirIslemMenusu";

const olayiDurdur = (event) => event.stopPropagation();

function EkipmanKarti({ satir, secili, onSecim, onDetay, onIslem }) {
  const { t } = useTranslation();
  const markaModel = [satir.MKN_MARKA, satir.MKN_MODEL].filter(Boolean).join(" · ");

  const klavyeIleAc = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onDetay(satir);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t("ekipmanListesi.detayiAcAria", { kod: satir.MKN_KOD })}
      className={`ek-ekipman-karti ${secili ? "ek-ekipman-karti--secili" : ""}`}
      onClick={() => onDetay(satir)}
      onKeyDown={klavyeIleAc}
    >
      <div className="relative flex h-32 items-center justify-center rounded-t-lg border-b border-(--ek-border) bg-(--ek-neutral-soft)">
        <LuCog size={36} className="text-(--ek-subtle) opacity-60" />
        <div className="absolute top-2 left-2 flex rounded-md bg-white/90 p-1" onClick={olayiDurdur} onKeyDown={olayiDurdur} role="presentation">
          <Checkbox checked={secili} onChange={(event) => onSecim(satir.clientKey, event.target.checked)} aria-label={t("ekipmanListesi.secAria", { kod: satir.MKN_KOD })} />
        </div>
        <div className="absolute top-2 right-2" onKeyDown={olayiDurdur} role="presentation">
          <SatirIslemMenusu satir={satir} tetikleyici="click" onIslem={onIslem}>
            <button type="button" className="ek-ikon-btn ek-ikon-btn--kucuk" aria-label={t("ekipmanListesi.islemlerAria", { kod: satir.MKN_KOD })} onClick={olayiDurdur}>
              <LuMoreVertical size={16} />
            </button>
          </SatirIslemMenusu>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <p className="m-0 truncate text-[13px] font-medium">{satir.MKN_KOD}</p>
          <p className="m-0 truncate text-[12px] text-(--ek-muted)">{satir.MKN_TANIM}</p>
        </div>
        <LokasyonBilgisi satir={satir} boyut="kart" />
        <p className="m-0 truncate text-[12px] text-(--ek-muted)">{satir.MKN_TIP || "–"}</p>
        <p className="m-0 truncate text-[12px] text-(--ek-subtle)">{markaModel || "–"}</p>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-(--ek-border) pt-2">
          <BakimRozeti satir={satir} />
          <DurumRozeti satir={satir} />
        </div>
        <p className="m-0 truncate text-[11px] text-(--ek-subtle)">{satir.MKN_ATOLYE || "–"}</p>
      </div>
    </div>
  );
}

EkipmanKarti.propTypes = {
  satir: PropTypes.shape({
    clientKey: PropTypes.string.isRequired,
    MKN_KOD: PropTypes.string,
    MKN_TANIM: PropTypes.string,
    MKN_TIP: PropTypes.string,
    MKN_MARKA: PropTypes.string,
    MKN_MODEL: PropTypes.string,
    MKN_ATOLYE: PropTypes.string,
  }).isRequired,
  secili: PropTypes.bool.isRequired,
  onSecim: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
};

/**
 * Kartlar gorunumu; secim ve islemler liste gorunumuyle ortaktir.
 * `govdeKayar` iken yalnizca kart izgarasi kendi icinde kayar.
 */
export default function EkipmanKartlari({ satirlar, yukleniyor, seciliAnahtarlar, onSecimDegistir, onDetay, onIslem, govdeKayar }) {
  const { t } = useTranslation();

  const secimiDegistir = (anahtar, isaretli) => {
    onSecimDegistir(isaretli ? [...seciliAnahtarlar, anahtar] : seciliAnahtarlar.filter((secili) => secili !== anahtar));
  };

  return (
    <div className={govdeKayar ? "min-h-0 flex-1 overflow-y-auto overscroll-contain" : ""}>
      <Spin spinning={yukleniyor}>
        {satirlar.length === 0 ? (
          <div className="py-10">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("ekipmanListesi.kayitBulunamadi")} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {satirlar.map((satir) => (
              <EkipmanKarti
                key={satir.clientKey}
                satir={satir}
                secili={seciliAnahtarlar.includes(satir.clientKey)}
                onSecim={secimiDegistir}
                onDetay={onDetay}
                onIslem={onIslem}
              />
            ))}
          </div>
        )}
      </Spin>
    </div>
  );
}

EkipmanKartlari.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  seciliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
};
