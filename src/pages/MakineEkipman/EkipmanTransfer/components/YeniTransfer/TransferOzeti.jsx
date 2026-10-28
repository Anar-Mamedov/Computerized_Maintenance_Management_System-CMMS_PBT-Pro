import React from "react";
import PropTypes from "prop-types";
import { Alert } from "antd";
import { useTranslation } from "react-i18next";
import { BilgiAlani } from "../Bilgi";
import EkipmanTablosu from "../EkipmanTablosu";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

/** 3. adim: Create / Update yanitindaki fis ozeti; aktif olmayan ekipman varsa uyari bandi gosterilir. */
export default function TransferOzeti({ ozet }) {
  const { t, i18n } = useTranslation();
  const satirlar = ozet.equipments ?? [];
  const pasifSayisi = Number(ozet.nonActiveEquipmentCount) || 0;

  return (
    <div className="et-modal-govde">
      {ozet.hasWarning && (
        <Alert
          type="warning"
          showIcon
          message={pasifSayisi > 0 ? t("ekipmanTransfer.pasifEkipmanUyarisi", { sayi: formatNumberWithSeparators(pasifSayisi, i18n.language) }) : ozet.warningMessage}
        />
      )}
      <div className="et-ozet">
        <div className="et-bilgi-kutusu et-ozet-bilgileri">
          <BilgiAlani etiket={t("ekipmanTransfer.transferNo")}>{ozet.transferNo}</BilgiAlani>
          <BilgiAlani etiket={t("ekipmanTransfer.planlananTarih")}>{ozet.plannedDateFormatted}</BilgiAlani>
          <BilgiAlani etiket={t("ekipmanTransfer.kaynakSantiye")}>{ozet.sourceLocationName}</BilgiAlani>
          <BilgiAlani etiket={t("ekipmanTransfer.hedefSantiye")}>{ozet.targetLocationName}</BilgiAlani>
          <BilgiAlani etiket={t("ekipmanTransfer.ekipmanSayisi")}>{formatNumberWithSeparators(ozet.equipmentCount ?? satirlar.length, i18n.language)}</BilgiAlani>
          <BilgiAlani etiket={t("ekipmanTransfer.transferNedeni")}>{ozet.transferReason}</BilgiAlani>
          <BilgiAlani etiket={t("ekipmanTransfer.aciklama")}>{ozet.description}</BilgiAlani>
        </div>
        <div className="et-ozet-tablosu">
          <EkipmanTablosu satirlar={satirlar} scrollY={330} />
        </div>
      </div>
    </div>
  );
}

TransferOzeti.propTypes = {
  ozet: PropTypes.shape({
    transferNo: PropTypes.string,
    plannedDateFormatted: PropTypes.string,
    sourceLocationName: PropTypes.string,
    targetLocationName: PropTypes.string,
    equipmentCount: PropTypes.number,
    transferReason: PropTypes.string,
    description: PropTypes.string,
    hasWarning: PropTypes.bool,
    warningMessage: PropTypes.string,
    nonActiveEquipmentCount: PropTypes.number,
    equipments: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
