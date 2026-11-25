import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import LocalizedDateText from "../../../../utils/components/LocalizedDateText";

/** Analiz modallarinin ortak cercevesi: baslik, alt baslik ve sag ustte yanittaki tarih araligi. */
export default function AnalizModali({ acik, baslik, altBaslik, baslangic, bitis, onKapat, children }) {
  return (
    <Modal
      open={acik}
      onCancel={onKapat}
      footer={null}
      width={1180}
      centered
      destroyOnClose
      wrapClassName="ya-tokenlar"
      title={
        <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
          <div>
            <div className="text-[15px] font-semibold">{baslik}</div>
            <div className="text-[12px] font-normal text-(--ya-muted)">{altBaslik}</div>
          </div>
          {baslangic && (
            <span className="ya-rozet ya-rozet--notr">
              <LocalizedDateText value={baslangic} /> – <LocalizedDateText value={bitis} />
            </span>
          )}
        </div>
      }
    >
      {children}
    </Modal>
  );
}

AnalizModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  baslik: PropTypes.string.isRequired,
  altBaslik: PropTypes.string.isRequired,
  baslangic: PropTypes.string,
  bitis: PropTypes.string,
  onKapat: PropTypes.func.isRequired,
  children: PropTypes.node,
};

/** Onceki doneme gore fark yonu: FarkRozeti renkleri icin (dusus yesil, artis turuncu / kirmizi). */
export const farkYonu = (yuzde) => (Number(yuzde) < 0 ? "down" : Number(yuzde) > 0 ? "up" : "flat");
