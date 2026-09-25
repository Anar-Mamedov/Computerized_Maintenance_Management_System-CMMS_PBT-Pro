import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";

/** Tasarimdaki onay penceresi: soru + aciklama, Vazgec ve onay dugmeleri. */
export default function OnayModali({ acik, baslik, soru, aciklama, onayMetni, tehlikeli = false, yukleniyor = false, onOnay, onVazgec }) {
  const { t } = useTranslation();

  return (
    <Modal
      open={acik}
      centered
      width={520}
      rootClassName="ek-tokenlar"
      title={baslik}
      onCancel={onVazgec}
      maskClosable={!yukleniyor}
      closable={!yukleniyor}
      footer={[
        <Button key="vazgec" onClick={onVazgec} disabled={yukleniyor}>
          {t("vazgec")}
        </Button>,
        <Button key="onay" type="primary" danger={tehlikeli} loading={yukleniyor} onClick={onOnay}>
          {onayMetni}
        </Button>,
      ]}
    >
      <p className="m-0 text-[15px] font-medium">{soru}</p>
      {aciklama && <p className="m-0 mt-2 text-sm leading-relaxed text-(--ek-muted)">{aciklama}</p>}
    </Modal>
  );
}

OnayModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  baslik: PropTypes.string.isRequired,
  soru: PropTypes.string.isRequired,
  aciklama: PropTypes.string,
  onayMetni: PropTypes.string.isRequired,
  tehlikeli: PropTypes.bool,
  yukleniyor: PropTypes.bool,
  onOnay: PropTypes.func.isRequired,
  onVazgec: PropTypes.func.isRequired,
};
