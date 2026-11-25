import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Table, message } from "antd";
import { useTranslation } from "react-i18next";
import AnalizModali, { farkYonu } from "./AnalizModali";
import { FarkRozeti, ModalDurumRozeti } from "./Rozetler";
import { hataMetni } from "../../ortak/yakitApi";
import { ondalikli, sayi, yuzde as yuzdeBicimi } from "../../ortak/yakitBicim";
import { getYakitMakineTipiAnaliz } from "../yakitAnalizService";

/** "Tip analizi" modali: makine tipi bazinda tuketim, maliyet ve verimlilik (GetYakitMakineTipiAnaliz). */
export default function MakineTipiAnalizModali({ acik, filtre, onKapat }) {
  const { t, i18n } = useTranslation();
  const dil = i18n.language;
  const [veri, setVeri] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!acik) return undefined;
    let iptal = false;
    setYukleniyor(true);
    getYakitMakineTipiAnaliz(filtre)
      .then((yanit) => !iptal && setVeri(yanit?.data ?? null))
      .catch((error) => !iptal && message.error(hataMetni(error, t)))
      .finally(() => !iptal && setYukleniyor(false));
    return () => {
      iptal = true;
    };
  }, [acik, filtre, t]);

  const litre = (deger) => `${ondalikli(deger, dil)} ${t("yakitOrtak.litreKisa")}`;
  const tl = (deger) => `${ondalikli(deger, dil)} ${t("yakitOrtak.tl")}`;
  const yuzde = (deger) => yuzdeBicimi(deger, dil, t);

  const kolonlar = [
    { key: "tip", title: t("yakitAnalizleri.makineTipiModal.makineTipi"), dataIndex: "MakineTipi", render: (deger) => <span className="font-semibold">{deger}</span> },
    { key: "ekipman", title: t("yakitAnalizleri.makineTipiModal.ekipmanSayisi"), align: "right", render: (_, satir) => sayi(satir.EkipmanSayisi, dil) },
    { key: "miktar", title: t("yakitAnalizleri.makineTipiModal.toplamTuketim"), align: "right", render: (_, satir) => litre(satir.ToplamMiktar) },
    { key: "pay", title: t("yakitAnalizleri.makineTipiModal.tuketimPayi"), align: "right", render: (_, satir) => yuzde(satir.TuketimPayi) },
    {
      key: "kullanim",
      title: t("yakitAnalizleri.makineTipiModal.mesafeCalisma"),
      align: "right",
      render: (_, satir) => `${sayi(satir.ToplamKullanim, dil)} ${satir.KullanimBirimi ?? ""}`,
    },
    {
      key: "ortalama",
      title: t("yakitAnalizleri.makineTipiModal.ortalamaTuketim"),
      align: "right",
      render: (_, satir) => `${ondalikli(satir.OrtalamaTuketim, dil)} ${satir.OrtalamaBirim ?? ""}`,
    },
    { key: "maliyet", title: t("yakitAnalizleri.makineTipiModal.toplamMaliyet"), align: "right", render: (_, satir) => tl(satir.ToplamMaliyet) },
    {
      key: "fark",
      title: t("yakitAnalizleri.makineTipiModal.oncekiDonemFarki"),
      align: "right",
      render: (_, satir) => <FarkRozeti yuzde={satir.OncekiDonemFarkYuzde} ton={farkYonu(satir.OncekiDonemFarkYuzde)} />,
    },
    { key: "durum", title: t("yakitAnalizleri.makineTipiModal.durum"), align: "right", render: (_, satir) => <ModalDurumRozeti durum={satir.Durum} /> },
  ];

  const toplamlar = veri?.Toplamlar;
  const toplamKullanim =
    toplamlar && (Number(toplamlar.ToplamKm) > 0 || Number(toplamlar.ToplamSaat) > 0)
      ? t("yakitAnalizleri.kmSaat", { km: sayi(toplamlar.ToplamKm, dil), saat: sayi(toplamlar.ToplamSaat, dil) })
      : "—";

  return (
    <AnalizModali
      acik={acik}
      baslik={t("yakitAnalizleri.makineTipiModal.baslik")}
      altBaslik={t("yakitAnalizleri.makineTipiModal.altBaslik")}
      baslangic={veri?.BaslangicTarihi}
      bitis={veri?.BitisTarihi}
      onKapat={onKapat}
    >
      <Table
        className="ya-modal-tablo"
        rowKey={(satir) => `${satir.TipId}-${satir.MakineTipi}`}
        columns={kolonlar}
        dataSource={veri?.Liste ?? []}
        loading={yukleniyor}
        pagination={false}
        size="middle"
        scroll={{ x: 1000 }}
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
                {toplamKullanim}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="right">
                —
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="right">
                {tl(toplamlar.ToplamMaliyet)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="right">
                <FarkRozeti yuzde={toplamlar.GenelFarkYuzde} ton={farkYonu(toplamlar.GenelFarkYuzde)} />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} />
            </Table.Summary.Row>
          )
        }
      />
    </AnalizModali>
  );
}

MakineTipiAnalizModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  filtre: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
};
