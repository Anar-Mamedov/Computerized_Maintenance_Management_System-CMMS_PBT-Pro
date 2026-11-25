import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import { hataMetni } from "../../ortak/yakitApi";
import { deleteYakitStokIslem } from "../yakitStokIslemService";

/** "Kaydi Sil" onayi; secili fislerin TB_STOK_FIS_ID'leri DeleteYakitStokIslem'e gider (tekli ya da coklu). */
export default function SilmeOnayModali({ ids, onKapat, onSilindi }) {
  const { t } = useTranslation();
  const [siliniyor, setSiliniyor] = useState(false);

  const sil = async () => {
    setSiliniyor(true);
    try {
      const yanit = await deleteYakitStokIslem(ids);
      message.success(yanit?.status || t("islemBasarili"));
      onSilindi();
      onKapat();
    } catch (error) {
      message.error(hataMetni(error, t));
    } finally {
      setSiliniyor(false);
    }
  };

  return (
    <Modal
      open={ids.length > 0}
      title={t("yakitStokIslemleri.sil.baslik")}
      onCancel={onKapat}
      centered
      width={460}
      footer={[
        <Button key="vazgec" onClick={onKapat}>
          {t("vazgec")}
        </Button>,
        <Button key="sil" type="primary" danger loading={siliniyor} onClick={sil}>
          {t("sil")}
        </Button>,
      ]}
    >
      <p className="m-0">{ids.length > 1 ? t("yakitStokIslemleri.sil.cokluOnay", { adet: ids.length }) : t("yakitStokIslemleri.sil.onay")}</p>
    </Modal>
  );
}

SilmeOnayModali.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  onKapat: PropTypes.func.isRequired,
  onSilindi: PropTypes.func.isRequired,
};
