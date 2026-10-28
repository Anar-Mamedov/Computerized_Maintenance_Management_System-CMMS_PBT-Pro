import React from "react";
import PropTypes from "prop-types";
import { LuArrowRight } from "react-icons/lu";
import { TransferDurumRozeti } from "./Rozetler";

/** Soluk etiket + deger; bos deger "—" yazilir. */
export function BilgiAlani({ etiket, children }) {
  const bos = children === null || children === undefined || children === "";

  return (
    <div className="et-bilgi-alani">
      <span className="et-bilgi-etiket">{etiket}</span>
      <span className="et-bilgi-deger">{bos ? "—" : children}</span>
    </div>
  );
}

/**
 * Form alani etiketi; zorunlu alanlarda kirmizi yildiz gosterilir. `label` yerine `div` kullanilir:
 * icindeki LokasyonTablo / tarih seciciye tiklama etiket aktivasyonuyla baska girise kaymasin.
 */
export function FormAlani({ etiket, zorunlu = false, className = "", children }) {
  return (
    <div className={`et-form-alani ${className}`}>
      <span className="et-form-etiket">
        {etiket}
        {zorunlu && <span className="et-zorunlu">*</span>}
      </span>
      {children}
    </div>
  );
}

/** Modallarin ustundeki gri bant: fis no, kaynak -> hedef, (istege bagli) durum rozeti ve ek bilgi. */
export function GuzergahBandi({ transfer, durumGoster = false, children }) {
  return (
    <div className="et-guzergah-bandi">
      <strong>{transfer?.transferNo}</strong>
      <span className="et-guzergah">
        {transfer?.sourceLocationName}
        <LuArrowRight size={12} />
        {transfer?.targetLocationName}
      </span>
      {durumGoster && transfer && <TransferDurumRozeti statusKey={transfer.statusKey} statusText={transfer.statusText} />}
      {children}
    </div>
  );
}

BilgiAlani.propTypes = { etiket: PropTypes.node.isRequired, children: PropTypes.node };

FormAlani.propTypes = { etiket: PropTypes.node.isRequired, zorunlu: PropTypes.bool, className: PropTypes.string, children: PropTypes.node };

GuzergahBandi.propTypes = {
  transfer: PropTypes.shape({
    transferNo: PropTypes.string,
    sourceLocationName: PropTypes.string,
    targetLocationName: PropTypes.string,
    statusKey: PropTypes.string,
    statusText: PropTypes.string,
  }),
  durumGoster: PropTypes.bool,
  children: PropTypes.node,
};
