import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Badge, Button, Col, Drawer, Input, Row, Select, Space, Typography } from "antd";
import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { t } from "i18next";
import LokasyonTablo from "./LokasyonTablo";
import EkipmanFilterSelectbox from "./EkipmanFilterSelectbox";
import AtolyeFilterSelectbox from "./AtolyeFilterSelectbox";
import FullDatePicker from "./FullDatePicker";

const { Text } = Typography;

const KUTU_STILI = {
  marginBottom: "10px",
  border: "1px solid #80808048",
  padding: "15px 10px",
  borderRadius: "8px",
};

const TARIH_KUTUSU_STILI = { ...KUTU_STILI, marginBottom: "20px" };

// ID bazlı seçim yapan alan tipleri; değerleri liste API'sinin kök alanlarına yazılır.
const ID_TIPLERI = ["lokasyon", "ekipman", "atolye"];

const toGunFormati = (value) => {
  const tarih = value ? dayjs(value) : null;
  return tarih?.isValid() ? tarih.format("YYYY-MM-DD") : null;
};

/**
 * Uygulamanın varsayılan filtre çekmecesi (İş Emri ekranındaki düzen).
 *
 * Tarih aralığı çekmecenin üstünde sabit durur; diğer filtreler "Filtre ekle" ile
 * eklenen satırların içinde seçilir. Satırdaki alan seçimine göre altındaki kontrol değişir:
 * lokasyon modal, ekipman aranabilir selectbox, tanımlı seçenekler select, kalanı serbest metin.
 *
 * `alanlar` her ekranın kendi filtre listesini verir:
 *   { value: "lokasyonlar", label: "Lokasyon", tip: "lokasyon" }
 *   { value: "durum", label: "Durum", tip: "select", secenekler: [{ value, label }] }
 *   { value: "pbk.PBK_TANIM", label: "Bakım Tanımı", tip: "metin" }
 */
