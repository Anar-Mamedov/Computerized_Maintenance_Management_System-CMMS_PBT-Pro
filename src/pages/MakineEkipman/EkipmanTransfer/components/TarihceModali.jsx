import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Empty, Modal, Spin, Timeline, message } from "antd";
import { useTranslation } from "react-i18next";
import { GuzergahBandi } from "./Bilgi";
import { getTransferTarihcesi, hataMesaji } from "../transferService";

// Backend olay rengini ad olarak gonderir (blue, green, orange, gray); Timeline bunlari dogrudan kabul eder.
const OLAY_RENKLERI = ["blue", "green", "orange", "gray", "red", "purple"];

/** GetHistory olaylari (yeniden eskiye) zaman cizelgesi olarak gosterilir. */
export default function TarihceModali({ transferId, onKapat }) {
  const { t } = useTranslation();
  const [tarihce, setTarihce] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!transferId) {
      setTarihce(null);
      return undefined;
    }

    let iptal = false;
    setYukleniyor(true);
    getTransferTarihcesi(transferId)
      .then((yanit) => {
        if (!iptal) setTarihce(yanit.data);
      })
      .catch((hata) => {
        if (iptal) return;
        console.error("Transfer tarihçesi alınamadı:", hata);
        message.error(hataMesaji(hata));
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });

    return () => {
      iptal = true;
    };
  }, [transferId]);

  const olaylar = Array.isArray(tarihce?.events) ? tarihce.events : [];

  return (
    <Modal
      open={Boolean(transferId)}
      title={t("ekipmanTransfer.menu.transferTarihcesi")}
      width={560}
      centered
      destroyOnClose
      onCancel={onKapat}
      footer={<Button onClick={onKapat}>{t("ekipmanTransfer.kapat")}</Button>}
    >
      <Spin spinning={yukleniyor}>
        <div className="et-modal-govde">
          {tarihce && <GuzergahBandi transfer={tarihce} durumGoster />}
          {olaylar.length === 0 && !yukleniyor ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("ekipmanTransfer.tarihceBos")} />
          ) : (
            <Timeline
              className="et-zaman-cizelgesi"
              items={olaylar.map((olay, index) => ({
                key: `${olay.eventKey}-${index}`,
                color: OLAY_RENKLERI.includes(olay.color) ? olay.color : "gray",
                children: (
                  <div className="et-olay">
                    <strong>{t(`ekipmanTransfer.olay.${olay.eventKey}`, { defaultValue: olay.title })}</strong>
                    <span className="et-soluk">{olay.subtitle}</span>
                    {olay.details && <span>{olay.details}</span>}
                  </div>
                ),
              }))}
            />
          )}
        </div>
      </Spin>
    </Modal>
  );
}

TarihceModali.propTypes = {
  transferId: PropTypes.number,
  onKapat: PropTypes.func.isRequired,
};
