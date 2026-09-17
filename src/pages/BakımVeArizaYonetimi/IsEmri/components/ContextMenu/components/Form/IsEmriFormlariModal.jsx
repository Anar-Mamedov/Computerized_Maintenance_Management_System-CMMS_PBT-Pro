import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, message, Modal } from "antd";
import { FileTextOutlined, ScheduleOutlined, WarningOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getReportUrl } from "./reportService";

// formId değerleri backend tarafında sabittir, değiştirilmemelidir.
// (formId=9 Malzeme Barkod Etiketi'dir ve bu modalda gösterilmez.)
const FORM_OPTIONS = [
  { formId: 1, labelKey: "workOrder.forms.workOrderForm", icon: <FileTextOutlined /> },
  { formId: 20, labelKey: "workOrder.forms.faultForm", icon: <WarningOutlined /> },
  { formId: 27, labelKey: "workOrder.forms.periodicMaintenanceForm", icon: <ScheduleOutlined /> },
];

export default function IsEmriFormlariModal({ open, onClose, isEmriId, isEmriNo }) {
  const { t } = useTranslation();
  const [loadingFormId, setLoadingFormId] = useState(null);
  const requestInFlightRef = useRef(false);

  const modalSubtitle = useMemo(
    () =>
      t("workOrder.forms.selectedRecord", {
        no: isEmriNo ?? "-",
      }),
    [isEmriNo, t]
  );

  const handleFormClick = async (formId) => {
    // Aynı seçeneğe art arda tıklanınca ikinci bir istek gönderilmesini engelle.
    if (requestInFlightRef.current) {
      return;
    }

    if (!isEmriId) {
      message.error(t("workOrder.forms.noSelection"));
      return;
    }

    // Popup engelleyicisine takılmamak için boş sekme tıklama anında senkron açılır.
    // Features parametresine "noopener" verilirse tarayıcı null döndüreceği için,
    // sekme referansı korunur ve `opener` bağlantısı hemen ardından koparılır.
    const reportWindow = window.open("", "_blank");
    if (reportWindow) {
      reportWindow.opener = null;
    }

    requestInFlightRef.current = true;
    setLoadingFormId(formId);

    try {
      const data = await getReportUrl(formId, isEmriId);
      const reportUrl = typeof data?.url === "string" ? data.url.trim() : "";

      if (data?.success === true && reportUrl) {
        if (reportWindow) {
          reportWindow.opener = null;
          reportWindow.location.href = reportUrl;
        } else {
          message.error(t("workOrder.forms.popupBlocked"));
        }
        return;
      }

      reportWindow?.close();
      message.error(t("workOrder.forms.error"));
    } catch (error) {
      console.error("İş emri form bağlantısı alınırken hata oluştu:", error);
      reportWindow?.close();
      message.error(error?.response?.data?.status || error?.response?.data?.message || t("workOrder.forms.error"));
    } finally {
      requestInFlightRef.current = false;
      setLoadingFormId(null);
    }
  };

  return (
    <Modal
      width={560}
      centered
      open={open}
      onCancel={onClose}
      title={
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#1F3251", lineHeight: 1.25 }}>{t("workOrder.forms.modalTitle")}</div>
          <div style={{ fontSize: "14px", color: "#60708A", marginTop: "8px" }}>{modalSubtitle}</div>
        </div>
      }
      footer={
        <Button onClick={onClose} style={{ minWidth: 84 }}>
          {t("workOrder.forms.close")}
        </Button>
      }
    >
      <div
        style={{
          borderTop: "1px solid #E7EDF5",
          margin: "0 -24px",
          padding: "18px 24px 0",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {FORM_OPTIONS.map((option) => (
          <Button
            key={option.formId}
            block
            size="large"
            icon={option.icon}
            loading={loadingFormId === option.formId}
            disabled={loadingFormId !== null && loadingFormId !== option.formId}
            onClick={() => handleFormClick(option.formId)}
            style={{
              height: "auto",
              minHeight: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "1px solid #D9E5F2",
              textAlign: "left",
              whiteSpace: "normal",
            }}
          >
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.35, minWidth: 0 }}>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#1F3251" }}>{t(option.labelKey)}</span>
              <span style={{ fontSize: "12.5px", fontWeight: 400, color: "#60708A" }}>{t("workOrder.forms.openHint")}</span>
            </span>
          </Button>
        ))}
      </div>
    </Modal>
  );
}

IsEmriFormlariModal.propTypes = {
  isEmriId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isEmriNo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
