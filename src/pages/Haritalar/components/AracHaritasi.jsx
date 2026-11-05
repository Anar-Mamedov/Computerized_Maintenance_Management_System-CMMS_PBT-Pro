import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Space, Typography } from "antd";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import LocalizedDateText from "../../../utils/components/LocalizedDateText";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import { aracHareketliMi, pinIkonlariniOlustur } from "../aracIsaretleri";

const { Text } = Typography;

const TURKIYE_MERKEZI = { lat: 39.0, lng: 35.0 };
const haritaStili = { width: "100%", height: "100%" };
const haritaAyarlari = { fullscreenControl: false };

// LoadScript'in içinde render edilir; Google Maps script'i yüklenmeden çağrılmaz.
export default function AracHaritasi({ araclar }) {
  const { t, i18n } = useTranslation();
  const [aktifAracId, setAktifAracId] = useState(null);

  const pinIkonlari = useMemo(() => pinIkonlariniOlustur(), []);

  const merkez = useMemo(() => {
    if (!araclar.length) return TURKIYE_MERKEZI;
    return { lat: araclar[0].latitude, lng: araclar[0].longitude };
  }, [araclar]);

  return (
    <GoogleMap mapContainerStyle={haritaStili} center={merkez} zoom={6} options={haritaAyarlari}>
      {araclar.map((arac) => (
        <MarkerF
          key={arac.id}
          position={{ lat: arac.latitude, lng: arac.longitude }}
          icon={aracHareketliMi(arac) ? pinIkonlari.hareketli : pinIkonlari.park}
          onMouseOver={() => setAktifAracId(arac.id)}
          onMouseOut={() => setAktifAracId((onceki) => (onceki === arac.id ? null : onceki))}
        >
          {aktifAracId === arac.id && (
            <InfoWindowF onCloseClick={() => setAktifAracId(null)}>
              <Space direction="vertical" size={2}>
                <Text strong>{`${t("haritalar.cihazNo")}: ${arac.deviceNo || "-"}`}</Text>
                <Text>{`${t("haritalar.hiz")}: ${formatNumberWithSeparators(arac.speed, i18n.language)}`}</Text>
                <Text>{`${t("haritalar.adres")}: ${arac.address}`}</Text>
                {arac.utcDateTime && (
                  <Text>
                    {t("tarih")}: <LocalizedDateText value={arac.utcDateTime} dateFormat="L LTS" />
                  </Text>
                )}
              </Space>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  );
}

AracHaritasi.propTypes = {
  araclar: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      deviceNo: PropTypes.string,
      address: PropTypes.string,
      speed: PropTypes.number,
      utcDateTime: PropTypes.string,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    })
  ).isRequired,
};
