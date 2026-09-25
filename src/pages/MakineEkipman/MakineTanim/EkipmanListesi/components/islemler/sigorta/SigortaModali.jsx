import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Empty, Input, Modal, Popconfirm, Switch, Table, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuPencil, LuPlus, LuSearch, LuTrash2 } from "react-icons/lu";
import SigortaFormModali from "./SigortaFormModali";
import { yanitiBildir } from "../topluCalistir";
import useTemaDegiskenleri from "../../../useTemaDegiskenleri";
import { getSigortaListesi, silSigorta } from "../../../ekipmanService";
import { metniSadelestir } from "../../../ekipmanMetinleri";
import { formatNumberWithSeparators } from "../../../../../../../utils/numberLocale";

const ARANAN_ALANLAR = ["MSG_SIGORTA_TURU", "MSG_POLICE_NO", "MSG_SIGORTA_SIRKETI", "MSG_ACENTA"];

/** Bitis tarihine kalan gun; gecmisse kirmizi yazilir. */
function KalanSure({ gun }) {
  const { t } = useTranslation();
  if (gun === null || gun === undefined) return <span>–</span>;
  if (gun < 0) return <span className="font-medium text-(--ek-danger)">{t("ekipmanListesi.sigorta.gunGecti", { gun: Math.abs(gun) })}</span>;
  return <span>{t("ekipmanListesi.sigorta.gunKaldi", { gun })}</span>;
}

KalanSure.propTypes = { gun: PropTypes.number };

