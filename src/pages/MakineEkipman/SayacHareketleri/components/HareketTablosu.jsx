import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import KayanTablo from "./KayanTablo";
import { Artis, DegerBirim, IkiSatir, KaynakRozeti } from "./Hucreler";

/**
 * 1. sekme: sayac okuma hareketleri. Yalnizca tarihe gore siralanir (API'de yalnizca `sortOrder` var);
 * satira tiklaninca Hareket Detayi acilir.
 */
export default function HareketTablosu({ satirlar, yukleniyor, govdeKayar, siralama, onSirala, onDetay }) {
  const { t, i18n } = useTranslation();

  const kolonlar = useMemo(() => {
    // CSS uppercase Turkce i/I harflerini bozdugu icin basliklar dile gore buyutulur.
    const baslik = (anahtar) => t(anahtar).toLocaleUpperCase(i18n.language);
    return [
      {
        key: "tarih",
        title: baslik("sayacHareketleri.kolon.tarihSaat"),
        width: 130,
        sorter: true,
        sortOrder: siralama === "ASC" ? "ascend" : "descend",
        sortDirections: ["descend", "ascend", "descend"],
        render: (_, satir) => <IkiSatir ust={satir.readingDateFormatted} alt={satir.readingTime} />,
      },
      { key: "ekipman", title: baslik("sayacHareketleri.kolon.ekipman"), width: 260, render: (_, satir) => <IkiSatir ust={satir.equipmentCode} alt={satir.equipmentName} /> },
      { key: "sayac", title: baslik("sayacHareketleri.kolon.sayac"), dataIndex: "counterName", width: 170, ellipsis: true },
      {
        key: "deger",
        title: baslik("sayacHareketleri.kolon.okunanDeger"),
        width: 150,
        align: "right",
        render: (_, satir) => <DegerBirim deger={satir.readingValue} birim={satir.unit} />,
      },
      { key: "degisim", title: baslik("sayacHareketleri.kolon.degisim"), width: 110, align: "right", render: (_, satir) => <Artis deger={satir.incrementValue} /> },
      { key: "kaynak", title: baslik("sayacHareketleri.kolon.kayitKaynagi"), width: 150, render: (_, satir) => <KaynakRozeti kaynak={satir.sourceType} /> },
      { key: "detay", width: 44, align: "center", render: () => <LuChevronRight size={16} className="sh-soluk" /> },
    ];
  }, [i18n.language, siralama, t]);

  return (
    <KayanTablo
      kolonlar={kolonlar}
      satirlar={satirlar}
      yukleniyor={yukleniyor}
      govdeKayar={govdeKayar}
      onRow={(satir) => ({ className: "sh-tiklanir", onClick: () => onDetay(satir.readingId) })}
      onChange={(_sayfalama, _filtreler, siralayici) => onSirala(siralayici?.order === "ascend" ? "ASC" : "DESC")}
    />
  );
}

HareketTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
  siralama: PropTypes.oneOf(["ASC", "DESC"]).isRequired,
  onSirala: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
};
