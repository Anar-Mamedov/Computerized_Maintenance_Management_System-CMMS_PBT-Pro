import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";
import SecimBilgisi from "./SecimBilgisi";
import useTemaDegiskenleri from "../../useTemaDegiskenleri";

/** Toplu islem modallarinin ortak kabugu: aciklama, secim bilgisi, form ve Vazgec/Kaydet dugmeleri. */
export default function IslemModali({ baslik, aciklama, genislik = 600, seciliAdet, secimAciklamasi, kaydetMetni, yukleniyor, onKaydet, onKapat, children }) {
  const { t } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();

  return (
    <Modal
      open
      centered
      width={genislik}
      rootClassName="ek-tokenlar"
      title={baslik}
      onCancel={onKapat}
      maskClosable={!yukleniyor}
      closable={!yukleniyor}
      footer={[
        <Button key="vazgec" onClick={onKapat} disabled={yukleniyor}>
          {t("vazgec")}
        </Button>,
        <Button key="kaydet" type="primary" loading={yukleniyor} onClick={onKaydet}>
          {kaydetMetni}
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-4" style={temaDegiskenleri}>
        <p className="m-0 text-sm text-(--ek-muted)">{aciklama}</p>
        {seciliAdet !== undefined && <SecimBilgisi adet={seciliAdet} aciklama={secimAciklamasi} />}
        {children}
      </div>
    </Modal>
  );
}

IslemModali.propTypes = {
  baslik: PropTypes.string.isRequired,
  aciklama: PropTypes.string.isRequired,
  genislik: PropTypes.number,
  seciliAdet: PropTypes.number,
  secimAciklamasi: PropTypes.string,
  kaydetMetni: PropTypes.string.isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  onKaydet: PropTypes.func.isRequired,
  onKapat: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

/** Form alani: etiket (zorunluysa kirmizi yildiz) ve altinda kontrol. */
export function FormAlani({ etiket, zorunlu = false, className = "", children }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium">
        {etiket}
        {zorunlu && <span className="text-[#c90000]"> *</span>}
      </span>
      {children}
    </div>
  );
}

FormAlani.propTypes = {
  etiket: PropTypes.string.isRequired,
  zorunlu: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
