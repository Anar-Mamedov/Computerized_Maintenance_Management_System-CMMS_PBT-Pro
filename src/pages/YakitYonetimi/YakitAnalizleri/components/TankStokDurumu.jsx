import React from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Kart, { KartEylemi } from "./Kart";
import { Rozet } from "./Rozetler";
import { ondalikli } from "../../ortak/yakitBicim";

/**
 * "Tank ve tanker stok durumu" (TankStokDurumu). Cubuk rengi `Durum`'a gore (dokuman 3.1): critical kirmizi
 * (+ Kritik rozeti), normal marka rengi, high (>= %85) yesil. "Stok ekrani" mevcut Yakit Depolari / Tanklar ekranina gider.
 */
export default function TankStokDurumu({ tanklar }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dil = i18n.language;
  const liste = tanklar || [];

  return (
    <Kart
      baslik={t("yakitAnalizleri.tank.baslik")}
      altBaslik={t("yakitAnalizleri.tank.altBaslik")}
      eylem={<KartEylemi etiket={t("yakitAnalizleri.tank.stokEkrani")} onClick={() => navigate("/yakitStoklari")} />}
    >
      {liste.length === 0 ? (
        <Empty className="pb-6" image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitAnalizleri.veriYok")} />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 px-5 pb-5">
          {liste.map((tank) => (
            <li key={tank.DepoId}>
              <div className="flex items-center justify-between gap-3 text-[12px]">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-semibold">{tank.DepoTanim}</span>
                  {tank.Durum === "critical" && <Rozet ton="tehlike">{t("yakitAnalizleri.tank.kritik")}</Rozet>}
                </span>
                <span className="whitespace-nowrap text-(--ya-muted)">
                  {t("yakitAnalizleri.tank.doluluk", {
                    mevcut: ondalikli(tank.MevcutMiktar, dil),
                    kapasite: ondalikli(tank.Kapasite, dil),
                    oran: ondalikli(tank.DolulukOrani, dil),
                  })}
                </span>
              </div>
              <div className="ya-ilerleme mt-1.5">
                <span className={`ya-ilerleme-dolgu ya-ilerleme-dolgu--${tank.Durum}`} style={{ width: `${Math.min(Math.max(Number(tank.DolulukOrani) || 0, 0), 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Kart>
  );
}

TankStokDurumu.propTypes = {
  tanklar: PropTypes.arrayOf(
    PropTypes.shape({
      DepoId: PropTypes.number,
      DepoTanim: PropTypes.string,
      MevcutMiktar: PropTypes.number,
      Kapasite: PropTypes.number,
      DolulukOrani: PropTypes.number,
      Durum: PropTypes.oneOf(["critical", "normal", "high"]),
    })
  ),
};
