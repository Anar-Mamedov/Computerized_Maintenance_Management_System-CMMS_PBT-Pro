import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { LuCheck, LuFileText, LuHistory, LuPackageCheck, LuPencil, LuSend, LuTrash2, LuTruck } from "react-icons/lu";

/**
 * Menu bolumleri. Her ogenin aktifligi GetList / GetById yanitindaki `allowedActions` bayragina baglidir;
 * anahtarlar EkipmanTransfer.jsx'teki islem yonlendirmesinde kullanilir.
 */
const BOLUMLER = [
  {
    key: "bilgi",
    baslikKey: "ekipmanTransfer.menu.bilgiIslemleri",
    ogeler: [
      { key: "fis", Ikon: LuFileText, baslikKey: "ekipmanTransfer.menu.transferFisi", izin: "canViewSlip" },
      { key: "tarihce", Ikon: LuHistory, baslikKey: "ekipmanTransfer.menu.transferTarihcesi", izin: "canViewHistory" },
    ],
  },
  {
    key: "transfer",
    baslikKey: "ekipmanTransfer.menu.transferIslemleri",
    ogeler: [
      { key: "duzenle", Ikon: LuPencil, baslikKey: "duzenle", izin: "canEdit" },
      { key: "onayaGonder", Ikon: LuSend, baslikKey: "ekipmanTransfer.menu.onayaGonder", izin: "canSubmitForApproval" },
      { key: "onayla", Ikon: LuCheck, baslikKey: "ekipmanTransfer.menu.onayla", izin: "canApprove" },
      { key: "sevkiyat", Ikon: LuTruck, baslikKey: "ekipmanTransfer.menu.sevkiyataCikar", izin: "canDispatch" },
      { key: "teslimAl", Ikon: LuPackageCheck, baslikKey: "ekipmanTransfer.menu.teslimAl", izin: "canReceive" },
      { key: "sil", Ikon: LuTrash2, baslikKey: "sil", izin: "canDelete", tehlikeli: true },
    ],
  },
];

/** Tek bir transfer fisinin islem menusu. Tabloda sag tik (kontrollu), "..." dugmesinde tiklama (kontrolsuz) ile acilir. */
export default function IslemMenusu({ satir, tetikleyici, acik, onAcikDegistir, onIslem, children }) {
  const { t } = useTranslation();
  const kontrollu = acik !== undefined;

  const ogeler = BOLUMLER.map((bolum) => ({
    type: "group",
    key: bolum.key,
    label: t(bolum.baslikKey),
    children: bolum.ogeler.map(({ key, Ikon, baslikKey, izin, tehlikeli }) => ({
      key,
      icon: <Ikon size={15} />,
      label: t(baslikKey),
      danger: tehlikeli,
      disabled: satir?.allowedActions?.[izin] !== true,
    })),
  }));

  const tiklandi = ({ key }) => {
    if (satir) onIslem(key, satir);
    if (kontrollu) onAcikDegistir(false);
  };

  return (
    <Dropdown trigger={[tetikleyici]} overlayClassName="et-islem-menusu" menu={{ items: ogeler, onClick: tiklandi }} {...(kontrollu ? { open: acik, onOpenChange: onAcikDegistir } : {})}>
      {children}
    </Dropdown>
  );
}

IslemMenusu.propTypes = {
  satir: PropTypes.shape({ allowedActions: PropTypes.objectOf(PropTypes.bool) }),
  tetikleyici: PropTypes.oneOf(["click", "contextMenu"]).isRequired,
  acik: PropTypes.bool,
  onAcikDegistir: PropTypes.func,
  onIslem: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
