import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Empty, Table } from "antd";
import { useTranslation } from "react-i18next";
import { EkipmanDurumRozeti, TeslimDurumu } from "./Rozetler";

const DIKEY_KAYDIRMA_ESIGI = 7;
const ASGARI_TABLO_GENISLIGI = 600;

/**
 * Fis, ozet, ekipman secimi ve teslim alma pencerelerindeki ekipman tablosu.
 * `teslimKolonu` acikken satirin teslim durumu da gosterilir; secim varsa `rowSelection` aynen iletilir.
 */
export default function EkipmanTablosu({ satirlar, yukleniyor = false, teslimKolonu = false, rowSelection, scrollY }) {
  const { t, i18n } = useTranslation();

  const kolonlar = useMemo(() => {
    const baslik = (anahtar) => t(anahtar).toLocaleUpperCase(i18n.language);
    return [
      {
        key: "code",
        title: baslik("ekipmanTransfer.ekipmanKodu"),
        width: 140,
        ellipsis: true,
        render: (_, satir) => (
          <span className="et-kalin" title={satir.equipmentName}>
            {satir.equipmentCode}
          </span>
        ),
      },
      { key: "type", title: baslik("ekipmanTransfer.ekipmanTipi"), dataIndex: "equipmentType", width: 160, ellipsis: true },
      { key: "status", title: baslik("ekipmanTransfer.durumBasligi"), width: 130, render: (_, satir) => <EkipmanDurumRozeti statusKey={satir.statusKey} statusText={satir.statusText} /> },
      // Genislik verilmez: pencerede kalan alani bu kolon alir, sabit genislikler toplami kutuyu tasirmaz.
      { key: "location", title: baslik("ekipmanTransfer.mevcutSantiye"), dataIndex: "currentLocationName", ellipsis: true },
      ...(teslimKolonu
        ? [
            {
              key: "delivery",
              title: baslik("ekipmanTransfer.teslimDurumuBasligi"),
              width: 140,
              render: (_, satir) => <TeslimDurumu deliveryStatusKey={satir.deliveryStatusKey} deliveryStatusText={satir.deliveryStatusText} />,
            },
          ]
        : []),
    ];
  }, [i18n.language, t, teslimKolonu]);

  return (
    <Table
      className="et-tablo et-tablo--cerceveli"
      size="small"
      rowKey="clientKey"
      columns={kolonlar}
      dataSource={satirlar}
      loading={yukleniyor}
      pagination={false}
      rowSelection={rowSelection}
      // Tablo pencereyi doldurur, yalnizca dar ekranda yatay kayar. Az satirda dikey kaydirma acilmaz;
      // aksi halde bos kaydirma cubugu yeri gorunur.
      scroll={scrollY && satirlar.length > DIKEY_KAYDIRMA_ESIGI ? { x: ASGARI_TABLO_GENISLIGI, y: scrollY } : { x: ASGARI_TABLO_GENISLIGI }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("ekipmanTransfer.ekipmanBulunamadi")} /> }}
    />
  );
}

EkipmanTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool,
  teslimKolonu: PropTypes.bool,
  rowSelection: PropTypes.object,
  scrollY: PropTypes.number,
};
