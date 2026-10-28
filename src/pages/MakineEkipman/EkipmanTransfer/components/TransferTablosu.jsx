import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Empty, Table } from "antd";
import { useTranslation } from "react-i18next";
import { LuMoreHorizontal } from "react-icons/lu";
import { TransferDurumRozeti } from "./Rozetler";
import IslemMenusu from "./IslemMenusu";
import useAutoTableScroll, { TABLE_FILL_INNER } from "../../../Dashboard1/components/useAutoTableScroll";
import { formatNumberWithSeparators } from "../../../../utils/numberLocale";

// Ilk olcume kadar kullanilan tahmini tablo alani yuksekligi; sonra alan kartta kalan boslugu doldurur.
const DOGAL_TABLO_YUKSEKLIGI = 480;
const SIRALAMA_YONU = { ASC: "ascend", DESC: "descend" };

/**
 * Transfer fisleri tablosu. Satira sag tiklaninca ya da "..." dugmesine basilinca islem menusu acilir.
 * `govdeKayar` iken tablo kartta kalan yuksekligi doldurur ve yalnizca govdesi kayar (RULES.md kural 14);
 * degilse sayfa kayar ve baslik sticky olur.
 */
export default function TransferTablosu({ satirlar, yukleniyor, siralama, onSirala, onIslem, govdeKayar }) {
  const { t, i18n } = useTranslation();
  // Sag tiklanan satir; menu yalnizca bir satir uzerinde acilir.
  const [menuSatiri, setMenuSatiri] = useState(null);
  const { containerRef, scrollY, wrapperStyle } = useAutoTableScroll(DOGAL_TABLO_YUKSEKLIGI, 0);
  const tabloKutusu = useRef(null);
  const [asgariYukseklik, setAsgariYukseklik] = useState(0);

  // Ref sag tik Dropdown'inin dogrudan cocuguna verilmez (rc-util useComposeRef sonradan gelen ref'i baglamayabilir).
  const tabloKutusuRef = useCallback(
    (node) => {
      tabloKutusu.current = node;
      containerRef(node);
    },
    [containerRef]
  );

  // Ekran kisaldikca tablo, baslik + ilk iki satir gorunene kadar kuculur; daha kisa ekranda sayfa kayar.
  useLayoutEffect(() => {
    const kutu = tabloKutusu.current;
    if (!kutu) return undefined;

    const olc = () => {
      const baslik = kutu.querySelector(".ant-table-thead")?.offsetHeight ?? 0;
      const govde = kutu.querySelector(".ant-table-body");
      const yatayCubuk = govde ? govde.offsetHeight - govde.clientHeight : 0;
      // Veri yoksa "kayit bulunamadi" satiri olculur.
      const ilkIkiSatir = [...kutu.querySelectorAll(".ant-table-tbody > tr:not(.ant-table-measure-row)")].slice(0, 2);
      setAsgariYukseklik(ilkIkiSatir.reduce((toplam, satir) => toplam + satir.offsetHeight, baslik + yatayCubuk));
    };

    olc();
    const gozlemci = new ResizeObserver(olc);
    gozlemci.observe(kutu);
    return () => gozlemci.disconnect();
  }, [satirlar, govdeKayar]);

  const kolonlar = useMemo(() => {
    // CSS uppercase Turkce i/I harflerini bozdugu icin basliklar dile gore buyutulur.
    const baslik = (anahtar) => t(anahtar).toLocaleUpperCase(i18n.language);
    const siralanabilir = (sortField) => ({
      sorter: true,
      sortField,
      sortOrder: siralama.field === sortField ? SIRALAMA_YONU[siralama.order] : null,
    });

    return [
      {
        key: "transferNo",
        title: baslik("ekipmanTransfer.transferNo"),
        width: 140,
        ...siralanabilir("transferId"),
        render: (_, satir) => (
          <button type="button" className="et-link" onClick={() => onIslem("fis", satir)}>
            {satir.transferNo}
          </button>
        ),
      },
      { key: "plannedDate", title: baslik("ekipmanTransfer.planlananTarih"), dataIndex: "plannedDateFormatted", width: 130, ...siralanabilir("plannedDate") },
      { key: "source", title: baslik("ekipmanTransfer.kaynakSantiye"), dataIndex: "sourceLocationName", width: 160, ellipsis: true },
      { key: "target", title: baslik("ekipmanTransfer.hedefSantiye"), dataIndex: "targetLocationName", width: 160, ellipsis: true },
      {
        key: "equipmentCount",
        title: baslik("ekipmanTransfer.ekipman"),
        width: 100,
        align: "center",
        ...siralanabilir("equipmentCount"),
        render: (_, satir) => formatNumberWithSeparators(satir.equipmentCount, i18n.language),
      },
      { key: "requestedBy", title: baslik("ekipmanTransfer.talepEden"), dataIndex: "requestedByName", width: 150, ellipsis: true },
      {
        key: "status",
        title: baslik("ekipmanTransfer.durumBasligi"),
        width: 130,
        render: (_, satir) => <TransferDurumRozeti statusKey={satir.statusKey} statusText={satir.statusText} />,
      },
      {
        key: "islem",
        title: baslik("ekipmanTransfer.islem"),
        width: 64,
        align: "center",
        fixed: "right",
        render: (_, satir) => (
          <IslemMenusu satir={satir} tetikleyici="click" onIslem={onIslem}>
            <button type="button" className="et-ikon-btn" aria-label={t("ekipmanTransfer.islemler")}>
              <LuMoreHorizontal size={16} />
            </button>
          </IslemMenusu>
        ),
      },
    ];
  }, [i18n.language, onIslem, siralama, t]);

  const tabloGenisligi = kolonlar.reduce((toplam, kolon) => toplam + kolon.width, 0);

  const siralamaDegisti = (_sayfalama, _filtreler, siralayici) => {
    const tekSiralayici = Array.isArray(siralayici) ? siralayici[0] : siralayici;
    if (!tekSiralayici?.order) {
      onSirala(null);
      return;
    }
    onSirala({ field: tekSiralayici.column.sortField, order: tekSiralayici.order === "ascend" ? "ASC" : "DESC" });
  };

  const tablo = (
    <Table
      className="et-tablo"
      rowKey="clientKey"
      columns={kolonlar}
      dataSource={satirlar}
      loading={yukleniyor}
      pagination={false}
      tableLayout="fixed"
      showSorterTooltip={false}
      scroll={govdeKayar ? { x: tabloGenisligi, y: scrollY } : { x: tabloGenisligi }}
      sticky={!govdeKayar}
      onChange={siralamaDegisti}
      onRow={(satir) => ({ onContextMenu: () => setMenuSatiri(satir) })}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("ekipmanTransfer.kayitBulunamadi")} /> }}
    />
  );

  return (
    <IslemMenusu
      satir={menuSatiri}
      tetikleyici="contextMenu"
      acik={menuSatiri !== null}
      onAcikDegistir={(acik) => {
        if (!acik) setMenuSatiri(null);
      }}
      onIslem={onIslem}
    >
      {govdeKayar ? (
        <div style={{ ...wrapperStyle, flexBasis: 0, minHeight: asgariYukseklik }}>
          <div ref={tabloKutusuRef} style={TABLE_FILL_INNER}>
            {tablo}
          </div>
        </div>
      ) : (
        <div>{tablo}</div>
      )}
    </IslemMenusu>
  );
}

TransferTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  siralama: PropTypes.shape({ field: PropTypes.string, order: PropTypes.string }).isRequired,
  onSirala: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
};
