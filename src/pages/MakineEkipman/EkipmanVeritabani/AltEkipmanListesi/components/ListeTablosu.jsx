import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuMoreVertical } from "react-icons/lu";
import KayanTablo from "./KayanTablo";
import IslemMenusu from "./IslemMenusu";
import KolonHucresi from "./KolonHucresi";
import BoyutlanabilirBaslik from "../../../../../utils/components/KolonAyarlari/BoyutlanabilirBaslik";

const TABLO_BILESENLERI = { header: { cell: BoyutlanabilirBaslik } };
const SECIM_KOLONU_GENISLIGI = 40;
const ISLEM_KOLONU_GENISLIGI = 48;

/**
 * Duz liste: her alt ekipman ve tam kirilim yolu (`parentPath`). Kolonlar kolon ayarlarindaki sira ve genislikle
 * cizilir, basliklarin sag kenari surulerek genislik degisir. Siralama yalnizca Ekipman No'ya gore (dokuman).
 */
export default function ListeTablosu({
  satirlar,
  yukleniyor,
  govdeKayar,
  gorunurKolonlar,
  onGenislikDegistir,
  seciliAnahtarlar,
  onSecimDegistir,
  siralama,
  onSirala,
  onDetay,
  onIslem,
}) {
  const { t, i18n } = useTranslation();

  const kolonlar = useMemo(() => {
    // CSS uppercase Turkce i/I harflerini bozdugu icin basliklar dile gore buyutulur.
    const baslik = (metin) => metin.toLocaleUpperCase(i18n.language);
    const siralamaOzellikleri = (kolon) =>
      kolon.key === "code" ? { sorter: true, sortOrder: siralama === "DESC" ? "descend" : "ascend", sortDirections: ["ascend", "descend", "ascend"] } : {};

    return [
      ...gorunurKolonlar.map((kolon, index) => ({
        key: kolon.key,
        title: baslik(kolon.baslik),
        width: kolon.genislik,
        // Yalnizca en bastaki Ekipman No sabitlenir; araya tasinmis sabit kolon yatay kaydirmayi bozar.
        fixed: kolon.key === "code" && index === 0 ? "left" : undefined,
        ...siralamaOzellikleri(kolon),
        render: (_, satir) => <KolonHucresi kolon={kolon} satir={satir} onDetay={onDetay} />,
        onHeaderCell: () => ({ width: kolon.genislik, onResize: (_, { size }) => onGenislikDegistir(kolon.key, size.width) }),
      })),
      {
        key: "islem",
        title: baslik(t("altEkipmanVeritabani.kolon.islem")),
        width: ISLEM_KOLONU_GENISLIGI,
        align: "center",
        fixed: "right",
        render: (_, satir) => (
          <IslemMenusu kayit={satir} onIslem={onIslem}>
            <button type="button" className="ae-ikon-btn" aria-label={t("altEkipmanVeritabani.kolon.islem")}>
              <LuMoreVertical size={16} />
            </button>
          </IslemMenusu>
        ),
      },
    ];
  }, [gorunurKolonlar, i18n.language, onDetay, onGenislikDegistir, onIslem, siralama, t]);

  // Tablo en az kolonlarin toplami kadar genis olur (dar ekranda yatay kayar), genis ekranda karti doldurur.
  const tabloGenisligi = gorunurKolonlar.reduce((toplam, kolon) => toplam + kolon.genislik, SECIM_KOLONU_GENISLIGI + ISLEM_KOLONU_GENISLIGI);

  return (
    <KayanTablo
      kolonlar={kolonlar}
      satirlar={satirlar}
      yukleniyor={yukleniyor}
      govdeKayar={govdeKayar}
      asgariGenislik={tabloGenisligi}
      components={TABLO_BILESENLERI}
      rowSelection={{ columnWidth: SECIM_KOLONU_GENISLIGI, fixed: true, selectedRowKeys: seciliAnahtarlar, onChange: onSecimDegistir }}
      onChange={(_sayfalama, _filtreler, siralayici) => onSirala(siralayici?.order === "descend" ? "DESC" : "ASC")}
    />
  );
}

ListeTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
  gorunurKolonlar: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string.isRequired, baslik: PropTypes.string.isRequired, genislik: PropTypes.number.isRequired })).isRequired,
  onGenislikDegistir: PropTypes.func.isRequired,
  seciliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  siralama: PropTypes.oneOf(["ASC", "DESC"]).isRequired,
  onSirala: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
};
