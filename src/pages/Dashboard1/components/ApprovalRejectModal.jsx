import React from "react";
import PropTypes from "prop-types";
import { Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { COLORS } from "./theme";

/**
 * Reddetme gerekçesinin girildiği modal.
 * Açıklama zorunludur; `onConfirm` yalnızca geçerli bir gerekçeyle çağrılır.
 */
export default function ApprovalRejectModal({ open, record, onCancel, onConfirm }) {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm({ defaultValues: { reddetAciklama: "" } });

  const kapat = () => {
    reset();
    onCancel();
  };

  const gonder = ({ reddetAciklama }) => {
    reset();
    onConfirm(reddetAciklama);
  };

  return (
    <Modal title={t("reddetmeIslemi")} open={open} onCancel={kapat} onOk={handleSubmit(gonder)} okText={t("reddet")} okButtonProps={{ danger: true }} cancelText={t("vazgec")} destroyOnClose>
      {record ? <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>{[record.ONAY_TABLO_KOD, record.ONY_TANIM].filter(Boolean).join(" · ")}</div> : null}
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{t("aciklama")}</div>
      <Controller
        name="reddetAciklama"
        control={control}
        rules={{ required: t("alanBosBirakilamaz") }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Input.TextArea {...field} rows={4} status={error ? "error" : ""} />
            {error ? <div style={{ color: COLORS.red, marginTop: 5 }}>{error.message}</div> : null}
          </div>
        )}
      />
    </Modal>
  );
}

ApprovalRejectModal.propTypes = {
  open: PropTypes.bool,
  record: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
