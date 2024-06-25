import React, { useEffect, useState } from "react";
import { Button, Input, message, Modal, Typography } from "antd";
import { useAppContext } from "../../../AppContext.jsx";
import {
  Controller,
  useForm,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import AxiosInstance from "../../../api/http.jsx";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

const HesapBilgileriDuzenle = ({
  accountEditModalOpen,
  accountEditModalClose,
}) => {
  const { userData1 } = useAppContext(); // AppContext'ten userData1 değerini alın
  const methods = useForm({
    defaultValues: {
      PRS_ISIM: "",
      KLL_KOD: "",
      KLL_TANIM: "",
      PRS_EMAIL: "",
      PRS_TELEFON: "",
      PRS_DAHILI: "",
      PRS_ADRES: "",
      PRS_ACIKLAMA: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (accountEditModalOpen && userData1) {
      setValue("PRS_ISIM", userData1?.PRS_ISIM);
      setValue("KLL_KOD", userData1?.KLL_KOD);
      setValue("KLL_TANIM", userData1?.KLL_TANIM);
      setValue("PRS_EMAIL", userData1?.PRS_EMAIL);
      setValue("PRS_TELEFON", userData1?.PRS_TELEFON);
      setValue("PRS_DAHILI", userData1?.PRS_DAHILI);
      setValue("PRS_ADRES", userData1?.PRS_ADRES);
      setValue("PRS_ACIKLAMA", userData1?.PRS_ACIKLAMA);
    }
  }, [userData1, accountEditModalOpen, setValue]);

  useEffect(() => {
    if (!accountEditModalOpen) {
      reset();
    }
  }, [accountEditModalOpen, reset]);

  const onSubmited = (data) => {
    const Body = {
      PRS_ISIM: data.PRS_ISIM,
      KLL_KOD: data.KLL_KOD,
      KLL_TANIM: data.KLL_TANIM,
      PRS_EMAIL: data.PRS_EMAIL,
      PRS_TELEFON: data.PRS_TELEFON,
      PRS_DAHILI: data.PRS_DAHILI,
      PRS_ADRES: data.PRS_ADRES,
      PRS_ACIKLAMA: data.PRS_ACIKLAMA,
    };

    AxiosInstance.post(`burayaGercekApiYaz`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          accountEditModalClose(); // Modal'ı kapat
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
    console.log({ Body });
  };

  return (
    <FormProvider {...methods}>
      <Modal
        title="Hesabı Düzenle"
        open={accountEditModalOpen}
        onOk={methods.handleSubmit(onSubmited)}
        onCancel={accountEditModalClose}
        width={450}
        centered
      >
        <form onSubmit={methods.handleSubmit(onSubmited)}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Kullanıcı İsimi:</Text>
              <Controller
                name="KLL_TANIM"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "100%", maxWidth: "300px" }}
                  />
                )}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Kullanici Kodu:</Text>
              <Controller
                name="KLL_KOD"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                  >
                    <Input
                      {...field}
                      status={error ? "error" : ""}
                      style={{ flex: 1 }}
                    />
                    {error && (
                      <div style={{ color: "red" }}>{error.message}</div>
                    )}
                  </div>
                )}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>E-Posta:</Text>
              <Controller
                name="PRS_EMAIL"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "100%", maxWidth: "300px" }}
                  />
                )}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Telefon:</Text>
              <Controller
                name="PRS_TELEFON"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "100%", maxWidth: "300px" }}
                  />
                )}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Dahili:</Text>
              <Controller
                name="PRS_DAHILI"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "100%", maxWidth: "300px" }}
                  />
                )}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Adres:</Text>
              <Controller
                name="PRS_ADRES"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "100%", maxWidth: "300px" }}
                  />
                )}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
              }}
            >
              <Text>Açıklama:</Text>
              <Controller
                name="PRS_ACIKLAMA"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    style={{ width: "100%", maxWidth: "300px" }}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </Modal>
    </FormProvider>
  );
};
export default HesapBilgileriDuzenle;
