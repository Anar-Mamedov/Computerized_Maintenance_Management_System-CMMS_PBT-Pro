import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Empty, Table } from "antd";
import { useTranslation } from "react-i18next";
import useAutoTableScroll, { TABLE_FILL_INNER } from "../../../../Dashboard1/components/useAutoTableScroll";

// Ilk olcume kadar kullanilan tahmini tablo alani yuksekligi; sonra alan kartta kalan boslugu doldurur.
const DOGAL_TABLO_YUKSEKLIGI = 480;

/**
 * Liste ve agac tablolarinin ortak kabugu. `govdeKayar` iken tablo kartta kalan yuksekligi doldurur, yalnizca
 * govdesi kayar ve baslik + ilk iki satira kadar kuculur (RULES.md kural 14); degilse sayfa kayar, baslik sticky olur.
 * Diger Table ozellikleri (`rowSelection`, `expandable`, `onChange`...) oldugu gibi iletilir.
 */
export default function KayanTablo({ kolonlar, satirlar, yukleniyor, govdeKayar, asgariGenislik, ...tabloOzellikleri }) {
  const { t } = useTranslation();
  const { containerRef, scrollY, wrapperStyle } = useAutoTableScroll(DOGAL_TABLO_YUKSEKLIGI, 0);
  const tabloKutusu = useRef(null);
  const [asgariYukseklik, setAsgariYukseklik] = useState(0);

  const tabloKutusuRef = useCallback(
    (node) => {
      tabloKutusu.current = node;
      containerRef(node);
    },
    [containerRef]
  );

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
  }, [satirlar, kolonlar, govdeKayar]);

  const tablo = (
    <Table
      className="ae-tablo"
      rowKey="clientKey"
      columns={kolonlar}
      dataSource={satirlar}
      loading={yukleniyor}
      pagination={false}
      tableLayout="fixed"
      showSorterTooltip={false}
      scroll={govdeKayar ? { x: asgariGenislik, y: scrollY } : { x: asgariGenislik }}
      sticky={!govdeKayar}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("altEkipmanVeritabani.kayitBulunamadi")} /> }}
      {...tabloOzellikleri}
    />
  );

  if (!govdeKayar) return <div>{tablo}</div>;

  return (
    <div style={{ ...wrapperStyle, flexBasis: 0, minHeight: asgariYukseklik }}>
      <div ref={tabloKutusuRef} style={TABLE_FILL_INNER}>
        {tablo}
      </div>
    </div>
  );
}

KayanTablo.propTypes = {
  kolonlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
  /** Tablonun asgari genisligi; genis ekranda tablo karti doldurur, daha darda yatay kayar. */
  asgariGenislik: PropTypes.number.isRequired,
};
