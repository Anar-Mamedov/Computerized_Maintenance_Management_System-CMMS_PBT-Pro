import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import { KAYIT_KAYNAKLARI } from "../sabitler";
import { artisMetni, sayiMetni } from "../yardimcilar";

/** Kayit kaynagi rozeti (Entegrasyon / Mobil / Manuel); bilinmeyen kaynakta backend metni yazilir. */
export function KaynakRozeti({ kaynak }) {
  const { t } = useTranslation();
  const anahtar = KAYIT_KAYNAKLARI[kaynak];
  return <Tag className="sh-rozet">{anahtar ? t(`sayacHareketleri.kaynak.${anahtar}`) : kaynak || "–"}</Tag>;
}

/** Ust satirda kalin, alt satirda soluk iki satirlik hucre (tarih + saat, kod + tanim). */
export function IkiSatir({ ust, alt }) {
  return (
    <div className="sh-iki-satir">
      <span className="sh-kalin" title={typeof ust === "string" ? ust : undefined}>
        {ust || "–"}
      </span>
      {alt && (
        <span className="sh-soluk sh-kucuk" title={typeof alt === "string" ? alt : undefined}>
          {alt}
        </span>
      )}
    </div>
  );
}

/** Sayac degeri ve soluk birimi (2.683 saat). */
export function DegerBirim({ deger, birim, ondalik }) {
  const { i18n } = useTranslation();
  return (
    <span>
      <span className="sh-kalin">{sayiMetni(deger, i18n.language, ondalik)}</span>
      {birim && <span className="sh-soluk sh-kucuk"> {birim}</span>}
    </span>
  );
}

/** Isaretli artis: pozitif yesil, negatif kirmizi, sifir soluk. */
export function Artis({ deger }) {
  const { i18n } = useTranslation();
  const sayi = Number(deger);
  const sinif = sayi > 0 ? "sh-artis--pozitif" : sayi < 0 ? "sh-artis--negatif" : "sh-soluk";
  return <span className={`sh-kalin ${sinif}`}>{artisMetni(deger, i18n.language)}</span>;
}

KaynakRozeti.propTypes = { kaynak: PropTypes.string };
IkiSatir.propTypes = { ust: PropTypes.node, alt: PropTypes.node };
DegerBirim.propTypes = { deger: PropTypes.number, birim: PropTypes.string, ondalik: PropTypes.number };
Artis.propTypes = { deger: PropTypes.number };
