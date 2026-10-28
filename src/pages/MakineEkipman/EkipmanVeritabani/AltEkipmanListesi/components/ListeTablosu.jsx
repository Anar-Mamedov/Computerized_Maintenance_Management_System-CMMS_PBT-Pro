import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuMoreVertical } from "react-icons/lu";
import KayanTablo from "./KayanTablo";
import IslemMenusu from "./IslemMenusu";
import { BaglantiRozeti, DurumRozeti } from "./Rozetler";

// Tanim ve Bagli Oldugu Ekipman kolonlarina genislik verilmez; kartta kalan alani onlar paylasir.
const ASGARI_GENISLIK = 1040;

/** Duz liste: her alt ekipman ve tam kirilim yolu (`parentPath`). Siralama yalnizca Ekipman No'ya gore (dokuman). */
export default function ListeTablosu({ satirlar, yukleniyor, govdeKayar, seciliAnahtarlar, onSecimDegistir, siralama, onSirala, onDetay, onIslem }) {
  const { t, i18n } = useTranslation();

  const kolonlar = useMemo(() => {
    // CSS uppercase Turkce i/I harflerini bozdugu icin basliklar dile gore buyutulur.
    const baslik = (anahtar) => t(anahtar).toLocaleUpperCase(i18n.language);
    const metin = (deger) => (
      <span className="ae-tasan" title={deger || undefined}>
        {deger || "–"}
      </span>
    );
    return [
      {
        key: "code",
        title: baslik("altEkipmanVeritabani.kolon.ekipmanNo"),
        width: 110,
        sorter: true,
        sortOrder: siralama === "DESC" ? "descend" : "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        render: (_, satir) => (
          <button type="button" className="ae-link" onClick={() => onDetay(satir)}>
            {satir.code}
          </button>
        ),
      },
      { key: "name", title: baslik("altEkipmanVeritabani.kolon.tanim"), render: (_, satir) => <span className="ae-kalin">{metin(satir.name)}</span> },
      { key: "type", title: baslik("altEkipmanVeritabani.kolon.ekipmanTipi"), width: 100, render: (_, satir) => metin(satir.equipmentType) },
      { key: "serial", title: baslik("altEkipmanVeritabani.kolon.seriNo"), width: 90, render: (_, satir) => metin(satir.serialNo) },
      { key: "parent", title: baslik("altEkipmanVeritabani.kolon.bagliOlduguEkipman"), render: (_, satir) => metin(satir.parentPath) },
      { key: "location", title: baslik("altEkipmanVeritabani.kolon.konumDepo"), width: 110, render: (_, satir) => metin(satir.locationOrWarehouse) },
      {
        key: "connection",
        title: baslik("altEkipmanVeritabani.kolon.baglantiDurumu"),
        width: 120,
        render: (_, satir) => <BaglantiRozeti kod={satir.connectionStatusCode} metin={satir.connectionStatus} />,
      },
      { key: "status", title: baslik("altEkipmanVeritabani.kolon.ekipmanDurumu"), width: 105, render: (_, satir) => <DurumRozeti metin={satir.equipmentStatus} /> },
      { key: "brand", title: baslik("marka"), width: 85, render: (_, satir) => metin(satir.brand) },
      {
        key: "islem",
        title: baslik("altEkipmanVeritabani.kolon.islem"),
        width: 48,
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
  }, [i18n.language, onDetay, onIslem, siralama, t]);

  return (
    <KayanTablo
      kolonlar={kolonlar}
      satirlar={satirlar}
      yukleniyor={yukleniyor}
      govdeKayar={govdeKayar}
      asgariGenislik={ASGARI_GENISLIK}
      rowSelection={{ columnWidth: 40, fixed: true, selectedRowKeys: seciliAnahtarlar, onChange: onSecimDegistir }}
      onChange={(_sayfalama, _filtreler, siralayici) => onSirala(siralayici?.order === "descend" ? "DESC" : "ASC")}
    />
  );
}

ListeTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
  seciliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  siralama: PropTypes.oneOf(["ASC", "DESC"]).isRequired,
  onSirala: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
};
