import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Empty, Pagination, Select, Table, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuFileSpreadsheet } from "react-icons/lu";
import { hataMetni } from "../../../ortak/yakitApi";
import { ondalikli, sayi, yuzde } from "../../../ortak/yakitBicim";
import { exceleAktar } from "../../../ortak/exceleAktar";
import { getYakitDetayliTablo } from "../../yakitAnalizService";
import { GORUNUMLER, GRUPLAMALAR, detayliTabloKolonlari, gruplamaAktifMi } from "./detayliTabloKolonlari";

const SAYFA_BOYUTLARI = [10, 25, 50];

/** Alt bilgideki "Gosterilen: 1–10 / 31 ekipman" satirinin birimi. */
const kayitBirimiAnahtari = (gorunum, gruplama) => {
  if (gorunum === "lokasyon") return "yakitAnalizleri.detay.birim.lokasyon";
  if (gorunum === "personel") return "yakitAnalizleri.detay.birim.personel";
  if (gorunum === "filo" && gruplama !== "ekipman") return "yakitAnalizleri.detay.birim.grup";
  return "yakitAnalizleri.detay.birim.ekipman";
};

/**
 * Detayli tablo (GetYakitDetayliTablo): 4 hazir gorunum, filo ve performansta gruplama, sayfalama, alt ozet ve
 * Excel (IsExcel: true, sayfalamasiz).
 */
