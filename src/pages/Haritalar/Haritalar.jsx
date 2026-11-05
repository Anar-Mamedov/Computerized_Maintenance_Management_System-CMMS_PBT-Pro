import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Space, Spin, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { LoadScript } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import { GetVehicleStatusService } from "./api/vehicleStatusService";
import { aracHareketliMi } from "./aracIsaretleri";
import AracHaritasi from "./components/AracHaritasi";
import AracIstatistikKartlari from "./components/AracIstatistikKartlari";

const { Title, Text } = Typography;

const sayfaStili = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const haritaKutusuStili = {
  width: "100%",
  flex: 1,
  minHeight: 260,
  borderRadius: 8,
  overflow: "hidden",
};

const ortalanmisStil = { height: "100%", display: "grid", placeItems: "center" };

// ATS Haritalar modülünün PBT/OMEGA uyarlaması (PBT-31).
// LoadScript sayfadan çıkınca Google Maps script'ini temizler. Başka bir ekran harita eklerse aynı yükleyiciyi kullanmalı:
// useJsApiLoader script'i sayfada bırakır, ardından açılan bir LoadScript "google api is already presented" deyip yüklenmez.
export default function Haritalar() {
  const { t } = useTranslation();
  const [araclar, setAraclar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState("");
  const [haritaYuklemeHatasi, setHaritaYuklemeHatasi] = useState(null);

  const haritaAnahtari = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const anahtarEksik = !haritaAnahtari;

  const istatistik = useMemo(() => {
    const hareketli = araclar.filter(aracHareketliMi).length;
    return { toplam: araclar.length, hareketli, park: araclar.length - hareketli };
  }, [araclar]);

  const araclariGetir = useCallback(async () => {
    if (anahtarEksik) return;

    setYukleniyor(true);
    setHataMesaji("");

    try {
      setAraclar(await GetVehicleStatusService());
    } catch (error) {
      setHataMesaji(error?.response?.data?.message || error?.message || t("haritalar.konumlarAlinamadi"));
    } finally {
      setYukleniyor(false);
    }
  }, [anahtarEksik, t]);

  useEffect(() => {
    araclariGetir();
  }, [araclariGetir]);

  const yuklemeGostergesi = (
    <div style={ortalanmisStil}>
      <Space direction="vertical" align="center">
        <Spin />
        <Text type="secondary">{t("haritalar.haritaYukleniyor")}</Text>
      </Space>
    </div>
  );

  return (
    <div style={sayfaStili}>
      <Space style={{ width: "100%", justifyContent: "space-between", flexShrink: 0 }} align="center">
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            {t("haritalar.baslik")}
          </Title>
          <Text type="secondary">{t("haritalar.aciklama")}</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={araclariGetir} loading={yukleniyor} disabled={anahtarEksik}>
          {t("yenile")}
        </Button>
      </Space>

      {hataMesaji && <Alert type="error" showIcon message={t("haritalar.konumlarAlinamadi")} description={hataMesaji} />}

      {haritaYuklemeHatasi && <Alert type="error" showIcon message={t("haritalar.googleYuklenemedi")} description={haritaYuklemeHatasi} />}

      <AracIstatistikKartlari toplam={istatistik.toplam} hareketli={istatistik.hareketli} park={istatistik.park} />

      <div style={haritaKutusuStili}>
        {anahtarEksik ? (
          <div style={ortalanmisStil}>
            <Alert type="warning" showIcon message={t("haritalar.anahtarEksikBaslik")} description={t("haritalar.anahtarEksikAciklama")} />
          </div>
        ) : (
          <LoadScript googleMapsApiKey={haritaAnahtari} loadingElement={yuklemeGostergesi} onError={(error) => setHaritaYuklemeHatasi(error?.message || t("haritalar.googleYuklenemedi"))}>
            <AracHaritasi araclar={araclar} />
          </LoadScript>
        )}
      </div>

      {!yukleniyor && !hataMesaji && !araclar.length && !anahtarEksik && <Alert type="info" showIcon message={t("haritalar.veriYok")} />}
    </div>
  );
}
