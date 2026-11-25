import React from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Kart from "./Kart";
import { Rozet } from "./Rozetler";

const DURUM_TONLARI = { critical: "tehlike", warning: "uyari", info: "bilgi" };

/**
 * Uyari tiklama hedefleri (dokuman 3.1): kritik tank -> tank / stok ekrani, o tankin detayi acik (RefId = TB_DEPO_ID);
 * yuksek tuketim -> arac yakit hareketleri (Yakit Islemleri) o ekipmanla filtreli (EkipmanIds: [RefId]);
 * eksik sayac -> arac yakit hareketleri.
 */
const uyariHedefi = (uyari) => {
  if (uyari.UyariTipi === "KRITIK_TANK") return { yol: "/yakitStoklari", state: uyari.RefId ? { DepoId: uyari.RefId } : undefined };
  if (uyari.UyariTipi === "YUKSEK_TUKETIM") return { yol: "/yakitGirisleri", state: uyari.RefId ? { EkipmanIds: [uyari.RefId] } : undefined };
  if (uyari.UyariTipi === "EKSIK_SAYAC") return { yol: "/yakitGirisleri" };
  return null;
};

/** "Kontrol gerektirenler" (KontrolGerektirenler): stok ve tuketim uyarilari. */
export default function KontrolGerektirenler({ uyarilar }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const liste = uyarilar || [];

  return (
    <Kart baslik={t("yakitAnalizleri.kontrol.baslik")} altBaslik={t("yakitAnalizleri.kontrol.altBaslik")}>
      {liste.length === 0 ? (
        <Empty className="pb-6" image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitAnalizleri.kontrol.uyariYok")} />
      ) : (
        <ul className="m-0 list-none p-0">
          {liste.map((uyari, index) => {
            const hedef = uyariHedefi(uyari);
            const ton = DURUM_TONLARI[uyari.DurumClass] ?? "notr";
            return (
              <li key={`${uyari.UyariTipi}-${uyari.RefId ?? "x"}-${index}`} className="border-t border-(--ya-border)">
                <button type="button" className="ya-uyari" disabled={!hedef} onClick={() => hedef && navigate(hedef.yol, { state: hedef.state })}>
                  <span className={`ya-nokta ya-nokta--${ton}`} />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-[13px] font-semibold">{uyari.Baslik}</span>
                    <span className="block truncate text-[11px] text-(--ya-muted)">{uyari.Detay}</span>
                  </span>
                  <Rozet ton={ton}>{uyari.Durum}</Rozet>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Kart>
  );
}

KontrolGerektirenler.propTypes = {
  uyarilar: PropTypes.arrayOf(
    PropTypes.shape({
      UyariTipi: PropTypes.oneOf(["KRITIK_TANK", "YUKSEK_TUKETIM", "EKSIK_SAYAC"]),
      RefId: PropTypes.number,
      Baslik: PropTypes.string,
      Detay: PropTypes.string,
      Durum: PropTypes.string,
      DurumClass: PropTypes.oneOf(["critical", "warning", "info"]),
    })
  ),
};
