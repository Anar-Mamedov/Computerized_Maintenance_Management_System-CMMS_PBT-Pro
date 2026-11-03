import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { t } from "i18next";
import { Button, Divider, Input, Modal } from "antd";
import { GetLastikByIdService, UpdateLastikService } from "../../api/services/lastiktanim_services";
import LastikMarka from "../../components/LastikMarka";
import LastikModel from "../../components/LastikModel";
import KodIDSelectbox from "../../../../utils/components/KodIDSelectbox";
import NumberInput from "../../../../utils/components/NumberInput";
import { KOD_GRUPLARI } from "../../constants";
import FirmaUnvani from "../../components/form/FirmaUnvani";
import TextArea from "antd/es/input/TextArea";

const UpdateModal = ({ updateModal, setUpdateModal, setStatus, id, selectedRow, onDrawerClose, drawerVisible, onRefresh }) => {
  const [lastikId, setLastikId] = useState(0);

  const defaultValues = {};
  const methods = useForm({
    defaultValues: defaultValues,
  });
  const { handleSubmit, reset, control, setValue } = methods;

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
    <Button key="submit" className="btn btn-min primary-btn" onClick={onSubmit}>
      {t("guncelle")}
    </Button>,
    <Button
      key="back"
      className="btn btn-min cancel-btn"
      onClick={() => {
        onDrawerClose();
        reset(defaultValues);
      }}
    >
      {t("iptal")}
    </Button>,
  ];

  return (
    <Modal title={t("lastikTanimGuncelle")} open={drawerVisible} onCancel={() => onDrawerClose()} maskClosable={false} footer={footer} width={1200}>
      <FormProvider {...methods}>
        <form>
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-12">
              <h2 className="">{t("genelBilgiler")}</h2>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("lastikTanimi")}</label>
                <Controller name="tanim" control={control} render={({ field }) => <Input {...field} onChange={(e) => field.onChange(e.target.value)} />} />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("marka")}</label>
                <LastikMarka name1="marka" isRequired={false} allowAdd />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("model")}</label>
                <LastikModel name1="model" isRequired={false} watchName="marka" allowAdd />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("ebat")}</label>
                <KodIDSelectbox name1="ebat" kodID={KOD_GRUPLARI.lastikEbati} isRequired={false} />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("tip")}</label>
                <KodIDSelectbox name1="tip" kodID={KOD_GRUPLARI.lastikTipi} isRequired={false} />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("disDerinligi")}</label>
                <NumberInput name1="disDerinlik" />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("basinc")}</label>
                <NumberInput name1="basinc" />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("lastikOmru")}</label>
                <NumberInput name1="lastikOmru" />
              </div>
            </div>
          </div>
          <div className="m-20">
            <Divider />
          </div>
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-12">
              <h2 className="">{t("satinalmaBilgiler")}</h2>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("firma")}</label>
                <Controller name="firmaId" control={control} render={({ field }) => <FirmaUnvani field={field} />} />
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col gap-1">
                <label>{t("fiyat")}</label>
                <NumberInput name1="fiyat" />
              </div>
            </div>
          </div>
          <div className="m-20">
            <Divider />
          </div>
          <div className="flex flex-col gap-1">
            <label>{t("aciklama")}</label>
            <Controller name="aciklama" control={control} render={({ field }) => <TextArea {...field} />} />
          </div>
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
