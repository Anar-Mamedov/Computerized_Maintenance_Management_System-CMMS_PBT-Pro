import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../api/http";
import IleriTarihePlanlaForm from "./IleriTarihePlanlaForm.jsx";

export default function IleriTarihePlanla({ selectedRows, refreshTableData, hidePopover, makineId, icon, iconColor, title, description }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDisabled = !selectedRows?.length;
  const resolvedTitle = title || t("ileriTarihePlanla", { defaultValue: "İleri Tarihe Planla" });
  const resolvedDescription =
    description || t("ileriTarihePlanlaAciklama", { defaultValue: "Seçili bakımın hedef tarihini ileri alın." });
  const methods = useForm({
    defaultValues: {
      hedefTarihi: null,
      planlamaNedeniID: null,
      planlamaNedeni: null,
      aciklama: "",
    },
  });
  const { setValue, reset } = methods;

  useEffect(() => {
    if (isModalOpen && selectedRows?.length) {
      const item = selectedRows[0];
      setValue("hedefTarihi", item?.HEDEF_TARIH ? (dayjs(item.HEDEF_TARIH).isValid() ? dayjs(item.HEDEF_TARIH) : null) : null);
    }
  }, [isModalOpen, selectedRows, setValue]);

  const handleSubmit = async (data) => {
    const row = selectedRows?.[0];
    if (!row) return;

    const resolvedMakineId = makineId ?? row?.TB_PERIYODIK_BAKIM_MAKINE_ID;
    if (!resolvedMakineId || !row?.TB_PERIYODIK_BAKIM_ID) {
      message.error(t("hataliVeri", { defaultValue: "Eksik veri bulundu." }));
      return;
    }

    const body = {
      PBM_MAKINE_ID: resolvedMakineId,
      PBM_PERIYODIK_BAKIM_ID: row.TB_PERIYODIK_BAKIM_ID,
      PBM_HEDEF_TARIH: data.hedefTarihi ? dayjs(data.hedefTarihi).format("YYYY-MM-DD") : null,
      PBI_IPTAL_NEDEN_KOD_ID: Number(data.planlamaNedeniID),
      PBI_ACIKLAMA: data.aciklama,
    };

    try {
      const response = await AxiosInstance.post("PBakimMakineIleriTarihePlanla", body);
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
      console.error("PBakimMakineIleriTarihePlanla error:", error);
      message.error(t("islemBasarisiz", { defaultValue: "İşlem başarısız." }));
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      hidePopover?.();
      reset();
    }
  };

  return (
    <FormProvider {...methods}>
      <div style={isDisabled ? { display: "none" } : {}}>
        <div
          className="menu-item-hover"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            cursor: "pointer",
            padding: "10px 12px",
            transition: "background-color 0.3s",
            width: "100%",
          }}
          onMouseEnter={(event) => (event.currentTarget.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = "transparent")}
          onClick={handleModalToggle}
        >
          <div>{icon && <span style={{ color: iconColor, fontSize: "18px", marginTop: "4px" }}>{icon}</span>}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>{resolvedTitle}</span>
            <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>{resolvedDescription}</span>
          </div>
        </div>
        <Modal
          title={resolvedTitle}
          open={isModalOpen}
          onOk={methods.handleSubmit(handleSubmit)}
          onCancel={handleModalToggle}
          destroyOnClose
        >
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <IleriTarihePlanlaForm selectedRow={selectedRows?.[0]} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
