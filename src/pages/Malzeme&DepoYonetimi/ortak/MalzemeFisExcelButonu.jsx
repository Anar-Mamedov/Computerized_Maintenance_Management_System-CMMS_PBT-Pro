import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, message } from "antd";
import { SiMicrosoftexcel } from "react-icons/si";
import { t } from "i18next";
import AxiosInstance from "../../../api/http";
import { tabloyuExceleYaz } from "../../../utils/tabloExceli";

/**
 * Malzeme fişi ekranlarının (giriş / çıkış / transfer) Excel düğmesi.
 * GetMalzemeFis sayfalı çalıştığı için listeyle aynı gövde (MalzemeFisRequest) sayfalamasız GetMalzemeFisExcel'e
 * gönderilir; filtreye uyan tüm fişler tablodaki görünür kolonlarla yazılır.
 */
export default function MalzemeFisExcelButonu({ govde, kolonlar, dosyaAdi }) {
  const [yukleniyor, setYukleniyor] = useState(false);

  const indir = async () => {
    setYukleniyor(true);
    try {
      const yanit = await AxiosInstance.post("GetMalzemeFisExcel", govde);
      if (yanit?.has_error || !Array.isArray(yanit?.fis_listesi)) {
        message.error(t("hataOlustu"));
        return;
      }
      if (!yanit.fis_listesi.length) {
        message.warning(t("kayitBulunamadi"));
        return;
      }

      tabloyuExceleYaz({ satirlar: yanit.fis_listesi, kolonlar, dosyaAdi });
    } catch (error) {
      console.error("Malzeme fişi Excel'i alınamadı:", error);
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

MalzemeFisExcelButonu.propTypes = {
  govde: PropTypes.object.isRequired,
  kolonlar: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      dataIndex: PropTypes.string,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      render: PropTypes.func,
    })
  ).isRequired,
  dosyaAdi: PropTypes.string.isRequired,
};
