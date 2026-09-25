import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Drawer, Select, Space, Typography } from "antd";
import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AtolyeFilterSelectbox from "../../../../../../utils/components/AtolyeFilterSelectbox";
import EkipmanFilterSelectbox from "../../../../../../utils/components/EkipmanFilterSelectbox";
import KodFilterSelectbox from "../../../../../../utils/components/KodFilterSelectbox";
import MarkaFilterSelectbox from "../../../../../../utils/components/MarkaFilterSelectbox";
import ModelFilterSelectbox from "../../../../../../utils/components/ModelFilterSelectbox";
import { BAKIM_DURUMLARI, KOD_GRUPLARI } from "../../constants";

const { Text } = Typography;

// Olculer eski filtre cekmecesiyle ayni (MakineTanim/Table/filter, utils/components/FiltreCekmecesi).
const KUTU_STILI = { marginBottom: "10px", border: "1px solid #80808048", padding: "15px 10px", borderRadius: "8px" };
const KUTU_BASLIGI_STILI = { marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" };
const ALAN_SECIMI_STILI = { width: "100%", marginBottom: "10px" };
const TAM_GENISLIK = { width: "100%" };
const EKLE_DUGMESI_STILI = { display: "flex", alignItems: "center", width: "100%", justifyContent: "center" };

/** Cekmecede secilebilen filtreler; `anahtar` ekranin filtre alanidir (listeIstegi.js). Deger kontrolleri global bilesenlerdir. */
const ALANLAR = [
  { anahtar: "markaIds", labelKey: "marka", tip: "marka" },
  { anahtar: "modelIds", labelKey: "model", tip: "model" },
  { anahtar: "atolyeIds", labelKey: "atolye", tip: "atolye" },
  { anahtar: "durumIds", labelKey: "durum", tip: "durum" },
  { anahtar: "makineIds", labelKey: "ekipman", tip: "ekipman" },
  { anahtar: "bakimDurumu", labelKey: "ekipmanListesi.periyodikBakimDurumu", tip: "tekli" },
  { anahtar: "arizali", labelKey: "arizali", tip: "tekli" },
];

const ALAN_BILGISI = Object.fromEntries(ALANLAR.map((alan) => [alan.anahtar, alan]));

const bosDeger = (alan) => (alan.tip === "tekli" ? null : []);

const doluMu = (deger) => (Array.isArray(deger) ? deger.length > 0 : deger !== null && deger !== undefined);

/** Cekmece acilirken uygulanmis her filtre kendi satiriyla gosterilir. */
const baslangicSatirlari = (filtreler) => ALANLAR.filter((alan) => doluMu(filtreler[alan.anahtar])).map((alan) => ({ id: alan.anahtar, alan: alan.anahtar }));

const baslangicDegerleri = (filtreler) => Object.fromEntries(ALANLAR.map((alan) => [alan.anahtar, filtreler[alan.anahtar] ?? bosDeger(alan)]));

/**
 * Eski filtre cekmecesi duzeni: "Filtre ekle" ile satir eklenir, satirda once alan secilir, sonra degeri.
 * Secimler "Uygula" ile listeye uygulanir; "Temizle" cekmecedeki tum filtreleri hemen kaldirir.
 * Cekmece her acilista uygulanmis filtrelerden kurulur (cip ve KPI kartlariyla yapilan degisiklikler dahil).
 */
export default function GelismisFiltreler({ acik, onKapat, filtreler, onFiltreDegistir }) {
  const { t } = useTranslation();
  const [satirlar, setSatirlar] = useState([]);
  const [degerler, setDegerler] = useState({});
  const [oncekiAcik, setOncekiAcik] = useState(false);
  const satirSayaciRef = useRef(0);

  if (acik !== oncekiAcik) {
    setOncekiAcik(acik);
    if (acik) {
      setSatirlar(baslangicSatirlari(filtreler));
      setDegerler(baslangicDegerleri(filtreler));
    }
  }

  const tekliSecenekler = {
    bakimDurumu: BAKIM_DURUMLARI.map((durum) => ({ value: durum.value, label: t(durum.labelKey) })),
    arizali: [
      { value: true, label: t("evet") },
      { value: false, label: t("hayir") },
    ],
  };

  const satirEkle = () => {
    satirSayaciRef.current += 1;
    setSatirlar((onceki) => [...onceki, { id: `yeni-${satirSayaciRef.current}`, alan: null }]);
  };

  const satirSil = (satir) => {
    setSatirlar((onceki) => onceki.filter((oge) => oge.id !== satir.id));
    if (satir.alan) setDegerler((onceki) => ({ ...onceki, [satir.alan]: bosDeger(ALAN_BILGISI[satir.alan]) }));
  };

  const alanDegistir = (satir, yeniAlan) => {
    setSatirlar((onceki) => onceki.map((oge) => (oge.id === satir.id ? { ...oge, alan: yeniAlan } : oge)));
    setDegerler((onceki) => ({
      ...onceki,
      ...(satir.alan ? { [satir.alan]: bosDeger(ALAN_BILGISI[satir.alan]) } : {}),
      [yeniAlan]: bosDeger(ALAN_BILGISI[yeniAlan]),
    }));
  };

  // Ayni alan iki satirda secilemez.
  const alanSecenekleri = (satir) => {
    const digerSatirlarinAlanlari = satirlar.filter((oge) => oge.id !== satir.id).map((oge) => oge.alan);
    return ALANLAR.filter((alan) => !digerSatirlarinAlanlari.includes(alan.anahtar)).map((alan) => ({ value: alan.anahtar, label: t(alan.labelKey) }));
  };

  const uygula = () => {
    const degisiklik = {};
    ALANLAR.forEach((alan) => {
      const satiriVar = satirlar.some((satir) => satir.alan === alan.anahtar);
      const yeniDeger = satiriVar ? degerler[alan.anahtar] ?? bosDeger(alan) : bosDeger(alan);
      if (JSON.stringify(yeniDeger) !== JSON.stringify(filtreler[alan.anahtar] ?? bosDeger(alan))) {
        degisiklik[alan.anahtar] = yeniDeger;
      }
    });

    if (Object.keys(degisiklik).length) onFiltreDegistir(degisiklik);
    onKapat();
  };

  const temizle = () => {
    setSatirlar([]);
    setDegerler({});
    onFiltreDegistir(Object.fromEntries(ALANLAR.map((alan) => [alan.anahtar, bosDeger(alan)])));
  };

  const degerKontrolu = (satir) => {
    const alan = ALAN_BILGISI[satir.alan];
    if (!alan) return null;

    const etiket = t(alan.labelKey);
    const deger = degerler[alan.anahtar] ?? bosDeger(alan);
    const degerYaz = (yeniDeger) => setDegerler((onceki) => ({ ...onceki, [alan.anahtar]: yeniDeger }));

    if (alan.tip === "marka") return <MarkaFilterSelectbox value={deger} onChange={degerYaz} />;
    if (alan.tip === "model") return <ModelFilterSelectbox value={deger} onChange={degerYaz} />;
    if (alan.tip === "atolye") return <AtolyeFilterSelectbox value={deger} onChange={degerYaz} />;
    if (alan.tip === "durum") return <KodFilterSelectbox kodGrubu={KOD_GRUPLARI.makineDurumu} placeholder={etiket} value={deger} onChange={degerYaz} />;
    if (alan.tip === "ekipman") return <EkipmanFilterSelectbox value={deger} onChange={degerYaz} />;

    // Sabit secenekli alanlar (Periyodik Bakim Durumu, Arizali); eski cekmecedeki "select" tipiyle ayni.
    return (
      <Select
        style={TAM_GENISLIK}
        placeholder={etiket}
        value={deger ?? undefined}
        onChange={(yeniDeger) => degerYaz(yeniDeger ?? null)}
        options={tekliSecenekler[alan.anahtar]}
        allowClear
      />
    );
  };

  return (
    <Drawer
      rootClassName="ek-filtre-cekmecesi"
      title={
        <span>
          <FilterOutlined style={{ marginRight: "8px" }} />
          {t("filtreler")}
        </span>
      }
      placement="right"
      open={acik}
      onClose={onKapat}
      extra={
        <Space>
          <Button onClick={temizle}>{t("temizle")}</Button>
          <Button type="primary" onClick={uygula}>
            {t("uygula")}
          </Button>
        </Space>
      }
    >
      {satirlar.map((satir) => (
        <div key={satir.id} style={KUTU_STILI}>
          <div style={KUTU_BASLIGI_STILI}>
            <Text>{t("yeniFiltre")}</Text>
            <button
              type="button"
              className="ek-filtre-kapat"
              aria-label={t("ekipmanListesi.filtreyiKaldir", { ad: satir.alan ? t(ALAN_BILGISI[satir.alan].labelKey) : t("yeniFiltre") })}
              onClick={() => satirSil(satir)}
            >
              <CloseOutlined />
            </button>
          </div>
          <Select
            style={ALAN_SECIMI_STILI}
            showSearch
            placeholder={t("secimYap")}
            optionFilterProp="label"
            value={satir.alan ?? undefined}
            onChange={(yeniAlan) => alanDegistir(satir, yeniAlan)}
            options={alanSecenekleri(satir)}
          />
          {degerKontrolu(satir)}
        </div>
      ))}

      <Button type="primary" onClick={satirEkle} style={EKLE_DUGMESI_STILI}>
        <PlusOutlined />
        {t("filtreEkle")}
      </Button>
    </Drawer>
  );
}

GelismisFiltreler.propTypes = {
  acik: PropTypes.bool.isRequired,
  onKapat: PropTypes.func.isRequired,
  filtreler: PropTypes.shape({
    markaIds: PropTypes.array.isRequired,
    modelIds: PropTypes.array.isRequired,
    atolyeIds: PropTypes.array.isRequired,
    durumIds: PropTypes.array.isRequired,
    makineIds: PropTypes.array.isRequired,
    bakimDurumu: PropTypes.string,
    arizali: PropTypes.bool,
  }).isRequired,
  onFiltreDegistir: PropTypes.func.isRequired,
};
