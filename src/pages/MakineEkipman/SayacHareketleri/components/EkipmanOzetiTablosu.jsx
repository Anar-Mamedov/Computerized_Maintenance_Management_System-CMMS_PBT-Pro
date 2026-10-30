import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import KayanTablo from "./KayanTablo";
import { Artis, DegerBirim, IkiSatir } from "./Hucreler";
import { sayiMetni } from "../yardimcilar";

/** 2. sekme: ekipman / sayac basina son okuma, secili donemdeki degisim ve kayit sayisi. */
export default function EkipmanOzetiTablosu({ satirlar, yukleniyor, govdeKayar }) {
  const { t, i18n } = useTranslation();

  const kolonlar = useMemo(() => {
    const baslik = (anahtar) => t(anahtar).toLocaleUpperCase(i18n.language);
    return [
      { key: "ekipman", title: baslik("sayacHareketleri.kolon.ekipman"), width: 220, render: (_, satir) => <IkiSatir ust={satir.equipmentCode} alt={satir.equipmentName} /> },
      { key: "tip", title: baslik("sayacHareketleri.kolon.ekipmanTipi"), dataIndex: "equipmentType", width: 120, ellipsis: true },
      { key: "marka", title: baslik("marka"), dataIndex: "brand", width: 100, ellipsis: true },
      { key: "lokasyon", title: baslik("lokasyon"), dataIndex: "locationName", width: 140, ellipsis: true },
      { key: "sayacTipi", title: baslik("sayacHareketleri.kolon.sayacTipi"), dataIndex: "counterType", width: 120, ellipsis: true },
      {
        key: "sonOkuma",
        title: baslik("sayacHareketleri.kolon.sonOkumaDonem"),
        width: 150,
        align: "right",
        render: (_, satir) => <IkiSatir ust={<DegerBirim deger={satir.lastReadingValue} birim={satir.unit} />} alt={satir.lastReadingDateFormatted} />,
      },
      { key: "degisim", title: baslik("sayacHareketleri.kolon.donemDegisimi"), width: 120, align: "right", render: (_, satir) => <Artis deger={satir.periodIncrement} /> },
      { key: "kayit", title: baslik("sayacHareketleri.kolon.kayitSayisi"), width: 100, align: "right", render: (_, satir) => sayiMetni(satir.readingCount, i18n.language) },
    ];
  }, [i18n.language, t]);

  return <KayanTablo kolonlar={kolonlar} satirlar={satirlar} yukleniyor={yukleniyor} govdeKayar={govdeKayar} />;
}

EkipmanOzetiTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
};
