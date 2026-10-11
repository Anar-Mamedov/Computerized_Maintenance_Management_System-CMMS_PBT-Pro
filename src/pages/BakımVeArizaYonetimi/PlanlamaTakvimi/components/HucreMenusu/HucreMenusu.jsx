import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { LuCalendarPlus, LuClipboardList, LuPackage, LuXCircle } from "react-icons/lu";
import IsEmriOlusturModali from "../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/components/periyodikBakim/IsEmriOlusturModali";
import IleriTarihePlanlaModali from "../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/components/periyodikBakim/IleriTarihePlanlaModali";
import BakimIptalModali from "../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/components/periyodikBakim/BakimIptalModali";
import "../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/ekipmanKarti.css";
import "./hucreMenusu.css";

const MenuMetni = ({ baslik, aciklama }) => (
  <div>
    <div className="ptk-hucre-menusu__baslik">{baslik}</div>
    <div className="ptk-hucre-menusu__aciklama">{aciklama}</div>
  </div>
);

MenuMetni.propTypes = {
  baslik: PropTypes.string.isRequired,
  aciklama: PropTypes.string.isRequired,
};

/** Planlama takviminde bakim hucresine sag tiklayinca acilan menu ve menuden acilan islem pencereleri. */
export default function HucreMenusu({ hucre, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [modal, setModal] = useState(null);

  const items = [
    {
      key: "isEmri",
      icon: <LuClipboardList size={16} />,
      label: <MenuMetni baslik={t("planlamaTakvimi.menu.isEmriOlustur")} aciklama={t("planlamaTakvimi.menu.isEmriOlusturAciklama")} />,
    },
    {
      key: "planla",
      icon: <LuCalendarPlus size={16} />,
      label: <MenuMetni baslik={t("planlamaTakvimi.menu.ileriTarihePlanla")} aciklama={t("planlamaTakvimi.menu.ileriTarihePlanlaAciklama")} />,
    },
    {
      // Bakimdan malzeme talebi olusturan API henuz yok.
      key: "malzeme",
      disabled: true,
      icon: <LuPackage size={16} />,
      label: <MenuMetni baslik={t("planlamaTakvimi.menu.malzemeIhtiyaci")} aciklama={t("planlamaTakvimi.menu.malzemeIhtiyaciAciklama")} />,
    },
    { type: "divider" },
    {
      key: "iptal",
      danger: true,
      icon: <LuXCircle size={16} />,
      label: <MenuMetni baslik={t("planlamaTakvimi.menu.bakimIptal")} aciklama={t("planlamaTakvimi.menu.bakimIptalAciklama")} />,
    },
  ];

  const menuTiklandi = ({ key }) => {
    setModal({ tur: key, hucre });
    onKapat();
  };

  const modalKapat = () => setModal(null);

  const islemTamamlandi = () => {
    setModal(null);
    onTamamlandi();
  };

  const renderModal = () => {
    if (!modal) return null;

    const kayit = {
      TB_PERIYODIK_BAKIM_ID: Number(modal.hucre.bakimId),
      PBK_TANIM: modal.hucre.bakimTanim,
      HEDEF_TARIH: modal.hucre.tarih,
    };
    const ortak = { makineId: Number(modal.hucre.makineId), onKapat: modalKapat, onTamamlandi: islemTamamlandi };

    switch (modal.tur) {
      case "isEmri":
        return <IsEmriOlusturModali {...ortak} kayit={kayit} />;
      case "planla":
        return <IleriTarihePlanlaModali {...ortak} kayitlar={[kayit]} />;
      case "iptal":
        return <BakimIptalModali {...ortak} kayitlar={[kayit]} />;
      default:
        return null;
    }
  };

  return (
    <>
      {hucre && (
        <Dropdown
          key={`${hucre.x}-${hucre.y}`}
          open
          trigger={["contextMenu"]}
          onOpenChange={(acik) => !acik && onKapat()}
          menu={{ items, onClick: menuTiklandi }}
          overlayClassName="ptk-hucre-menusu"
        >
          <div style={{ position: "fixed", left: hucre.x, top: hucre.y, width: 1, height: 1 }} />
        </Dropdown>
      )}
      {renderModal()}
    </>
  );
}

HucreMenusu.propTypes = {
  /** { x, y, makineId, bakimId, bakimTanim, tarih (YYYY-MM-DD) } */
  hucre: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    makineId: PropTypes.string.isRequired,
    bakimId: PropTypes.string.isRequired,
    bakimTanim: PropTypes.string,
    tarih: PropTypes.string.isRequired,
  }),
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
