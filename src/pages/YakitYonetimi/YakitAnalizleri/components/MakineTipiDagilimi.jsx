import React from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Kart, { KartEylemi } from "./Kart";
import { ondalikli, yuzde } from "../../ortak/yakitBicim";

const RENKLER = ["#d9822b", "#4f7cbf", "#3d8a5a", "#b0b7c3", "#9c8fd6", "#c25b56", "#5aa6a6", "#8a6d3b"];

/** "Makine tiplerine gore tuketim" halka grafigi (MakineTipiDagilimi); "Tip analizi" modali acar. */
export default function MakineTipiDagilimi({ dagilim, toplam, onTipAnalizi }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const veri = dagilim || [];

  return (
    <Kart
      baslik={t("yakitAnalizleri.makineTipi.baslik")}
      altBaslik={t("yakitAnalizleri.makineTipi.altBaslik")}
      eylem={<KartEylemi etiket={t("yakitAnalizleri.makineTipi.tipAnalizi")} onClick={onTipAnalizi} />}
    >
      {veri.length === 0 ? (
        <Empty className="pb-6" image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitAnalizleri.veriYok")} />
      ) : (
        <div className="flex flex-1 flex-wrap items-center gap-4 px-5 pb-5">
          <div className="relative h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={veri} dataKey="Miktar" nameKey="TipAdi" innerRadius={58} outerRadius={84} paddingAngle={2} stroke="none">
                  {veri.map((tip, index) => (
                    <Cell key={tip.TipId} fill={RENKLER[index % RENKLER.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(deger, ad) => [`${ondalikli(deger, dil)} ${t("yakitOrtak.litreKisa")}`, ad]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[16px] font-bold">{ondalikli(toplam, dil)}</span>
              <span className="text-[11px] text-(--ya-muted)">{t("yakitAnalizleri.makineTipi.toplamLitre")}</span>
            </div>
          </div>
          <ul className="m-0 flex min-w-[180px] flex-1 list-none flex-col gap-3 p-0">
            {veri.map((tip, index) => (
              <li key={tip.TipId} className="flex items-center gap-2 text-[12px]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: RENKLER[index % RENKLER.length] }} />
                <span className="min-w-0 flex-1 truncate">{tip.TipAdi}</span>
                <span className="font-semibold whitespace-nowrap">
                  {ondalikli(tip.Miktar, dil)} {t("yakitOrtak.litreKisa")}
                </span>
                <span className="ya-rozet ya-rozet--notr">{yuzde(tip.PayYuzde, dil, t)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Kart>
  );
}

MakineTipiDagilimi.propTypes = {
  dagilim: PropTypes.arrayOf(PropTypes.shape({ TipId: PropTypes.number, TipAdi: PropTypes.string, Miktar: PropTypes.number, PayYuzde: PropTypes.number })),
  toplam: PropTypes.number,
  onTipAnalizi: PropTypes.func.isRequired,
};
