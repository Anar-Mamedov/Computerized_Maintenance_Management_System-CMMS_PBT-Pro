import React, { useState } from "react";
import { Modal, message, Typography } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../api/http";
import PeriyodikBakimIptalForm from "./PeriyodikBakimIptalForm.jsx";

const { Text } = Typography;

export default function PeriyodikBakimIptal({ selectedRows, refreshTableData, hidePopover, makineId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      iptalNedeniID: null,
      iptalNedeni: null,
      aciklama: "",
    },
  });
  const { reset } = methods;

  const handleSubmit = async (data) => {
    const row = selectedRows?.[0];
    if (!row) return;

    const resolvedMakineId = makineId ?? row?.TB_PERIYODIK_BAKIM_MAKINE_ID;
    if (!resolvedMakineId || !row?.TB_PERIYODIK_BAKIM_ID || !row?.HEDEF_TARIH) {
      message.error(t("hataliVeri", { defaultValue: "Eksik veri bulundu." }));
      return;
    }

    const body = {
      PBM_MAKINE_ID: resolvedMakineId,
      PBM_PERIYODIK_BAKIM_ID: row.TB_PERIYODIK_BAKIM_ID,
      PBM_HEDEF_TARIH: row.HEDEF_TARIH,
      PBI_IPTAL_NEDEN_KOD_ID: Number(data.iptalNedeniID),
      PBI_ACIKLAMA: data.aciklama,
    };

    try {
      const response = await AxiosInstance.post("PBakimMakineIptal", body);
      if (response?.status_code === 200 || response?.status_code === 201) {
        message.success(response?.message || t("islemBasarili", { defaultValue: "İşlem başarılı." }));
        refreshTableData?.();
        hidePopover?.();
        setIsModalOpen(false);
        reset();
      } else {
        message.error(response?.message || t("islemBasarisiz", { defaultValue: "İşlem başarısız." }));
      }
    } catch (error) {
      console.error("PBakimMakineIptal error:", error);
      message.error(t("islemBasarisiz", { defaultValue: "İşlem başarısız." }));
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      reset();
    }
  };

  return (
    <FormProvider {...methods}>
      <div>
        <Text style={{ cursor: "pointer", color: "#ff4d4f" }} onClick={handleModalToggle}>
          {t("iptal")}
        </Text>
        <Modal
          title={t("iptal")}
          open={isModalOpen}
          onOk={methods.handleSubmit(handleSubmit)}
          onCancel={handleModalToggle}
          destroyOnClose
        >
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <PeriyodikBakimIptalForm selectedRow={selectedRows?.[0]} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
