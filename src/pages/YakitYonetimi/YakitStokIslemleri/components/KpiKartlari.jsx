import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuArrowDownToLine, LuArrowLeftRight, LuArrowUpFromLine, LuDatabase } from "react-icons/lu";
import { ondalikli } from "../../ortak/yakitBicim";

/** Ust 4 KPI (GetYakitStokIslemListesi `Ozetler`). */
const KARTLAR = [
  { alan: "ToplamGiris", baslikKey: "yakitStokIslemleri.kpi.toplamGiris", Ikon: LuArrowDownToLine, ton: "giris" },
  { alan: "ToplamCikis", baslikKey: "yakitStokIslemleri.kpi.toplamCikis", Ikon: LuArrowUpFromLine, ton: "cikis" },
  { alan: "ToplamTransfer", baslikKey: "yakitStokIslemleri.kpi.toplamTransfer", Ikon: LuArrowLeftRight, ton: "transfer" },
  { alan: "MevcutDepoStoku", baslikKey: "yakitStokIslemleri.kpi.mevcutDepoStoku", Ikon: LuDatabase, ton: "stok" },
];

export default function KpiKartlari({ ozetler }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {KARTLAR.map(({ alan, baslikKey, Ikon, ton }) => (
        <div key={alan} className="ys-kart flex items-center gap-4 p-4">
          <span className={`ys-kpi-ikon ys-kpi-ikon--${ton}`}>
            <Ikon size={22} />
          </span>
          <div className="min-w-0">
            <p className="m-0 text-[13px] font-medium text-(--ys-muted)">{t(baslikKey)}</p>
            <p className="m-0 mt-1 truncate text-[22px] font-bold tracking-tight">{ozetler ? `${ondalikli(ozetler[alan], i18n.language)} ${t("yakitOrtak.lt")}` : "–"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

KpiKartlari.propTypes = {
  ozetler: PropTypes.shape({
    ToplamGiris: PropTypes.number,
    ToplamCikis: PropTypes.number,
    ToplamTransfer: PropTypes.number,
    MevcutDepoStoku: PropTypes.number,
  }),
};
