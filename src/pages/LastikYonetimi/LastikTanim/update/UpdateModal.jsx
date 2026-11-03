import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { t } from "i18next";
import { Button, Modal } from "antd";
import { GetLastikByIdService, UpdateLastikService } from "../../api/services/lastiktanim_services";
import LastikTanimFormu from "../components/LastikTanimFormu";

const UpdateModal = ({ updateModal, setUpdateModal, setStatus, id, selectedRow, onDrawerClose, drawerVisible, onRefresh }) => {
  const [lastikId, setLastikId] = useState(0);

  const defaultValues = {};
  const methods = useForm({
    defaultValues: defaultValues,
  });
  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (selectedRow) {
      GetLastikByIdService(selectedRow?.key).then((res) => {
        setValue("aciklama", res.data.aciklama);
        setValue("basinc", res.data.basinc);
        setValue("disDerinlik", res.data.disDerinlik);
        setValue("ebat", res.data.ebat);
        setValue("ebatID", res.data.ebatKodId);
        setValue("unvan", res.data.firma);
        setValue("firmaId", res.data.firmaId);
        setValue("fiyat", res.data.fiyat);
        setValue("lastikOmru", res.data.lastikOmru);
        setValue("marka", res.data.marka);
        setValue("markaID", res.data.markaId);
        setTimeout(() => {
          setValue("model", res.data.model);
          setValue("modelID", res.data.modelId);
        }, 100);
        setValue("tanim", res.data.tanim);
        setValue("tip", res.data.tip);
        setValue("tipID", res.data.tipKodId);
        setLastikId(res.data.siraNo);
      });
    }
  }, [selectedRow, drawerVisible]);

  const onSubmit = handleSubmit((values) => {
    const body = {
      siraNo: lastikId,
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

    UpdateLastikService(body).then((res) => {
      const { statusCode } = res.data;
      if (statusCode === 200 || statusCode === 201 || statusCode === 202) {
        onDrawerClose();
        onRefresh();
        reset(defaultValues);
      }
    });
    onRefresh();
  });

  const footer = [
    <Button
      key="back"
      onClick={() => {
        onDrawerClose();
        reset(defaultValues);
      }}
    >
      {t("iptal")}
    </Button>,
    <Button key="submit" type="primary" onClick={onSubmit}>
      {t("guncelle")}
    </Button>,
  ];

  return (
    <Modal title={t("lastikTanimGuncelle")} open={drawerVisible} onCancel={() => onDrawerClose()} maskClosable={false} footer={footer} width={960}>
      <FormProvider {...methods}>
        <form>
          <LastikTanimFormu />
        </form>
      </FormProvider>
    </Modal>
  );
};

UpdateModal.propTypes = {
  selectedRow: PropTypes.object,
  onDrawerClose: PropTypes.func,
  drawerVisible: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default UpdateModal;
