import React from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import dayjs from "dayjs";
import Kart from "./Kart";
import { ondalikli, sayi } from "../../ortak/yakitBicim";

const RENK = "#9c8fd6";
const AKTIF_AY_RENGI = "#7466c0";

/** Ay adi uygulamanin dilinde yazilir (backend'in Turkce `AyAdi` yerine `AyNo`'dan). */
const ayAdi = (ayNo, dil) =>
  dayjs()
    .locale(dil)
    .month(ayNo - 1)
    .format("MMMM");

/** "Aylik yakit tuketimleri" (AylikTuketimler); aktif ay koyu, sag ustte aktif ay ozeti. */
export default function AylikTuketimGrafigi({ yil, aylar, aktifAy }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const veri = (aylar || []).map((ay) => ({ ...ay, etiket: ayAdi(ay.AyNo, dil) }));

  return (
    <Kart
      baslik={t("yakitAnalizleri.aylik.baslik")}
      altBaslik={t("yakitAnalizleri.aylik.altBaslik", { yil: yil ?? "" })}
      eylem={
        aktifAy && <span className="ya-rozet ya-rozet--mor">{t("yakitAnalizleri.aylik.aktifAy", { ay: ayAdi(aktifAy.AyNo, dil), deger: ondalikli(aktifAy.Miktar, dil) })}</span>
      }
    >
      <div className="h-[300px] px-3 pb-3">
        {veri.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitAnalizleri.veriYok")} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={veri} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="etiket" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6e7075" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fontSize: 11, fill: "#6e7075" }}
                allowDecimals={false}
                // Binin altindaki degerler (ör. hic tuketim yokken 0–4 ekseni) "bin"e cevrilmeden yazilir.
                tickFormatter={(deger) => (Math.abs(deger) >= 1000 ? t("yakitAnalizleri.bin", { deger: sayi(deger / 1000, dil) }) : sayi(deger, dil))}
              />
              <Tooltip
                cursor={{ fill: "rgba(116, 102, 192, 0.08)" }}
                formatter={(deger) => [`${ondalikli(deger, dil)} ${t("yakitOrtak.litreKisa")}`, t("yakitAnalizleri.aylik.miktar")]}
              />
              <Bar dataKey="Miktar" radius={[4, 4, 0, 0]} maxBarSize={64}>
                {veri.map((ay) => (
                  <Cell key={ay.AyNo} fill={ay.AktifAyMi ? AKTIF_AY_RENGI : RENK} />
                ))}
                <LabelList dataKey="Miktar" position="top" style={{ fontSize: 10, fill: "#2b2c2f" }} formatter={(deger) => ondalikli(deger, dil)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Kart>
  );
}

AylikTuketimGrafigi.propTypes = {
  yil: PropTypes.number,
  aylar: PropTypes.arrayOf(PropTypes.shape({ AyNo: PropTypes.number, Miktar: PropTypes.number, AktifAyMi: PropTypes.bool })),
  aktifAy: PropTypes.shape({ AyNo: PropTypes.number, Miktar: PropTypes.number }),
};
