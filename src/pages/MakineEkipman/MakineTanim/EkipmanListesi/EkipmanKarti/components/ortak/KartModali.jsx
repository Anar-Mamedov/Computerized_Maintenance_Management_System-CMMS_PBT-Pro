import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { LuX } from "react-icons/lu";
import useTemaDegiskenleri from "../../../useTemaDegiskenleri";

const MASKE_STILI = { backgroundColor: "rgba(16, 24, 40, 0.25)" };

/** Tasarimdaki modal kabugu: baslik + alt baslik + kapat dugmesi, kayan govde ve sag alttaki dugmeler. */
export default function KartModali({ acik, baslik, altBaslik, genislik = 560, onKapat, altBilgi, kapatilabilir = true, govdeSinifi = "", children }) {
  const { t } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();

  return (
    <Modal
      open={acik}
      centered
      destroyOnClose
      width={genislik}
      title={null}
      footer={null}
      closable={false}
      maskClosable={kapatilabilir}
      keyboard={kapatilabilir}
      onCancel={onKapat}
      rootClassName="ek-sicil ek-kart-modal"
      styles={{ mask: MASKE_STILI, content: temaDegiskenleri }}
    >
      <header className="ek-kart-modal__baslik">
        <div className="min-w-0">
          <h2>{baslik}</h2>
          {altBaslik && <p>{altBaslik}</p>}
        </div>
        <button type="button" className="ek-kart-ikon-btn" aria-label={t("ekipmanKarti.kapat")} onClick={onKapat} disabled={!kapatilabilir}>
          <LuX size={16} />
        </button>
      </header>
      <div className={`ek-kart-modal__govde ${govdeSinifi}`}>{children}</div>
      {altBilgi && <footer className="ek-kart-modal__alt">{altBilgi}</footer>}
    </Modal>
  );
}

KartModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  baslik: PropTypes.node.isRequired,
  altBaslik: PropTypes.node,
  genislik: PropTypes.number,
  onKapat: PropTypes.func.isRequired,
  altBilgi: PropTypes.node,
  kapatilabilir: PropTypes.bool,
  govdeSinifi: PropTypes.string,
  children: PropTypes.node,
};
