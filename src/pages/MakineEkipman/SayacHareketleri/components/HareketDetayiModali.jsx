import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Spin, message } from "antd";
import { useTranslation } from "react-i18next";
import { Artis, KaynakRozeti } from "./Hucreler";
import { getHareketDetayi, hataMesaji } from "../sayacHareketleriService";
import { sayiMetni } from "../yardimcilar";

/** Etiket + deger; bos deger "—" yazilir. */
function Alan({ etiket, children }) {
  const bos = children === null || children === undefined || children === "";
  return (
    <div className="sh-alan">
      <span className="sh-soluk sh-kucuk">{etiket}</span>
      <span className="sh-kalin">{bos ? "—" : children}</span>
    </div>
  );
}

Alan.propTypes = { etiket: PropTypes.node.isRequired, children: PropTypes.node };

/** Hareket Listesi satirina tiklaninca acilan salt okunur detay (GetMovementDetail). */
export default function HareketDetayiModali({ readingId, onKapat }) {
  const { t, i18n } = useTranslation();
  const [detay, setDetay] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!readingId) {
      setDetay(null);
      return undefined;
    }

    let iptal = false;
    setYukleniyor(true);
    getHareketDetayi(readingId)
      .then((yanit) => {
        if (!iptal) setDetay(yanit.data);
      })
      .catch((hata) => {
        if (iptal) return;
        console.error("Hareket detayı alınamadı:", hata);
        message.error(hataMesaji(hata));
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });

    return () => {
      iptal = true;
    };
  }, [readingId]);

  return (
    <Modal open={Boolean(readingId)} title={t("sayacHareketleri.detayBaslik")} width={560} centered destroyOnClose footer={null} onCancel={onKapat}>
      <Spin spinning={yukleniyor}>
        <div className="sh-detay">
          <Alan etiket={t("ekipmanKodu")}>{detay?.equipmentCode}</Alan>
          <Alan etiket={t("ekipmanTanimi")}>{detay?.equipmentName}</Alan>
          <Alan etiket={t("sayacHareketleri.kolon.ekipmanTipi")}>{detay?.equipmentType}</Alan>
          <Alan etiket={t("marka")}>{detay?.brand}</Alan>
          <Alan etiket={t("lokasyon")}>{detay?.locationName}</Alan>
          <Alan etiket={t("sayacHareketleri.sayacAdi")}>{detay?.counterName}</Alan>
          <Alan etiket={t("sayacHareketleri.sayacBirimi")}>{detay?.unit}</Alan>
          <Alan etiket={t("sayacHareketleri.kayitTarihi")}>{detay?.readingDateTimeFormatted}</Alan>
          <Alan etiket={t("sayacHareketleri.oncekiSayacDegeri")}>{detay && sayiMetni(detay.previousReadingValue, i18n.language)}</Alan>
          <Alan etiket={t("sayacHareketleri.okunanSayacDegeri")}>{detay && sayiMetni(detay.readingValue, i18n.language)}</Alan>
          <Alan etiket={t("sayacHareketleri.kolon.degisim")}>{detay && <Artis deger={detay.incrementValue} />}</Alan>
          <Alan etiket={t("sayacHareketleri.kolon.kayitKaynagi")}>{detay && <KaynakRozeti kaynak={detay.sourceType} />}</Alan>
          {detay?.description && (
            <div className="sh-tam-satir">
              <Alan etiket={t("sayacHareketleri.kolon.aciklama")}>{detay.description}</Alan>
            </div>
          )}
        </div>
      </Spin>
    </Modal>
  );
}

HareketDetayiModali.propTypes = {
  readingId: PropTypes.number,
  onKapat: PropTypes.func.isRequired,
};
