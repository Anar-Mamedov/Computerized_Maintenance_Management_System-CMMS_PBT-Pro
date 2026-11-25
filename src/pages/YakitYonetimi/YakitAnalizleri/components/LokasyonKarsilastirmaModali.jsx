import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Table, message } from "antd";
import { useTranslation } from "react-i18next";
import AnalizModali, { farkYonu } from "./AnalizModali";
import { FarkRozeti, ModalDurumRozeti } from "./Rozetler";
import { hataMetni } from "../../ortak/yakitApi";
import { ondalikli, sayi, yuzde as yuzdeBicimi } from "../../ortak/yakitBicim";
import { getYakitLokasyonKarsilastirma } from "../yakitAnalizService";

const VARSAYILAN_SIRALAMA = { SortBy: "liters", SortDir: "desc" };

/**
 * "Karsilastir" modali: lokasyon bazinda tuketim, maliyet ve ortalama tuketim (GetYakitLokasyonKarsilastirma).
 * Kolon basliklarina tiklaninca sunucuda siralanir (SortBy: name, equipmentCount, liters, share, cost, km, hours, delta).
 */
export default function LokasyonKarsilastirmaModali({ acik, filtre, onKapat }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const [veri, setVeri] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [siralama, setSiralama] = useState(VARSAYILAN_SIRALAMA);

  useEffect(() => {
    if (!acik) return undefined;
    let iptal = false;
    setYukleniyor(true);
    getYakitLokasyonKarsilastirma({ ...filtre, ...siralama })
      .then((yanit) => !iptal && setVeri(yanit?.data ?? null))
      .catch((error) => !iptal && message.error(hataMetni(error, t)))
      .finally(() => !iptal && setYukleniyor(false));
    return () => {
      iptal = true;
    };
  }, [acik, filtre, siralama, t]);

  const litre = (deger) => `${ondalikli(deger, dil)} ${t("yakitOrtak.litreKisa")}`;
  const tl = (deger) => `${ondalikli(deger, dil)} ${t("yakitOrtak.tl")}`;
  const yuzde = (deger) => yuzdeBicimi(deger, dil, t);
  const siraDurumu = (anahtar) => (siralama.SortBy === anahtar ? (siralama.SortDir === "asc" ? "ascend" : "descend") : null);
  const siralanabilir = (anahtar) => ({ key: anahtar, sorter: true, sortOrder: siraDurumu(anahtar), showSorterTooltip: false });

  const kolonlar = [
    { ...siralanabilir("name"), title: t("yakitAnalizleri.lokasyonModal.lokasyon"), render: (_, satir) => <span className="font-semibold">{satir.LokasyonAdi}</span> },
    { ...siralanabilir("equipmentCount"), title: t("yakitAnalizleri.lokasyonModal.ekipmanSayisi"), align: "right", render: (_, satir) => sayi(satir.EkipmanSayisi, dil) },
    { ...siralanabilir("liters"), title: t("yakitAnalizleri.lokasyonModal.yakitTuketimi"), align: "right", render: (_, satir) => litre(satir.ToplamMiktar) },
    { ...siralanabilir("share"), title: t("yakitAnalizleri.lokasyonModal.tuketimPayi"), align: "right", render: (_, satir) => yuzde(satir.TuketimPayi) },
    { ...siralanabilir("cost"), title: t("yakitAnalizleri.lokasyonModal.toplamMaliyet"), align: "right", render: (_, satir) => tl(satir.ToplamMaliyet) },
    { ...siralanabilir("km"), title: t("yakitAnalizleri.lokasyonModal.mesafe"), align: "right", render: (_, satir) => `${sayi(satir.ToplamKm, dil)} ${t("yakitOrtak.km")}` },
    {
      ...siralanabilir("hours"),
      title: t("yakitAnalizleri.lokasyonModal.calisma"),
      align: "right",
      render: (_, satir) => `${sayi(satir.ToplamSaat, dil)} ${t("yakitOrtak.saat")}`,
    },
    {
      key: "ortalama",
      title: t("yakitAnalizleri.lokasyonModal.ortalamaTuketim"),
      align: "right",
      // Arac ve makine ortalamalari ayri satirda; null olan yazilmaz (dokuman 3.3).
      render: (_, satir) => (
        <div className="leading-snug whitespace-nowrap">
          {satir.AracOrtTuketim !== null && satir.AracOrtTuketim !== undefined && (
            <div>{t("yakitAnalizleri.lokasyonModal.aracOrt", { deger: ondalikli(satir.AracOrtTuketim, dil) })}</div>
          )}
          {satir.MakineOrtTuketim !== null && satir.MakineOrtTuketim !== undefined && (
            <div className="text-(--ya-muted)">{t("yakitAnalizleri.lokasyonModal.makineOrt", { deger: ondalikli(satir.MakineOrtTuketim, dil) })}</div>
          )}
        </div>
      ),
    },
    {
      ...siralanabilir("delta"),
      title: t("yakitAnalizleri.lokasyonModal.oncekiDonemFarki"),
      align: "right",
      render: (_, satir) => <FarkRozeti yuzde={satir.OncekiDonemFarkYuzde} ton={farkYonu(satir.OncekiDonemFarkYuzde)} />,
    },
    { key: "durum", title: t("yakitAnalizleri.lokasyonModal.durum"), align: "right", render: (_, satir) => <ModalDurumRozeti durum={satir.Durum} /> },
  ];

  // Siralama kaldirilinca varsayilana donulur.
  const tabloDegisti = (_sayfalama, _filtreler, siralayici) => {
    const tekSiralayici = Array.isArray(siralayici) ? siralayici[0] : siralayici;
    setSiralama(tekSiralayici?.order ? { SortBy: tekSiralayici.columnKey, SortDir: tekSiralayici.order === "ascend" ? "asc" : "desc" } : VARSAYILAN_SIRALAMA);
  };

  // Modal her acilista varsayilan siralamayla (yakit tuketimi, cok -> az) baslasin diye kapanirken siralama sifirlanir.
  const kapat = () => {
    setSiralama(VARSAYILAN_SIRALAMA);
    onKapat();
  };

  const toplamlar = veri?.Toplamlar;

  return (
    <AnalizModali
      acik={acik}
      baslik={t("yakitAnalizleri.lokasyonModal.baslik")}
      altBaslik={t("yakitAnalizleri.lokasyonModal.altBaslik")}
      baslangic={veri?.BaslangicTarihi}
      bitis={veri?.BitisTarihi}
      onKapat={kapat}
    >
      <Table
        className="ya-modal-tablo"
        rowKey={(satir) => `${satir.LokasyonId}-${satir.LokasyonAdi}`}
        columns={kolonlar}
        dataSource={veri?.Liste ?? []}
        loading={yukleniyor}
        pagination={false}
        size="middle"
        scroll={{ x: 1100 }}
        onChange={tabloDegisti}
        summary={() =>
          toplamlar && (
            <Table.Summary.Row className="ya-toplam-satiri">
              <Table.Summary.Cell index={0}>{t("yakitAnalizleri.toplam")}</Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                {sayi(toplamlar.ToplamEkipman, dil)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">
                {litre(toplamlar.ToplamMiktar)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right">
                {yuzde(toplamlar.ToplamPay)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="right">
                {tl(toplamlar.ToplamMaliyet)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="right">
                {`${sayi(toplamlar.ToplamKm, dil)} ${t("yakitOrtak.km")}`}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="right">
                {`${sayi(toplamlar.ToplamSaat, dil)} ${t("yakitOrtak.saat")}`}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="right">
                —
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="right">
                <FarkRozeti yuzde={toplamlar.GenelFarkYuzde} ton={farkYonu(toplamlar.GenelFarkYuzde)} />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} />
            </Table.Summary.Row>
          )
        }
      />
    </AnalizModali>
  );
}

LokasyonKarsilastirmaModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  filtre: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
};
