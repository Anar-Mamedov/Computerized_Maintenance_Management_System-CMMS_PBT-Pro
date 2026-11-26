import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, message } from "antd";
import { SiMicrosoftexcel } from "react-icons/si";
import { t } from "i18next";
import AxiosInstance from "../../../../api/http";
import { tabloyuExceleYaz, varsayilanHucreDegeri } from "../../../../utils/tabloExceli";

// Tabloda ikonla gösterilen aktiflik Excel'e metin olarak yazılır.
const hucreDegeri = (kolon, satir) => {
  if (kolon.dataIndex === "PBK_AKTIF") return satir.PBK_AKTIF ? t("aktif") : t("pasif");
  return varsayilanHucreDegeri(kolon, satir);
};

/**
 * Periyodik Bakım Tanımları Excel düğmesi. GetPBakimTanimListExcel listeyle aynı filtre ve sıralama parametrelerini
 * alır, sayfalama olmadan eşleşen tüm tanımları düz dizi olarak döndürür; tablodaki görünür kolonlarla yazılır.
 */
export default function PeriyodikBakimExcelButonu({ sorguParametreleri, kolonlar }) {
  const [yukleniyor, setYukleniyor] = useState(false);

  const indir = async () => {
    setYukleniyor(true);
    try {
      const yanit = await AxiosInstance.get(`GetPBakimTanimListExcel?${sorguParametreleri}`);
      if (!Array.isArray(yanit)) {
        message.error(t("hataOlustu"));
        return;
      }
      if (!yanit.length) {
        message.warning(t("kayitBulunamadi"));
        return;
      }

      tabloyuExceleYaz({ satirlar: yanit, kolonlar, dosyaAdi: "periyodik_bakim_tanimlari", hucreDegeri });
    } catch (error) {
      console.error("Periyodik bakım Excel'i alınamadı:", error);
      message.error(t("hataOlustu"));
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <Button style={{ display: "flex", alignItems: "center" }} onClick={indir} loading={yukleniyor} icon={<SiMicrosoftexcel />}>
      {t("indir")}
    </Button>
  );
}

PeriyodikBakimExcelButonu.propTypes = {
  sorguParametreleri: PropTypes.string.isRequired,
  kolonlar: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      dataIndex: PropTypes.string,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      render: PropTypes.func,
    })
  ).isRequired,
};