/** Secili ekipmanin sigorta policeleri: listeleme, arama, ekleme, duzenleme ve silme. */
export default function SigortaModali({ satir, onKapat }) {
  const { t, i18n } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const [kayitlar, setKayitlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState("");
  // null: form kapali, {}: yeni police, kayit: duzenleme
  const [duzenlenen, setDuzenlenen] = useState(null);
  const [yenilemeSayaci, setYenilemeSayaci] = useState(0);
  const makineId = satir.TB_MAKINE_ID;

  useEffect(() => {
    let iptal = false;
    setYukleniyor(true);

    getSigortaListesi(makineId)
      .then((response) => {
        if (iptal) return;
        if (response?.has_error) {
          setKayitlar([]);
          message.error(response?.message || t("hataOlustu"));
          return;
        }
        const liste = Array.isArray(response?.data) ? response.data : [];
        setKayitlar(liste.map((kayit, index) => ({ ...kayit, clientKey: `${kayit.TB_MAKINE_SIGORTA_ID ?? "sigorta"}-${index}` })));
      })
      .catch((error) => {
        if (iptal) return;
        console.error("Sigorta listesi alınamadı:", error);
        message.error(t("hataOlustu"));
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });

    return () => {
      iptal = true;
    };
  }, [makineId, yenilemeSayaci, t]);

  const gorunenKayitlar = useMemo(() => {
    const aranan = metniSadelestir(arama.trim());
    if (!aranan) return kayitlar;
    return kayitlar.filter((kayit) => ARANAN_ALANLAR.some((alan) => metniSadelestir(kayit[alan]).includes(aranan)));
  }, [arama, kayitlar]);

  const yenile = () => setYenilemeSayaci((sayac) => sayac + 1);

  const sil = async (kayit) => {
    try {
      const response = await silSigorta(kayit.TB_MAKINE_SIGORTA_ID);
      if (yanitiBildir(response, t)) yenile();
    } catch (error) {
      console.error("Sigorta kaydı silinemedi:", error);
      message.error(t("islemBasarisiz"));
    }
  };

  const kolonlar = [
    { title: t("aktif"), key: "aktif", width: 70, render: (_, kayit) => <Switch size="small" checked={kayit.MSG_AKTIF !== false} disabled /> },
    { title: t("ekipmanListesi.sigorta.tur"), dataIndex: "MSG_SIGORTA_TURU", key: "tur", render: (deger) => <span className="font-medium">{deger || "–"}</span> },
    { title: t("ekipmanListesi.sigorta.policeNo"), dataIndex: "MSG_POLICE_NO", key: "policeNo" },
    { title: t("baslangicTarihi"), dataIndex: "MSG_BASLANGIC_TARIH_STR", key: "baslangic" },
    { title: t("bitisTarihi"), dataIndex: "MSG_TARIH_STR", key: "bitis" },
    { title: t("ekipmanListesi.sigorta.kalanSure"), dataIndex: "KALAN_GUN", key: "kalan", render: (gun) => <KalanSure gun={gun} /> },
    {
      title: t("tutar"),
      dataIndex: "MSG_TUTAR",
      key: "tutar",
      align: "right",
      render: (deger) => (deger === null || deger === undefined ? "–" : `${formatNumberWithSeparators(deger, i18n.language)} ${t("paraBirimi")}`),
    },
    { title: t("firma"), dataIndex: "MSG_SIGORTA_SIRKETI", key: "firma" },
    { title: t("ekipmanListesi.sigorta.acenta"), dataIndex: "MSG_ACENTA", key: "acenta" },
    {
      title: t("ekipmanListesi.sigorta.islemler"),
      key: "islemler",
      width: 96,
      render: (_, kayit) => (
        <div className="flex gap-1">
          <Button type="text" size="small" icon={<LuPencil size={15} />} title={t("ekipmanListesi.sigorta.duzenle")} aria-label={t("ekipmanListesi.sigorta.duzenle")} onClick={() => setDuzenlenen(kayit)} />
          <Popconfirm title={t("ekipmanListesi.sigorta.silOnay")} okText={t("evet")} cancelText={t("hayir")} onConfirm={() => sil(kayit)}>
            <Button type="text" size="small" danger icon={<LuTrash2 size={15} />} title={t("sil")} aria-label={t("sil")} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Modal open centered width={1120} rootClassName="ek-tokenlar" title={t("ekipmanListesi.sigorta.baslik")} onCancel={onKapat} footer={null}>
      <div className="flex flex-col gap-4" style={temaDegiskenleri}>
        <p className="m-0 text-sm text-(--ek-muted)">{t("ekipmanListesi.sigorta.aciklama")}</p>

        <div className="rounded-md border border-(--ek-border) bg-(--ek-accent) px-3 py-2.5">
          <p className="m-0 text-[13px] font-medium">{[satir.MKN_KOD, satir.MKN_TANIM].filter(Boolean).join(" · ")}</p>
          <p className="m-0 mt-0.5 text-[12px] text-(--ek-muted)">{[satir.MKN_LOKASYON, satir.MKN_TIP].filter(Boolean).join(" · ")}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="m-0 text-[14px] font-semibold">{t("ekipmanListesi.sigorta.policeListesi")}</h3>
            <Input
              allowClear
              className="mt-2 w-full sm:w-80"
              value={arama}
              onChange={(event) => setArama(event.target.value)}
              placeholder={t("ekipmanListesi.sigorta.ara")}
              aria-label={t("ekipmanListesi.sigorta.ara")}
              prefix={<LuSearch size={16} className="text-(--ek-subtle)" />}
            />
          </div>
          <Button type="primary" icon={<LuPlus size={16} />} onClick={() => setDuzenlenen({})}>
            {t("ekipmanListesi.sigorta.yeniPolice")}
          </Button>
        </div>

        <Table
          size="small"
          rowKey="clientKey"
          columns={kolonlar}
          dataSource={gorunenKayitlar}
          loading={yukleniyor}
          pagination={false}
          scroll={{ x: 980 }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("ekipmanListesi.sigorta.kayitYok")} /> }}
        />
      </div>

      {duzenlenen && (
        <SigortaFormModali
          satir={satir}
          kayit={duzenlenen}
          onKapat={() => setDuzenlenen(null)}
          onKaydedildi={() => {
            setDuzenlenen(null);
            yenile();
          }}
        />
      )}
    </Modal>
  );
}

SigortaModali.propTypes = {
  satir: PropTypes.shape({
    TB_MAKINE_ID: PropTypes.number.isRequired,
    MKN_KOD: PropTypes.string,
    MKN_TANIM: PropTypes.string,
    MKN_LOKASYON: PropTypes.string,
    MKN_TIP: PropTypes.string,
  }).isRequired,
  onKapat: PropTypes.func.isRequired,
};
