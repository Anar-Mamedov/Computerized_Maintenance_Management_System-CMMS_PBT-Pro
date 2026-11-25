import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Empty, Table } from "antd";
import { useTranslation } from "react-i18next";
import LocalizedDateText from "../../../../utils/components/LocalizedDateText";
import useAutoTableScroll, { TABLE_FILL_INNER } from "../../../Dashboard1/components/useAutoTableScroll";
import { ondalikli } from "../../ortak/yakitBicim";

/** Liste satirindaki GC -> islem tipi (rozet rengi ve metni). */
const GC_ISLEM_TIPI = { G: "GIRIS", C: "CIKIS", T: "TRANSFER" };

const metin = (deger) => (deger === null || deger === undefined || deger === "" ? "–" : deger);

// Ilk olcume kadar kullanilan tahmini tablo alani yuksekligi; sonra alan kartta kalan boslugu doldurur.
const DOGAL_TABLO_YUKSEKLIGI = 480;
const SECIM_KOLONU_GENISLIGI = 44;

/**
 * Yakit stok fisleri. Siralama sunucuda yapilir (SortBy / SortDir); satira tiklaninca fis duzenleme modali acilir.
 * Genis ekranda yalnizca govde kayar (RULES.md kural 14, Ekipman Listesi deseni).
 */
export default function IslemTablosu({ satirlar, yukleniyor, seciliAnahtarlar, onSecimDegistir, siralama, onSirala, onDetay, govdeKayar }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
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

  // Ekran kisaldikca tablo, baslik + ilk iki satir gorunene kadar kuculur; daha kisa ekranda sayfa kayar.
  useLayoutEffect(() => {
    const kutu = tabloKutusu.current;
    if (!kutu) return undefined;
    const olc = () => {
      const baslik = kutu.querySelector(".ant-table-thead")?.offsetHeight ?? 0;
      const govde = kutu.querySelector(".ant-table-body");
      const yatayCubuk = govde ? govde.offsetHeight - govde.clientHeight : 0;
      const ilkIkiSatir = [...kutu.querySelectorAll(".ant-table-tbody > tr:not(.ant-table-measure-row)")].slice(0, 2);
      setAsgariYukseklik(ilkIkiSatir.reduce((toplam, satir) => toplam + satir.offsetHeight, baslik + yatayCubuk));
    };
    olc();
    const gozlemci = new ResizeObserver(olc);
    gozlemci.observe(kutu);
    return () => gozlemci.disconnect();
  }, [satirlar, govdeKayar]);

  const kolonlar = useMemo(() => {
    const siraDurumu = (anahtar) => (siralama.SortBy === anahtar ? (siralama.SortDir === "asc" ? "ascend" : "descend") : null);
    const kolon = (anahtar, baslikKey, genislik, render, sag = false) => ({
      key: anahtar,
      title: t(baslikKey),
      width: genislik,
      ellipsis: true,
      align: sag ? "right" : undefined,
      sorter: true,
      sortOrder: siraDurumu(anahtar),
      showSorterTooltip: false,
      render: (_, satir) => render(satir),
    });

    return [
      kolon("tarih", "yakitStokIslemleri.kolon.tarihSaat", 120, (satir) => (
        <div className="leading-tight">
          <div className="font-semibold">
            <LocalizedDateText value={satir.Tarih} />
          </div>
          <div className="text-[11px] text-(--ys-muted)">{metin(satir.Saat)}</div>
        </div>
      )),
      kolon("islemTuru", "yakitStokIslemleri.kolon.islemTuru", 110, (satir) => {
        const tip = GC_ISLEM_TIPI[satir.GC];
        return tip ? <span className={`ys-rozet ys-rozet--${tip.toLowerCase()}`}>{t(`yakitOrtak.islemTuru.${tip}`)}</span> : metin(satir.IslemTuru);
      }),
      kolon("yakitTipi", "yakitStokIslemleri.kolon.yakitTipi", 110, (satir) => metin(satir.YakitTipi)),
      kolon("yakitTanimi", "yakitStokIslemleri.kolon.yakitTanimi", 140, (satir) => metin(satir.YakitTanimi)),
      kolon("miktar", "yakitStokIslemleri.kolon.miktar", 120, (satir) => `${ondalikli(satir.Miktar, dil)} ${t("yakitOrtak.lt")}`, true),
      kolon("birimFiyat", "yakitStokIslemleri.kolon.birimFiyat", 110, (satir) => `${ondalikli(satir.BirimFiyat, dil)} ${t("yakitOrtak.tl")}`, true),
      kolon("tutar", "yakitStokIslemleri.kolon.tutar", 130, (satir) => `${ondalikli(satir.Tutar, dil)} ${t("yakitOrtak.tl")}`, true),
      kolon("lokasyon", "yakitStokIslemleri.kolon.lokasyon", 120, (satir) => metin(satir.Lokasyon)),
      kolon("kaynakDepo", "yakitStokIslemleri.kolon.kaynakDepo", 150, (satir) => metin(satir.KaynakDepo)),
      kolon("hedefDepo", "yakitStokIslemleri.kolon.hedefDepo", 150, (satir) => metin(satir.HedefDepo)),
      kolon("aciklama", "yakitStokIslemleri.kolon.aciklama", 180, (satir) => metin(satir.Aciklama)),
    ];
  }, [dil, siralama, t]);

  const tabloGenisligi = kolonlar.reduce((toplam, item) => toplam + item.width, SECIM_KOLONU_GENISLIGI);

  // Siralama kaldirilinca dokumandaki varsayilana (tarih, yeniden eskiye) donulur.
  const tabloDegisti = (_sayfalama, _filtreler, siralayici) => {
    const tekSiralayici = Array.isArray(siralayici) ? siralayici[0] : siralayici;
    if (!tekSiralayici?.order) {
      onSirala({ SortBy: "tarih", SortDir: "desc" });
      return;
    }
    onSirala({ SortBy: tekSiralayici.columnKey, SortDir: tekSiralayici.order === "ascend" ? "asc" : "desc" });
  };

  const tablo = (
    <Table
      className="ys-tablo"
      rowKey="clientKey"
      columns={kolonlar}
      dataSource={satirlar}
      loading={yukleniyor}
      pagination={false}
      tableLayout="fixed"
      size="middle"
      scroll={govdeKayar ? { x: tabloGenisligi, y: scrollY } : { x: tabloGenisligi }}
      sticky={!govdeKayar}
      onChange={tabloDegisti}
      rowSelection={{ columnWidth: SECIM_KOLONU_GENISLIGI, fixed: true, selectedRowKeys: seciliAnahtarlar, onChange: onSecimDegistir }}
      onRow={(satir) => ({
        onClick: (event) => {
          // Secim kutusuna tiklamak satiri acmaz.
          if (event.target.closest(".ant-table-selection-column")) return;
          onDetay(satir);
        },
        style: { cursor: "pointer" },
      })}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitStokIslemleri.kayitBulunamadi")} /> }}
    />
  );

  return govdeKayar ? (
    <div style={{ ...wrapperStyle, flexBasis: 0, minHeight: asgariYukseklik }}>
      <div ref={tabloKutusuRef} style={TABLE_FILL_INNER}>
        {tablo}
      </div>
    </div>
  ) : (
    <div>{tablo}</div>
  );
}

IslemTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  seciliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  siralama: PropTypes.shape({ SortBy: PropTypes.string, SortDir: PropTypes.string }).isRequired,
  onSirala: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
};