export default function FiltreCekmecesi({ alanlar, baslangicFiltreleri, onSubmit }) {
  const [open, setOpen] = useState(false);
  const [satirlar, setSatirlar] = useState([]);
  const [satirAlanlari, setSatirAlanlari] = useState({});
  const [satirDegerleri, setSatirDegerleri] = useState({});

  const methods = useForm({
    defaultValues: {
      cekmeceBaslangicTarihi: baslangicFiltreleri?.startDate ? dayjs(baslangicFiltreleri.startDate) : null,
      cekmeceBitisTarihi: baslangicFiltreleri?.endDate ? dayjs(baslangicFiltreleri.endDate) : null,
    },
  });

  const { setValue, watch } = methods;
  const baslangicTarihi = watch("cekmeceBaslangicTarihi");
  const bitisTarihi = watch("cekmeceBitisTarihi");

  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  const alanBilgisi = useMemo(() => {
    const harita = {};
    alanlar.forEach((alan) => {
      harita[alan.value] = alan;
    });
    return harita;
  }, [alanlar]);

  // Dashboard'dan gelen filtreler için otomatik satır açılır ve seçimleri işaretlenir.
  const baslangicAnahtari = JSON.stringify(baslangicFiltreleri || {});

  useEffect(() => {
    const gelen = JSON.parse(baslangicAnahtari);

    setValue("cekmeceBaslangicTarihi", gelen.startDate ? dayjs(gelen.startDate) : null);
    setValue("cekmeceBitisTarihi", gelen.endDate ? dayjs(gelen.endDate) : null);

    const yeniSatirlar = [];
    const yeniAlanlar = {};
    const yeniDegerler = {};

    alanlar.forEach((alan) => {
      const deger = gelen[alan.value];
      const doluMu = Array.isArray(deger) ? deger.length > 0 : deger !== null && deger !== undefined && deger !== "";
      if (!doluMu) return;

      const satirId = `dashboard-${alan.value}`;
      yeniSatirlar.push({ id: satirId });
      yeniAlanlar[satirId] = alan.value;
      yeniDegerler[satirId] = deger;
    });

    setSatirlar((oncekiler) => {
      const kullaniciSatirlari = oncekiler.filter((satir) => !String(satir.id).startsWith("dashboard-"));
      return [...yeniSatirlar, ...kullaniciSatirlari];
    });
    setSatirAlanlari((state) => ({ ...state, ...yeniAlanlar }));
    setSatirDegerleri((state) => ({ ...state, ...yeniDegerler }));
  }, [baslangicAnahtari, alanlar, setValue]);

  const tarihAraligi = useMemo(() => {
    const startDate = toGunFormati(baslangicTarihi);
    const endDate = toGunFormati(bitisTarihi);

    return {
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    };
  }, [baslangicTarihi, bitisTarihi]);

  // Serbest metin yazarken her tuşta istek atılmasın diye çıktı geciktirilir.
  useEffect(() => {
    const zamanlayici = setTimeout(() => {
      const cikti = {};

      satirlar.forEach((satir) => {
        const alan = satirAlanlari[satir.id];
        if (!alan) return;

        const deger = satirDegerleri[satir.id];
        const bosMu = Array.isArray(deger) ? deger.length === 0 : deger === null || deger === undefined || deger === "";
        if (bosMu) return;

        if (Array.isArray(deger)) {
          cikti[alan] = [...new Set([...(cikti[alan] || []), ...deger])];
          return;
        }

        cikti[alan] = deger;
      });

      if (tarihAraligi.startDate || tarihAraligi.endDate) {
        cikti.customfilters = tarihAraligi;
      }

      onSubmitRef.current(cikti);
    }, 400);

    return () => clearTimeout(zamanlayici);
  }, [satirlar, satirAlanlari, satirDegerleri, tarihAraligi]);

  const filtreSayisi =
    satirlar.filter((satir) => {
      const deger = satirDegerleri[satir.id];
      return Array.isArray(deger) ? deger.length > 0 : deger !== null && deger !== undefined && deger !== "";
    }).length + (tarihAraligi.startDate || tarihAraligi.endDate ? 1 : 0);

  const satirEkle = () => setSatirlar((oncekiler) => [...oncekiler, { id: `satir-${Date.now()}` }]);

  const satirSil = (satirId) => {
    setSatirlar((oncekiler) => oncekiler.filter((satir) => satir.id !== satirId));
    setSatirAlanlari((state) => {
      const kalan = { ...state };
      delete kalan[satirId];
      return kalan;
    });
    setSatirDegerleri((state) => {
      const kalan = { ...state };
      delete kalan[satirId];
      return kalan;
    });
  };

  const temizle = () => {
    setSatirlar([]);
    setSatirAlanlari({});
    setSatirDegerleri({});
    setValue("cekmeceBaslangicTarihi", null);
    setValue("cekmeceBitisTarihi", null);
  };

  const degerKontrolu = (satir) => {
    const alanAdi = satirAlanlari[satir.id];
    const alan = alanBilgisi[alanAdi];
    const deger = satirDegerleri[satir.id];
    const degerYaz = (yeniDeger) => setSatirDegerleri((state) => ({ ...state, [satir.id]: yeniDeger }));

    if (!alan) {
      return <Input placeholder={t("aramaYap")} disabled />;
    }

    if (alan.tip === "lokasyon") {
      return (
        <LokasyonTablo
          multiple
          workshopSelectedId={Array.isArray(deger) ? deger : []}
          lokasyonFieldName={`cekmeceLokasyonTanim-${satir.id}`}
          lokasyonIdFieldName={`cekmeceLokasyonID-${satir.id}`}
          placeholder={alan.label}
          onSubmit={(secilenler) => degerYaz(secilenler.map((item) => item.key))}
          onClear={() => degerYaz([])}
        />
      );
    }

    if (alan.tip === "ekipman") {
      return <EkipmanFilterSelectbox value={Array.isArray(deger) ? deger : []} onChange={degerYaz} />;
    }

    if (alan.tip === "atolye") {
      return <AtolyeFilterSelectbox value={Array.isArray(deger) ? deger : []} onChange={degerYaz} />;
    }

    if (alan.tip === "select") {
      return <Select style={{ width: "100%" }} placeholder={alan.label} value={deger ?? null} onChange={degerYaz} options={alan.secenekler || []} allowClear />;
    }

    return <Input placeholder={t("aramaYap")} value={deger || ""} onChange={(event) => degerYaz(event.target.value)} />;
  };

  // Aynı alan iki satırda seçilmesin.
  const kullanilabilirAlanlar = (satirId) => {
    const secililer = Object.entries(satirAlanlari)
      .filter(([id]) => id !== satirId)
      .map(([, alan]) => alan);

    return alanlar.filter((alan) => !secililer.includes(alan.value)).map(({ value, label }) => ({ value, label }));
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FilterOutlined />
        {t("filtreler")}
        <Badge count={filtreSayisi} size="small" style={{ backgroundColor: "#006cb8" }} />
      </Button>

      <Drawer
        title={
          <span>
            <FilterOutlined style={{ marginRight: "8px" }} />
            {t("filtreler")}
          </span>
        }
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        extra={
          <Space>
            <Button onClick={temizle}>{t("temizle")}</Button>
            <Button type="primary" onClick={() => setOpen(false)}>
              {t("uygula")}
            </Button>
          </Space>
        }
      >
        <FormProvider {...methods}>
          {/* Tarih aralığı her zaman görünür; diğer filtreler satır olarak eklenir. */}
          <div style={TARIH_KUTUSU_STILI}>
            <div style={{ marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px" }}>{t("tarihAraligi")}</Text>
            </div>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <FullDatePicker name1="cekmeceBaslangicTarihi" placeholder={t("baslangicTarihi")} style={{ width: "100%" }} />
              <Text style={{ fontSize: "14px" }}>-</Text>
              <FullDatePicker name1="cekmeceBitisTarihi" placeholder={t("bitisTarihi")} style={{ width: "100%" }} />
            </div>
          </div>

          {satirlar.map((satir) => (
            <Row key={satir.id} style={KUTU_STILI}>
              <Col span={24}>
                <Col span={24} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>{t("yeniFiltre")}</Text>
                  <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => satirSil(satir.id)} aria-label={t("temizle")} />
                </Col>
                <Col span={24}>
                  <Select
                    style={{ width: "100%", marginBottom: "10px" }}
                    showSearch
                    placeholder={t("secimYap")}
                    optionFilterProp="label"
                    value={satirAlanlari[satir.id] || undefined}
                    onChange={(alanAdi) => {
                      setSatirAlanlari((state) => ({ ...state, [satir.id]: alanAdi }));
                      setSatirDegerleri((state) => ({ ...state, [satir.id]: ID_TIPLERI.includes(alanBilgisi[alanAdi]?.tip) ? [] : "" }));
                    }}
                    options={kullanilabilirAlanlar(satir.id)}
                  />
                  {degerKontrolu(satir)}
                </Col>
              </Col>
            </Row>
          ))}

          <Button type="primary" onClick={satirEkle} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
            <PlusOutlined />
            {t("filtreEkle")}
          </Button>
        </FormProvider>
      </Drawer>
    </>
  );
}

FiltreCekmecesi.propTypes = {
  alanlar: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      tip: PropTypes.oneOf(["metin", "select", "lokasyon", "ekipman", "atolye"]),
      secenekler: PropTypes.array,
    })
  ).isRequired,
  baslangicFiltreleri: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
