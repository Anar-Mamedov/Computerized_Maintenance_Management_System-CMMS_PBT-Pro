import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Empty, Table } from "antd";
import { useTranslation } from "react-i18next";
import { LuArrowDown, LuArrowUp, LuCheck, LuChevronsUpDown, LuX } from "react-icons/lu";
import BoyutlanabilirBaslik from "./BoyutlanabilirBaslik";
import { BakimRozeti, DurumRozeti, LokasyonBilgisi } from "./Rozetler";
import SatirIslemMenusu from "./islemler/SatirIslemMenusu";
import useAutoTableScroll, { TABLE_FILL_INNER } from "../../../../Dashboard1/components/useAutoTableScroll";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

/** Kolon basligi; tiklaninca o alana gore siralar. */
function SiralamaBasligi({ etiket, alan, siralama, onSirala }) {
  const { t } = useTranslation();
  const aktif = siralama.field === alan;
  const Ikon = !aktif ? LuChevronsUpDown : siralama.order === "ASC" ? LuArrowUp : LuArrowDown;

  return (
    <button type="button" className="ek-sirala" title={etiket} aria-label={t("ekipmanListesi.siralaAria", { ad: etiket })} onClick={() => onSirala(alan)}>
      <span className="ek-baslik-metin">{etiket}</span>
      <Ikon size={14} className={`ek-sirala-ikon ${aktif ? "ek-sirala-ikon--aktif" : ""}`} />
    </button>
  );
}

SiralamaBasligi.propTypes = {
  etiket: PropTypes.string.isRequired,
  alan: PropTypes.string.isRequired,
  siralama: PropTypes.shape({ field: PropTypes.string, order: PropTypes.string }).isRequired,
  onSirala: PropTypes.func.isRequired,
};

/** Evet/Hayir alanlari (belge, resim, aktif); eski tablodaki gibi yesil onay / kirmizi carpi. */
function EvetHayir({ deger }) {
  const { t } = useTranslation();
  const Ikon = deger ? LuCheck : LuX;

  return (
    <span className="flex justify-center" role="img" aria-label={deger ? t("evet") : t("hayir")}>
      <Ikon size={16} className={deger ? "text-(--ek-success)" : "text-(--ek-danger)"} />
    </span>
  );
}

EvetHayir.propTypes = { deger: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]) };

const bosMu = (deger) => deger === null || deger === undefined || deger === "";

const metinHucresi = (deger) => (
  <span className="text-(--ek-muted)" title={bosMu(deger) ? undefined : String(deger)}>
    {bosMu(deger) ? "–" : deger}
  </span>
);

/** Kolon turune gore hucre gorunumu; turu olmayan kolonlar `alan` degerini duz metin yazar. */
const hucreIcerigi = (kolon, satir, onDetay, dil) => {
  switch (kolon.tur) {
    case "ekipman":
      return (
        <button type="button" className="ek-ekipman-btn" onClick={() => onDetay(satir)}>
          <span className="ek-ekipman-kod block truncate text-[13px] font-medium">{satir.MKN_KOD}</span>
          <span className="block truncate text-[12px] text-(--ek-muted)">{satir.MKN_TANIM}</span>
        </button>
      );
    case "lokasyon":
      return <LokasyonBilgisi satir={satir} />;
    case "durum":
      return <DurumRozeti satir={satir} />;
    case "bakim":
      return <BakimRozeti satir={satir} />;
    case "evetHayir":
      return <EvetHayir deger={satir[kolon.alan]} />;
    case "sayi":
      return metinHucresi(formatNumberWithSeparators(satir[kolon.alan], dil));
    default:
      return metinHucresi(satir[kolon.alan]);
  }
};

const TABLO_BILESENLERI = { header: { cell: BoyutlanabilirBaslik } };
const SECIM_KOLONU_GENISLIGI = 40;
// Ilk olcume kadar kullanilan tahmini tablo alani yuksekligi; sonra alan kartta kalan boslugu doldurur.
const DOGAL_TABLO_YUKSEKLIGI = 480;

/**
 * Liste gorunumu. Kolonlar kolon ayarlarindaki sira ve genislikle cizilir; basliklarin sag kenari
 * surulerek genislik degistirilir (eski tablodaki gibi). Satira sag tiklaninca islem menusu acilir.
 * `govdeKayar` iken tablo kartta kalan yuksekligi doldurur ve yalnizca govdesi kayar (baslik sabit);
 * degilse sayfa kayar ve baslik sticky olur.
 */
