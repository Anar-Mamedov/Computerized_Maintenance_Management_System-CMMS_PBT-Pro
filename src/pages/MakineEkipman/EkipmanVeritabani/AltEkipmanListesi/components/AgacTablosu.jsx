import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuCog, LuMoreVertical, LuPackage } from "react-icons/lu";
import KayanTablo from "./KayanTablo";
import IslemMenusu from "./IslemMenusu";
import { BaglantiRozeti, DurumRozeti } from "./Rozetler";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

const ASGARI_GENISLIK = 1000;
const GRUP_GIZLI_SECIM = { disabled: true, style: { display: "none" } };

/**
 * Agac gorunumu: her makine bir grup satiridir, altinda alt ekipmanlar sinirsiz derinlikte acilir; en altta
 * "STOK / BAGIMSIZ" grubu durur. Gruplar ilk yuklemede acik gelir; grup satirlari secilemez ve islem menusu yoktur.
 */
export default function AgacTablosu({ satirlar, yukleniyor, govdeKayar, seciliAnahtarlar, onSecimDegistir, onDetay, onIslem }) {
  const { t, i18n } = useTranslation();
  const [acikAnahtarlar, setAcikAnahtarlar] = useState([]);

  useEffect(() => {
    setAcikAnahtarlar(satirlar.map((grup) => grup.clientKey));
  }, [satirlar]);

  const kolonlar = useMemo(() => {
    const baslik = (anahtar) => t(anahtar).toLocaleUpperCase(i18n.language);
    const sayi = (deger) => formatNumberWithSeparators(deger ?? 0, i18n.language);
    // Grup satirinda yalnizca ilk kolon dolu; digerleri bos kalir.
    const ekipmanHucresi = (render) => (_, satir) => (satir.grup ? null : render(satir));
    const metin = (deger) => (
      <span className="ae-tasan" title={deger || undefined}>
        {deger || "–"}
      </span>
    );

    return [
      {
        key: "ekipman",
        title: baslik("altEkipmanVeritabani.kolon.ekipmanNoTanim"),
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
      { key: "serial", title: baslik("altEkipmanVeritabani.kolon.seriNo"), width: 110, render: ekipmanHucresi((satir) => metin(satir.serialNo)) },
      { key: "type", title: baslik("altEkipmanVeritabani.kolon.ekipmanTipi"), width: 120, render: ekipmanHucresi((satir) => metin(satir.equipmentType)) },
      { key: "location", title: baslik("altEkipmanVeritabani.kolon.konumDepo"), width: 130, render: ekipmanHucresi((satir) => metin(satir.locationOrWarehouse)) },
      {
        key: "connection",
        title: baslik("altEkipmanVeritabani.kolon.baglantiDurumu"),
        width: 130,
        render: ekipmanHucresi((satir) => <BaglantiRozeti kod={satir.connectionStatusCode} metin={satir.connectionStatus} />),
      },
      { key: "status", title: baslik("altEkipmanVeritabani.kolon.ekipmanDurumu"), width: 105, render: ekipmanHucresi((satir) => <DurumRozeti metin={satir.equipmentStatus} />) },
      { key: "brand", title: baslik("marka"), width: 95, render: ekipmanHucresi((satir) => metin(satir.brand)) },
      {
        key: "islem",
        title: baslik("altEkipmanVeritabani.kolon.islem"),
        width: 56,
        align: "center",
        fixed: "right",
        render: ekipmanHucresi((satir) => (
          <IslemMenusu kayit={satir} onIslem={onIslem}>
            <button type="button" className="ae-ikon-btn" aria-label={t("altEkipmanVeritabani.kolon.islem")}>
              <LuMoreVertical size={16} />
            </button>
          </IslemMenusu>
        )),
      },
    ];
  }, [i18n.language, onDetay, onIslem, t]);

  return (
    <KayanTablo
      kolonlar={kolonlar}
      satirlar={satirlar}
      yukleniyor={yukleniyor}
      govdeKayar={govdeKayar}
      asgariGenislik={ASGARI_GENISLIK}
      rowClassName={(satir) => (satir.grup ? "ae-grup-satiri" : "")}
      expandable={{ expandedRowKeys: acikAnahtarlar, onExpandedRowsChange: setAcikAnahtarlar, indentSize: 22 }}
      rowSelection={{
        columnWidth: 40,
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
  seciliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
};
