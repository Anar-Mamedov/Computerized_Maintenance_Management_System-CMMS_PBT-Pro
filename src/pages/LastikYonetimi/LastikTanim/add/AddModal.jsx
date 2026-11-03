import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { AddIsLastikService } from "../../api/services/lastiktanim_services";
import LastikTanimFormu from "../components/LastikTanimFormu";

const AddModal = ({ setStatus, onRefresh }) => {
  const [openModal, setopenModal] = useState(false);

  const defaultValues = {
    tanim: null,
    aciklama: null,
    marka: null,
    markaID: null,
    markaLabel: null,
    model: null,
    modelID: null,
    modelLabel: null,
    tip: null,
    tipID: null,
    ebat: null,
    ebatID: null,
    lastikOmru: null,
    basinc: null,
    disDerinlik: null,
    fiyat: null,
    firmaId: null,
  };

  const methods = useForm({
    defaultValues: defaultValues,
  });
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
  } = methods;

  useEffect(() => {
    const markaLabel = watch("markaLabel");
    const modelLabel = watch("modelLabel");

    if (!watch("tanim") && markaLabel && modelLabel) {
      setValue("tanim", `${markaLabel} ${modelLabel}`);
    }
  }, [watch, setValue, watch("markaLabel"), watch("modelLabel")]);

  const onSubmit = handleSubmit((values) => {
    const body = {
      tanim: values.tanim,
      aciklama: values.aciklama,
      markaId: values.markaID || -1,
      modelId: values.modelID || -1,
      tipKodId: values.tipID || -1,
      ebatKodId: values.ebatID || -1,
      lastikOmru: values.lastikOmru || 0,
      basinc: values.basinc || 0,
      disDerinlik: values.disDerinlik || 0,
      fiyat: values.fiyat || 0,
      firmaId: values.firmaId || -1,
    };

    AddIsLastikService(body).then((res) => {
      if (res.data.statusCode === 200) {
        onRefresh();
        reset(defaultValues);
        setopenModal(false);
      }
    });
    onRefresh();
  });

  const handleOpenModal = () => {
    reset(defaultValues); // Reset form to null values when opening modal
    setopenModal(true);
  };

  const handleCloseModal = () => {
    setopenModal(false);
    reset(defaultValues);
  };

  const footer = [
    <Button key="back" onClick={handleCloseModal}>
      {t("iptal")}
    </Button>,
    <Button key="submit" type="primary" onClick={onSubmit}>
      {t("kaydet")}
    </Button>,
  ];

  return (
    <>
      <Button className="btn primary-btn" onClick={handleOpenModal}>
        <PlusOutlined /> {t("ekle")}
      </Button>
      <Modal title={t("yeniLastikGirisi")} open={openModal} onCancel={handleCloseModal} maskClosable={false} footer={footer} width={960}>
        <FormProvider {...methods}>
          <form>
            <LastikTanimFormu zorunlu />
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default AddModal;
