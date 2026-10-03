import React from "react";
import PropTypes from "prop-types";
import KartModali from "./KartModali";
import ModalDugmeleri from "./ModalDugmeleri";

/** Onay penceresi (ör. silme). `onOnay` beklenirken dugmeler kilitlenir. */
export default function OnayModali({ acik, baslik, mesaj, onayMetni, tehlikeli = false, yukleniyor = false, onOnay, onKapat }) {
  return (
    <KartModali
      acik={acik}
      baslik={baslik}
      onKapat={onKapat}
      kapatilabilir={!yukleniyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={onOnay} kaydediliyor={yukleniyor} kaydetMetni={onayMetni} tehlikeli={tehlikeli} />}
    >
      <p className="m-0 text-sm leading-relaxed">{mesaj}</p>
    </KartModali>
  );
}

OnayModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  baslik: PropTypes.node.isRequired,
  mesaj: PropTypes.node.isRequired,
  onayMetni: PropTypes.node,
  tehlikeli: PropTypes.bool,
  yukleniyor: PropTypes.bool,
  onOnay: PropTypes.func.isRequired,
  onKapat: PropTypes.func.isRequired,
};
