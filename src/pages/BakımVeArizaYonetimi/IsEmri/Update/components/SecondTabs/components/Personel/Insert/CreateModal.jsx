import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function CreateModal({
  onRefresh,
  secilenIsEmriID,
  kapali,
  defaultCalismaSuresiDakika,
  triggerButtonText = "Yeni Kayıt",
  triggerButtonType = "link",
  triggerButtonClassName,
  triggerContainerClassName,
  openRequestKey,
}) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const lastHandledOpenRequestKey = useRef(0);
  const methods = useForm({
    defaultValues: {
      secilenID: "",
      personelTanim: "",
      personelID: "",
      selectedPersoneller: [],
      calismaSuresi: "",
      saatUcreti: "",
      maliyet: "",
      fazlaMesai: false,
      mesaiSuresi: "",
      mesaiUcreti: "",
      masrafMerkezi: "",
      masrafMerkeziID: "",
      vardiya: null,
      vardiyaID: "",
      aciklama: "",
      personelBaslamaSaati: "",
      personelBaslamaZamani: "",
      // Add other default values here
    },
  });

  const { setValue, reset } = methods;

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const getSelectedPersoneller = (data) => {
    if (Array.isArray(data.selectedPersoneller) && data.selectedPersoneller.length > 0) {
      return data.selectedPersoneller.filter((personel) => personel?.key);
    }

    if (data.personelID) {
      const personelNames = String(data.personelTanim || "").split(",");
      return String(data.personelID)
        .split(",")
        .filter(Boolean)
        .map((personelId, index) => ({
          key: personelId,
          subject: personelNames[index]?.trim() || "",
        }));
    }

    return [];
  };

  const createBody = (data, personelId) => ({
    TB_ISEMRI_KAYNAK_ID: 0,
    IDK_REF_ID: personelId,
    IDK_SURE: data.calismaSuresi,
    IDK_SAAT_UCRETI: data.saatUcreti,
    IDK_MALIYET: data.maliyet,
    IDK_FAZLA_MESAI_VAR: data.fazlaMesai,
    IDK_FAZLA_MESAI_SURE: data.mesaiSuresi,
    IDK_FAZLA_MESAI_SAAT_UCRETI: data.mesaiUcreti,
    IDK_MASRAF_MERKEZI_ID: data.masrafMerkeziID,
    IDK_VARDIYA: data.vardiyaID,
    IDK_ACIKLAMA: data.aciklama,
    IDK_TARIH: formatDateWithDayjs(data.personelBaslamaZamani),
    IDK_SAAT: formatTimeWithDayjs(data.personelBaslamaSaati),
  });

  const onSubmited = async (data) => {
    if (submitting) return;

    const selectedPersoneller = getSelectedPersoneller(data);

    if (selectedPersoneller.length === 0) {
      message.error(t("workOrder.validation.required"));
      return;
    }

    setSubmitting(true);

    try {
      const responses = await Promise.all(
        selectedPersoneller.map((personel) => AxiosInstance.post(`AddUpdateIsEmriPersonel?isEmriId=${secilenIsEmriID}`, createBody(data, personel.key)))
      );

      const hasUnauthorizedResponse = responses.some((response) => response?.status_code === 401);
      const allRequestsSuccessful = responses.every((response) => response?.status_code === 200 || response?.status_code === 201);

      if (allRequestsSuccessful) {
        message.success(t("islemBasarili"));
        reset();
        setIsModalVisible(false);
        onRefresh();
      } else if (hasUnauthorizedResponse) {
        message.error(t("workOrder.personnelList.noPermission"));
      } else {
        message.error(t("islemBasarisiz"));
      }
    } catch (error) {
      console.error("Error sending data:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalToggle = () => {
    if (submitting) return;

    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
      if (defaultCalismaSuresiDakika > 0) {
        setValue("calismaSuresi", defaultCalismaSuresiDakika);
      }
    }
  };

  useEffect(() => {
    if (openRequestKey && openRequestKey !== lastHandledOpenRequestKey.current && !kapali) {
      lastHandledOpenRequestKey.current = openRequestKey;
      reset();
      if (defaultCalismaSuresiDakika > 0) {
        setValue("calismaSuresi", defaultCalismaSuresiDakika);
      }
      setIsModalVisible(true);
    }
  }, [openRequestKey, kapali, reset, setValue, defaultCalismaSuresiDakika]);

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <div
          className={triggerContainerClassName}
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button disabled={kapali || submitting} type={triggerButtonType} className={triggerButtonClassName} onClick={handleModalToggle}>
            <PlusOutlined /> {triggerButtonText}
          </Button>
        </div>

        <Modal
          width="985px"
          title="Personel Ekle"
          destroyOnClose
          centered
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}
          confirmLoading={submitting}
          cancelButtonProps={{ disabled: submitting }}
        >
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
