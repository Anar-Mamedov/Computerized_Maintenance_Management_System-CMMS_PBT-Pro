import React from "react";
import PropTypes from "prop-types";
import { Tooltip, theme } from "antd";
import { useTranslation } from "react-i18next";
import { LuAlertOctagon, LuAlertTriangle, LuCheckCircle, LuMapPin } from "react-icons/lu";
import LocalizedDateText from "../../../../../utils/components/LocalizedDateText";
import { bakimDurumunuBul, durumTonu } from "../ekipmanMetinleri";

const BAKIM_IKONLARI = { success: LuCheckCircle, warning: LuAlertTriangle, danger: LuAlertOctagon };

/** Ekipman durumu (MKN_DURUM). Deger yoksa aktiflik bilgisine gore Aktif/Pasif yazilir. */
export function DurumRozeti({ satir }) {
  const { t } = useTranslation();
  const etiket = satir.MKN_DURUM || (satir.MKN_AKTIF === false ? t("pasif") : t("aktif"));

  return <span className={`ek-rozet ek-rozet--${durumTonu(satir)}`}>{etiket}</span>;
}

/** Periyodik bakim durumu rozeti ve sonraki bakim tarihi. */
export function BakimRozeti({ satir }) {
  const { t } = useTranslation();
  const bakim = bakimDurumunuBul(satir.BAKIM_DURUM);

  if (!bakim) {
    return <span className="text-(--ek-subtle)">–</span>;
  }

  const Ikon = BAKIM_IKONLARI[bakim.ton];
  return (
    <div className="flex flex-col gap-1">
      <span className={`ek-rozet ek-rozet--${bakim.ton}`}>
        <Ikon size={14} className="shrink-0" />
        {t(bakim.labelKey)}
      </span>
      {satir.BAKIM_HEDEF_TARIH && (
        <span className="text-[11px] text-(--ek-subtle)">
          {t("ekipmanListesi.sonraki")} <LocalizedDateText value={satir.BAKIM_HEDEF_TARIH} />
        </span>
      )}
    </div>
  );
}

/** Lokasyon ve ana lokasyon; uzerine gelince tam yol gosterilir. */
export function LokasyonBilgisi({ satir, boyut = "tablo" }) {
  const { token } = theme.useToken();
  const anaMetinBoyutu = boyut === "tablo" ? "text-[13px]" : "text-[12px]";
  const icerik = (
    <div className="min-w-0">
      <span className={`flex items-center gap-1 ${anaMetinBoyutu}`}>
        <LuMapPin size={14} className="shrink-0 text-(--ek-subtle)" />
        <span className="truncate">{satir.MKN_LOKASYON || "–"}</span>
      </span>
      {satir.MKN_ANA_LOKASYON && <span className="block truncate pl-[18px] text-[12px] text-(--ek-muted)">{satir.MKN_ANA_LOKASYON}</span>}
    </div>
  );

  if (!satir.MKN_LOKASYON_TUM_YOL) return icerik;

  return (
    <Tooltip title={satir.MKN_LOKASYON_TUM_YOL} color={token.colorPrimary} mouseEnterDelay={0.3}>
      {icerik}
    </Tooltip>
  );
}

const satirTipi = PropTypes.shape({
  MKN_DURUM: PropTypes.string,
  MKN_AKTIF: PropTypes.bool,
  BAKIM_DURUM: PropTypes.string,
  BAKIM_HEDEF_TARIH: PropTypes.string,
  MKN_LOKASYON: PropTypes.string,
  MKN_ANA_LOKASYON: PropTypes.string,
  MKN_LOKASYON_TUM_YOL: PropTypes.string,
});

DurumRozeti.propTypes = { satir: satirTipi.isRequired };
BakimRozeti.propTypes = { satir: satirTipi.isRequired };
LokasyonBilgisi.propTypes = { satir: satirTipi.isRequired, boyut: PropTypes.oneOf(["tablo", "kart"]) };
