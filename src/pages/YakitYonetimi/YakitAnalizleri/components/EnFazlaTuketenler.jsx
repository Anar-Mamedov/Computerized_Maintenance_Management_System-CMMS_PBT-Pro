import React from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import Kart from "./Kart";
import { FarkRozeti } from "./Rozetler";
import { ondalikli } from "../../ortak/yakitBicim";

/** "En fazla yakit tuketen ekipmanlar" (EnFazlaTuketenEkipmanlar). */
export default function EnFazlaTuketenler({ ekipmanlar }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const liste = ekipmanlar || [];

  return (
    <Kart baslik={t("yakitAnalizleri.enFazla.baslik")} altBaslik={t("yakitAnalizleri.enFazla.altBaslik")}>
      {liste.length === 0 ? (
        <Empty className="pb-6" image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitAnalizleri.veriYok")} />
      ) : (
        <div className="overflow-x-auto">
          <table className="ya-basit-tablo">
            <thead>
              <tr>
                <th>{t("yakitAnalizleri.enFazla.ekipman")}</th>
                <th className="text-right">{t("yakitAnalizleri.enFazla.toplamTuketim")}</th>
                <th className="text-right">{t("yakitAnalizleri.enFazla.ortalama")}</th>
                <th className="text-right">{t("yakitAnalizleri.enFazla.fark30Gun")}</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((ekipman, index) => (
                <tr key={`${ekipman.MakineId}-${index}`}>
                  <td>
                    <div className="font-semibold">{ekipman.EkipmanAdi}</div>
                    <div className="text-[11px] text-(--ya-muted)">{ekipman.EkipmanKodu}</div>
                  </td>
                  <td className="text-right font-semibold whitespace-nowrap">
                    {ondalikli(ekipman.ToplamMiktar, dil)} {t("yakitOrtak.litreKisa")}
                  </td>
                  <td className="text-right whitespace-nowrap text-(--ya-muted)">
                    {ondalikli(ekipman.OrtalamaTuketim, dil)} {ekipman.OrtalamaBirim}
                  </td>
                  <td className="text-right">
                    <FarkRozeti yuzde={ekipman.Fark30GunYuzde} ton={ekipman.FarkTon} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Kart>
  );
}

EnFazlaTuketenler.propTypes = {
  ekipmanlar: PropTypes.arrayOf(
    PropTypes.shape({
      MakineId: PropTypes.number,
      EkipmanAdi: PropTypes.string,
      EkipmanKodu: PropTypes.string,
      ToplamMiktar: PropTypes.number,
      OrtalamaTuketim: PropTypes.number,
      OrtalamaBirim: PropTypes.string,
      Fark30GunYuzde: PropTypes.number,
      FarkTon: PropTypes.oneOf(["up", "down", "flat"]),
    })
  ),
};