export default function DetayliTablo({ filtre }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const [gorunum, setGorunum] = useState("filo");
  const [gruplama, setGruplama] = useState("ekipman");
  const [sayfaBoyutu, setSayfaBoyutu] = useState(SAYFA_BOYUTLARI[0]);
  const [veri, setVeri] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [excelHazirlaniyor, setExcelHazirlaniyor] = useState(false);

  // Sayfa, secildigi filtre + gorunum + gruplamayla birlikte tutulur; biri degisince ayni render'da ilk sayfaya donulur.
  const sayfaAnahtari = JSON.stringify({ filtre, gorunum, gruplama });
  const [sayfaDurumu, setSayfaDurumu] = useState({ anahtar: sayfaAnahtari, sayfa: 1 });
  const sayfa = sayfaDurumu.anahtar === sayfaAnahtari ? sayfaDurumu.sayfa : 1;
  const setSayfa = (yeniSayfa) => setSayfaDurumu({ anahtar: sayfaAnahtari, sayfa: yeniSayfa });

  const govde = useMemo(
    () => ({ ...filtre, GorunumTipi: gorunum, GruplamaTuru: gruplama, Page: sayfa, PageSize: sayfaBoyutu, IsExcel: false }),
    [filtre, gorunum, gruplama, sayfa, sayfaBoyutu]
  );

  useEffect(() => {
    let iptal = false;
    setYukleniyor(true);
    getYakitDetayliTablo(govde)
      .then((yanit) => !iptal && setVeri(yanit?.data ?? null))
      .catch((error) => {
        if (iptal) return;
        setVeri(null);
        message.error(hataMetni(error, t));
      })
      .finally(() => !iptal && setYukleniyor(false));
    return () => {
      iptal = true;
    };
  }, [govde, t]);

  const kolonlar = useMemo(() => detayliTabloKolonlari({ gorunum, gruplama, t, dil }), [gorunum, gruplama, t, dil]);
  // Kolonlar istek tamamlanmadan degisir; satirlar yeni gorunume ait degilse eski satirlar gosterilmez.
  const satirlar = useMemo(() => (veri?.Liste ?? []).map((satir, index) => ({ ...satir, clientKey: `${gorunum}-${gruplama}-${index}` })), [veri, gorunum, gruplama]);
  const toplam = Number(veri?.ToplamKayit ?? satirlar.length) || 0;
  const altOzet = veri?.AltOzet;
  const ilk = toplam === 0 ? 0 : (sayfa - 1) * sayfaBoyutu + 1;
  const son = Math.min(sayfa * sayfaBoyutu, toplam);

  const exceleAktarTiklandi = async () => {
    setExcelHazirlaniyor(true);
    try {
      const yanit = await getYakitDetayliTablo({ ...govde, Page: 1, IsExcel: true });
      const kayitlar = yanit?.data?.Liste ?? [];
      if (kayitlar.length === 0) {
        message.warning(t("yakitAnalizleri.detay.excelVeriYok"));
        return;
      }
      const sutunlar = kolonlar
        .filter((kolon) => !kolon.excelDisi)
        .flatMap((kolon) => [
          { baslik: kolon.title, deger: kolon.deger },
          ...(kolon.birim ? [{ baslik: t("yakitAnalizleri.detay.birimSutunu", { ad: kolon.title }), deger: kolon.birim, genislik: 12 }] : []),
        ]);
      exceleAktar({ satirlar: kayitlar, sutunlar, dosyaAdi: `${t("yakitAnalizleri.detay.baslik")} - ${t(GORUNUMLER.find((item) => item.value === gorunum).labelKey)}` });
    } catch (error) {
      message.error(hataMetni(error, t));
    } finally {
      setExcelHazirlaniyor(false);
    }
  };

  const ozetParcalari = [];
  if (altOzet && gorunum === "lokasyon") ozetParcalari.push(t("yakitAnalizleri.detay.ozet.toplamEkipman", { deger: sayi(altOzet.ToplamEkipman, dil) }));
  if (altOzet && gorunum === "performans") {
    ozetParcalari.push(t("yakitAnalizleri.detay.ozet.incelemeGerektiren", { deger: sayi(altOzet.IncelemeGerektirenSayisi, dil) }));
    ozetParcalari.push(t("yakitAnalizleri.detay.ozet.ortalamaSapma", { deger: yuzde(altOzet.OrtalamaSapmaYuzde, dil, t) }));
  }
  if (altOzet && gorunum !== "performans") {
    ozetParcalari.push(t("yakitAnalizleri.detay.ozet.toplamYakit", { deger: `${ondalikli(altOzet.ToplamYakit, dil)} ${t("yakitOrtak.litreKisa")}` }));
    ozetParcalari.push(t("yakitAnalizleri.detay.ozet.toplamTutar", { deger: `${ondalikli(altOzet.ToplamTutar, dil)} ${t("yakitOrtak.tl")}` }));
  }

  return (
    <section className="ya-kart">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-(--ya-border) px-5 py-3">
        <h3 className="m-0 text-[15px] font-semibold">{t("yakitAnalizleri.detay.baslik")}</h3>
        <span className="flex items-center gap-2">
          <span className="text-[12px] text-(--ya-muted)">{t("yakitAnalizleri.detay.gruplamaTuru")}</span>
          <Select
            value={gruplama}
            onChange={setGruplama}
            disabled={!gruplamaAktifMi(gorunum)}
            options={GRUPLAMALAR.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
            style={{ width: 160 }}
          />
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-(--ya-muted)">{t("yakitAnalizleri.detay.hazirGorunumler")}</span>
          {GORUNUMLER.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`ya-cip ${gorunum === item.value ? "ya-cip--aktif" : ""}`}
              aria-pressed={gorunum === item.value}
              onClick={() => setGorunum(item.value)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </span>
        <span className="ml-auto flex items-center gap-3">
          <span className="text-[12px] text-(--ya-muted)">{t("yakitAnalizleri.detay.toplamSatir", { deger: sayi(toplam, dil) })}</span>
          <Button icon={<LuFileSpreadsheet size={15} />} loading={excelHazirlaniyor} onClick={exceleAktarTiklandi}>
            {t("yakitAnalizleri.detay.excel")}
          </Button>
        </span>
      </header>

      <Table
        className="ya-detay-tablo"
        rowKey="clientKey"
        columns={kolonlar}
        dataSource={satirlar}
        loading={yukleniyor}
        pagination={false}
        size="middle"
        scroll={{ x: 900 }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("yakitAnalizleri.veriYok")} /> }}
      />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-(--ya-border) px-5 py-3">
        <p className="m-0 text-[12px] text-(--ya-muted)">
          {[
            t("yakitAnalizleri.detay.gosterilen", { ilk: sayi(ilk, dil), son: sayi(son, dil), toplam: sayi(toplam, dil), birim: t(kayitBirimiAnahtari(gorunum, gruplama)) }),
            ...ozetParcalari,
          ].join(" · ")}
        </p>
        <Pagination
          current={sayfa}
          pageSize={sayfaBoyutu}
          total={toplam}
          showSizeChanger
          pageSizeOptions={SAYFA_BOYUTLARI}
          onChange={(yeniSayfa, yeniBoyut) => {
            if (yeniBoyut !== sayfaBoyutu) {
              setSayfaBoyutu(yeniBoyut);
              setSayfa(1);
              return;
            }
            setSayfa(yeniSayfa);
          }}
        />
      </footer>
    </section>
  );
}

DetayliTablo.propTypes = {
  filtre: PropTypes.object.isRequired,
};