export default function EkipmanTablosu({ satirlar, yukleniyor, seciliAnahtarlar, onSecimDegistir, siralama, onSirala, gorunurKolonlar, onGenislikDegistir, onDetay, onIslem, govdeKayar }) {
  const { t, i18n } = useTranslation();
  // Sag tiklanan satir; menu yalnizca bir satir uzerinde acilir.
  const [menuSatiri, setMenuSatiri] = useState(null);
  // Hook govdeyi kutuya tam sigdirir (asgari 0); alt sinir asagidaki asgari yukseklikten gelir.
  const { containerRef, scrollY, wrapperStyle } = useAutoTableScroll(DOGAL_TABLO_YUKSEKLIGI, 0);
  const tabloKutusu = useRef(null);
  const [asgariYukseklik, setAsgariYukseklik] = useState(0);

  // Hook'un olctugu kutu, asgari yuksekligi olcmek icin burada da tutulur. Ref Dropdown'in dogrudan cocuguna verilmez:
  // Dropdown ref'leri birlestirirken (rc-util useComposeRef) sonradan eklenen ya da degisen ref'i baglamayabilir.
  const tabloKutusuRef = useCallback(
    (node) => {
      tabloKutusu.current = node;
      containerRef(node);
    },
    [containerRef]
  );

  // Ekran kisaldikca tablo, baslik + ilk iki satir (varsa yatay kaydirma cubuguyla) gorunene kadar kuculur;
  // daha kisa ekranda sayfa kayar. Satirlar, kolonlar ya da kutunun boyutu degisince yeniden olculur.
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
  }, [satirlar, gorunurKolonlar, govdeKayar]);

  // Esnek taban 0: kartin asgari yuksekligi dogal yukseklikten degil, bu asgari yukseklik + sayfalamadan olusur.
  const alanStili = { ...wrapperStyle, flexBasis: 0, minHeight: asgariYukseklik };

  const kolonlar = useMemo(
    () =>
      gorunurKolonlar.map((kolon, index) => ({
        key: kolon.key,
        title: kolon.sortField ? (
          <SiralamaBasligi etiket={kolon.baslik} alan={kolon.sortField} siralama={siralama} onSirala={onSirala} />
        ) : (
          <span className="ek-baslik-metin" title={kolon.baslik}>
            {kolon.baslik}
          </span>
        ),
        width: kolon.genislik,
        ellipsis: true,
        // Yalnizca en bastaki ekipman kolonu sabitlenir; araya tasinmis sabit kolon yatay kaydirmayi bozar.
        fixed: kolon.tur === "ekipman" && index === 0 ? "left" : undefined,
        render: (_, satir) => hucreIcerigi(kolon, satir, onDetay, i18n.language),
        onHeaderCell: () => ({
          width: kolon.genislik,
          onResize: (_, { size }) => onGenislikDegistir(kolon.key, size.width),
        }),
      })),
    [gorunurKolonlar, i18n.language, onDetay, onGenislikDegistir, onSirala, siralama]
  );

  // Tablo en az kolonlarin toplami kadar genis olur (dar ekranda yatay kaydirma), genis ekranda karti doldurur.
  // "max-content" kullanilsaydi uzun metinler kolonlari genisletirdi.
  const tabloGenisligi = gorunurKolonlar.reduce((toplam, kolon) => toplam + kolon.genislik, SECIM_KOLONU_GENISLIGI);

  const tablo = (
    <Table
      className="ek-tablo"
      rowKey="clientKey"
      components={TABLO_BILESENLERI}
      columns={kolonlar}
      dataSource={satirlar}
      loading={yukleniyor}
      pagination={false}
      tableLayout="fixed"
      scroll={govdeKayar ? { x: tabloGenisligi, y: scrollY } : { x: tabloGenisligi }}
      sticky={!govdeKayar}
      rowSelection={{
        columnWidth: SECIM_KOLONU_GENISLIGI,
        fixed: true,
        selectedRowKeys: seciliAnahtarlar,
        onChange: onSecimDegistir,
      }}
      onRow={(satir) => ({ onContextMenu: () => setMenuSatiri(satir) })}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("ekipmanListesi.kayitBulunamadi")} /> }}
    />
  );

  return (
    <SatirIslemMenusu
      satir={menuSatiri}
      tetikleyici="contextMenu"
      acik={menuSatiri !== null}
      onAcikDegistir={(acik) => {
        if (!acik) setMenuSatiri(null);
      }}
      onIslem={onIslem}
    >
      {govdeKayar ? (
        <div style={alanStili}>
          <div ref={tabloKutusuRef} style={TABLE_FILL_INNER}>
            {tablo}
          </div>
        </div>
      ) : (
        <div>{tablo}</div>
      )}
    </SatirIslemMenusu>
  );
}

EkipmanTablosu.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  seciliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  siralama: PropTypes.shape({ field: PropTypes.string, order: PropTypes.string }).isRequired,
  onSirala: PropTypes.func.isRequired,
  gorunurKolonlar: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      baslik: PropTypes.string.isRequired,
      genislik: PropTypes.number.isRequired,
      tur: PropTypes.string,
      alan: PropTypes.string,
      sortField: PropTypes.string,
    })
  ).isRequired,
  onGenislikDegistir: PropTypes.func.isRequired,
  onDetay: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
  govdeKayar: PropTypes.bool.isRequired,
};
