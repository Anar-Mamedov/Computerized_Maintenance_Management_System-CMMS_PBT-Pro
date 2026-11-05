import React from "react";
import PropTypes from "prop-types";
import { Space, Typography } from "antd";
import { AimOutlined, CarOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";

const { Text } = Typography;

const satirStili = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  flexShrink: 0,
};

const kartStili = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: "10px 14px",
  flex: "1 1 260px",
  minHeight: 100,
};

const ikonKutusuStili = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  display: "grid",
  placeItems: "center",
  color: "#6b7280",
  fontSize: 16,
  background: "#f9fafb",
};

export default function AracIstatistikKartlari({ toplam, hareketli, park }) {
  const { t, i18n } = useTranslation();

  const kartlar = [
    { key: "toplam", baslik: t("haritalar.toplamBaslik"), altBaslik: t("haritalar.toplamAltBaslik"), deger: toplam, ikon: <CarOutlined /> },
    { key: "hareketli", baslik: t("haritalar.hareketliBaslik"), altBaslik: t("haritalar.hareketliAltBaslik"), deger: hareketli, ikon: <AimOutlined /> },
    { key: "park", baslik: t("haritalar.parkBaslik"), altBaslik: t("haritalar.parkAltBaslik"), deger: park, ikon: <PauseCircleOutlined /> },
  ];

  return (
    <div style={satirStili}>
      {kartlar.map((kart) => (
        <div key={kart.key} style={kartStili}>
          <Space direction="vertical" size={5} style={{ width: "100%" }}>
            <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 13, color: "#5d6786", fontWeight: 500 }}>{kart.baslik}</Text>
              <div style={ikonKutusuStili}>{kart.ikon}</div>
            </Space>

            <Text strong style={{ fontSize: 30, lineHeight: 1.05, color: "#141414" }}>
              {formatNumberWithSeparators(kart.deger, i18n.language)}
            </Text>

            <Text type="secondary" style={{ fontSize: 11, lineHeight: "16px" }}>
              {kart.altBaslik}
            </Text>
          </Space>
        </div>
      ))}
    </div>
  );
}

AracIstatistikKartlari.propTypes = {
  toplam: PropTypes.number.isRequired,
  hareketli: PropTypes.number.isRequired,
  park: PropTypes.number.isRequired,
};
