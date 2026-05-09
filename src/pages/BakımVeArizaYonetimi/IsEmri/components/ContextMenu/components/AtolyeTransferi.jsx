import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, message, Modal } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../api/http";
import AtolyeSelectbox from "../../../../../../utils/components/AtolyeSelectbox";
import MenuItem from "./MenuItem";

const FieldLabel = ({ children, required = false }) => (
  <div
    style={{
      fontSize: "14px",
      color: "#1F3251",
      marginBottom: "8px",
      fontWeight: 500,
    }}
  >
    {required && <span style={{ color: "#FF4D4F", marginRight: "4px" }}>*</span>}
    {children}
  </div>
);

export default function AtolyeTransferi({ selectedRows, refreshTableData, hidePopover }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const methods = useForm({
    defaultValues: {
      yeniAtolye: null,
      yeniAtolyeId: null,
      aciklama: "",
    },
  });

  const { handleSubmit, reset } = methods;
  const selectedRow = selectedRows?.[0];

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    reset({
      yeniAtolye: null,
      yeniAtolyeId: null,
      aciklama: "",
    });
  }, [isModalOpen, reset, selectedRow]);

  const closeModal = () => {
    setIsModalOpen(false);
    reset({
      yeniAtolye: null,
      yeniAtolyeId: null,
      aciklama: "",
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const body = {
      IsEmriId: selectedRow?.key,
      YeniAtolyeId: Number(data.yeniAtolyeId),
    };

    setSaving(true);

    try {
      const response = await AxiosInstance.post("IsEmriAtolyeTransfer", body);

      if (response.status_code === 200 || response.status_code === 201) {
        message.success(response.status || t("workOrder.workshopTransfer.success"));
        closeModal();
        hidePopover?.();
        refreshTableData?.();
      } else if (response.status_code === 401) {
        message.error(t("workOrder.workshopTransfer.noPermission"));
      } else {
        message.error(response.status || t("workOrder.workshopTransfer.error"));
      }
    } catch (error) {
      console.error("İş emri atölye transferi sırasında hata oluştu:", error);
      if (navigator.onLine) {
        message.error(error?.response?.data?.status || error?.response?.data?.message || t("workOrder.workshopTransfer.error"));
      } else {
        message.error(t("internetBaglantisiMevcutDegil"));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <MenuItem
        icon={<SwapOutlined />}
        title={t("workOrder.workshopTransfer.menuTitle")}
        description={t("workOrder.workshopTransfer.menuDescription")}
        onClick={openModal}
      />

      <Modal
        width={760}
        centered
        open={isModalOpen}
        onCancel={closeModal}
        title={
          <div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#1F3251", lineHeight: 1.25 }}>{t("workOrder.workshopTransfer.modalTitle")}</div>
            <div style={{ fontSize: "14px", color: "#60708A", marginTop: "8px" }}>
              {t("workOrder.workshopTransfer.selectedRecord", {
                no: selectedRow?.ISEMRI_NO ?? "-",
              })}
            </div>
          </div>
        }
        footer={[
          <Button key="cancel" onClick={closeModal}>
            {t("workOrder.workshopTransfer.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={saving}
            onClick={handleSubmit(onSubmit)}
            style={{ backgroundColor: "#18233A", borderColor: "#18233A" }}
          >
            {t("workOrder.workshopTransfer.submit")}
          </Button>,
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form layout="vertical" component={false}>
            <div
              style={{
                borderTop: "1px solid #E7EDF5",
                margin: "0 -24px",
                padding: "20px 24px 0",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <FieldLabel>{t("workOrder.workshopTransfer.currentWorkshop")}</FieldLabel>
                  <Input value={selectedRow?.ATOLYE || ""} readOnly />
                </div>
                <div>
                  <FieldLabel required>{t("workOrder.workshopTransfer.newWorkshop")}</FieldLabel>
                  <AtolyeSelectbox
                    fieldName="yeniAtolye"
                    fieldIdName="yeniAtolyeId"
                    fieldRequirements={{ yeniAtolye: true }}
                    selectStyle={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <FieldLabel>{t("workOrder.workshopTransfer.note")}</FieldLabel>
                <Input.TextArea
                  {...methods.register("aciklama")}
                  rows={5}
                  placeholder={t("workOrder.workshopTransfer.note")}
                  style={{ resize: "none" }}
                />
              </div>
            </div>
          </Form>
        </form>
      </Modal>
    </FormProvider>
  );
}

AtolyeTransferi.propTypes = {
  hidePopover: PropTypes.func,
  refreshTableData: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

FieldLabel.propTypes = {
  children: PropTypes.node,
  required: PropTypes.bool,
};
