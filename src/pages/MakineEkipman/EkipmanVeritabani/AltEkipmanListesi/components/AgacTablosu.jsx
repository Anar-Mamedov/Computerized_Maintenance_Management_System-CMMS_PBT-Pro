import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuCog, LuMoreVertical, LuPackage } from "react-icons/lu";
import KayanTablo from "./KayanTablo";
import IslemMenusu from "./IslemMenusu";
import KolonHucresi from "./KolonHucresi";
import BoyutlanabilirBaslik from "../../../../../utils/components/KolonAyarlari/BoyutlanabilirBaslik";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

const TABLO_BILESENLERI = { header: { cell: BoyutlanabilirBaslik } };
const GRUP_GIZLI_SECIM = { disabled: true, style: { display: "none" } };
const SECIM_KOLONU_GENISLIGI = 40;
const EKIPMAN_KOLONU_GENISLIGI = 340;
const ISLEM_KOLONU_GENISLIGI = 56;

/**
 * Agac gorunumu: her makine bir grup satiridir, altinda alt ekipmanlar sinirsiz derinlikte acilir; en altta
 * "STOK / BAGIMSIZ" grubu durur. Gruplar ilk yuklemede acik gelir; grup satirlari secilemez ve islem menusu yoktur.
 * Ilk kolon (kod + tanim) sabittir; digerleri liste ile ayni kolon ayarlarindan gelir (`agacta: false` olanlar haric).
 */
export default function AgacTablosu({ satirlar, yukleniyor, govdeKayar, gorunurKolonlar, onGenislikDegistir, seciliAnahtarlar, onSecimDegistir, onDetay, onIslem }) {
  const { t, i18n } = useTranslation();
  const [acikAnahtarlar, setAcikAnahtarlar] = useState([]);

  useEffect(() => {
    setAcikAnahtarlar(satirlar.map((grup) => grup.clientKey));
  }, [satirlar]);

  const agacKolonlari = useMemo(() => gorunurKolonlar.filter((kolon) => kolon.agacta !== false), [gorunurKolonlar]);

  const kolonlar = useMemo(() => {
    const baslik = (metin) => metin.toLocaleUpperCase(i18n.language);
    const sayi = (deger) => formatNumberWithSeparators(deger ?? 0, i18n.language);

    return [
      {
        key: "ekipman",
        title: baslik(t("altEkipmanVeritabani.kolon.ekipmanNoTanim")),
        width: EKIPMAN_KOLONU_GENISLIGI,
        render: (_, satir) =>
          satir.grup ? (
            <div className="ae-grup">
              <span className="ae-grup-ikon">{satir.isUnassignedGroup ? <LuPackage size={14} /> : <LuCog size={14} />}</span>
              <div className="ae-tasan-kap">
                <div className="ae-tasan">
                  <strong>{satir.code}</strong> <span className="ae-soluk">({sayi(satir.totalEquipmentCount)})</span>
                </div>
                <div className="ae-soluk ae-kucuk ae-tasan">{satir.subtitle}</div>
              </div>
            </div>
          ) : (
            <span className="ae-tasan">
              <button type="button" className="ae-link" onClick={() => onDetay(satir)}>
                {satir.code}
              </button>{" "}
              <span className="ae-kalin">{satir.name}</span>
              {satir.childCount > 0 && <span className="ae-soluk"> ({sayi(satir.childCount)})</span>}
            </span>
          ),
      },
      // Grup satirinda yalnizca ilk kolon dolu; digerleri bos kalir.
      ...agacKolonlari.map((kolon) => ({
        key: kolon.key,
        title: baslik(kolon.baslik),
        width: kolon.genislik,
        render: (_, satir) => (satir.grup ? null : <KolonHucresi kolon={kolon} satir={satir} onDetay={onDetay} />),
        onHeaderCell: () => ({ width: kolon.genislik, onResize: (_, { size }) => onGenislikDegistir(kolon.key, size.width) }),
      })),
      {
        key: "islem",
        title: baslik(t("altEkipmanVeritabani.kolon.islem")),
        width: ISLEM_KOLONU_GENISLIGI,
        align: "center",
        fixed: "right",
        render: (_, satir) =>
          satir.grup ? null : (
            <IslemMenusu kayit={satir} onIslem={onIslem}>
              <button type="button" className="ae-ikon-btn" aria-label={t("altEkipmanVeritabani.kolon.islem")}>
                <LuMoreVertical size={16} />
              </button>
            </IslemMenusu>
          ),
      },
    ];
  }, [agacKolonlari, i18n.language, onDetay, onGenislikDegistir, onIslem, t]);

  const tabloGenisligi = agacKolonlari.reduce((toplam, kolon) => toplam + kolon.genislik, SECIM_KOLONU_GENISLIGI + EKIPMAN_KOLONU_GENISLIGI + ISLEM_KOLONU_GENISLIGI);

  return (
    <KayanTablo
      kolonlar={kolonlar}
      satirlar={satirlar}
      yukleniyor={yukleniyor}
      govdeKayar={govdeKayar}
      asgariGenislik={tabloGenisligi}
      components={TABLO_BILESENLERI}
      rowClassName={(satir) => (satir.grup ? "ae-grup-satiri" : "")}
      expandable={{ expandedRowKeys: acikAnahtarlar, onExpandedRowsChange: setAcikAnahtarlar, indentSize: 22 }}
      rowSelection={{
        columnWidth: SECIM_KOLONU_GENISLIGI,
        checkStrictly: true,
        selectedRowKeys: seciliAnahtarlar,
        onChange: onSecimDegistir,
        getCheckboxProps: (satir) => (satir.grup ? GRUP_GIZLI_SECIM : {}),
      }}
    />
  );
}

AgacTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
  gorunurKolonlar: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired, baslik: PropTypes.string.isRequired, genislik: PropTypes.number.isRequired, agacta: PropTypes.bool })
  ).isRequired,
  onGenislikDegistir: PropTypes.func.isRequired,
  seciliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
};
