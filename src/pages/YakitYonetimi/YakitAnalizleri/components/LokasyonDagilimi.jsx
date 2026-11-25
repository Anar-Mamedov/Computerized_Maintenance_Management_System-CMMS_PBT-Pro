import React from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import Kart, { KartEylemi } from "./Kart";
import { ondalikli } from "../../ortak/yakitBicim";

/** Ilk lokasyondan sonrakilere acilan tonlar (tasarimdaki kahverengi -> acik bej). */
const TONLAR = ["#9a5b1e", "#d9822b", "#e3a066", "#ecbf94", "#f3d7bd"];

/** "Lokasyonlara gore tuketim" cubuklari (LokasyonDagilimi); "Karsilastir" modali acar. */
export default function LokasyonDagilimi({ lokasyonlar, onKarsilastir }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const liste = lokasyonlar || [];
  const enBuyuk = Math.max(...liste.map((lokasyon) => Number(lokasyon.Miktar) || 0), 0);

  return (
    <Kart
      baslik={t("yakitAnalizleri.lokasyon.baslik")}
      altBaslik={t("yakitAnalizleri.lokasyon.altBaslik")}
      eylem={<KartEylemi etiket={t("yakitAnalizleri.lokasyon.karsilastir")} onClick={onKarsilastir} />}
    >
      {liste.length === 0 ? (
        <Empty className="pb-6" image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitAnalizleri.veriYok")} />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 px-5 pb-5">
          {liste.map((lokasyon, index) => (
            <li key={lokasyon.LokasyonId}>
              <div className="flex items-center justify-between gap-3 text-[12px]">
                <span className="truncate font-semibold">{lokasyon.LokasyonAdi}</span>
                <span className="whitespace-nowrap text-(--ya-muted)">
                  {ondalikli(lokasyon.Miktar, dil)} {t("yakitOrtak.litreKisa")}
                </span>
              </div>
              <div className="ya-ilerleme mt-1.5">
                <span
                  className="ya-ilerleme-dolgu"
                  style={{ width: enBuyuk > 0 ? `${((Number(lokasyon.Miktar) || 0) / enBuyuk) * 100}%` : 0, background: TONLAR[Math.min(index, TONLAR.length - 1)] }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Kart>
  );
}

LokasyonDagilimi.propTypes = {
  lokasyonlar: PropTypes.arrayOf(PropTypes.shape({ LokasyonId: PropTypes.number, LokasyonAdi: PropTypes.string, Miktar: PropTypes.number })),
  onKarsilastir: PropTypes.func.isRequired,
};
