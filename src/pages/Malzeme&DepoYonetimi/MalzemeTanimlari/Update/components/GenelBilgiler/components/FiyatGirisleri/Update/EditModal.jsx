import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin, Typography, DatePicker, TimePicker, InputNumber, Input, Select } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../../../../../api/http.jsx";
import { t } from "i18next";

const { Text } = Typography;
const { TextArea } = Input;

export default function EditModal({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      rolSelect: null,
      mail: "",
      kullaniciKod: "",
      isim: "",
      soyisim: "",
      telefonNo: "",
      sifre: "",
      paraf: "",
      rolSelectID: null,
      color: "#ffffff",
      aktif: true,
      sistemYetkilisi: false,
      personel: null,
      personelID: null,
      siraNo: null,
    },
  });

  const { setValue, reset, watch, control } = methods;

  const refreshTable = watch("refreshTable");

  // API'den gelen verileri form alanlarına set etme

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında

        // Form alanlarını set et
        const tarih = dayjs(selectedRow?.tarih);
        const saat = dayjs(selectedRow?.saat);

        if (tarih.isValid()) {
          setValue("tarih", tarih);
        }

        if (saat.isValid()) {
          setValue("saat", saat);
        }
        setValue("tutar", selectedRow?.SFT_TUTAR);
        setValue("tipi", selectedRow?.SFT_GC_NEW);
        setValue("aciklama", selectedRow?.SFT_ACIKLAMA);
        // ... Diğer setValue çağrıları

        setLoading(false); // Yükleme tamamlandığında
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset, AxiosInstance]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmit = (data) => {
    const Body = {
      SFT_STOK_ID: selectedRow?.key,
      SFT_TARIH: formatDateWithDayjs(data.tarih),
      SFT_SAAT: formatTimeWithDayjs(data.saat),
      SFT_ACIKLAMA: data.aciklama,
      SFT_GC: data.tipi,
      SFT_TUTAR: data.tutar,
    };

    AxiosInstance.post("UpdateFiyatGiris", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
          setOpen(false);
          onRefresh();
          methods.reset();
          onDrawerClose();
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

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        reset();
        onDrawerClose();
      },
    });
  };

  const options = [
    { value: "G", label: t("giris") },
    { value: "C", label: t("cikis") },
  ];

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Modal
          width="500px"
          centered
          title={t("malzemeGuncelleme")}
          open={drawerVisible}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>{t("iptal")}</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                {t("guncelle")}
              </Button>
            </Space>
          }
        >
          {loading ? (
            <div style={{ overflow: "auto", height: "calc(100vh - 150px)" }}>
              <Spin
                spinning={loading}
                size="large"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* İçerik yüklenirken gösterilecek alan */}
              </Spin>
            </div>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600" }}>{t("tarih")}</Text>
                  <Controller
                    name="tarih"
                    control={control}
                    rules={{ required: t("tarihZorunlu") }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker {...field} status={error ? "error" : ""} style={{ width: "250px" }} needConfirm={false} placeholder={t("tarihSeciniz")} format="DD.MM.YYYY" />
                    )}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600" }}>{t("saat")}</Text>
                  <Controller
                    name="saat"
                    control={control}
                    rules={{ required: t("saatZorunlu") }}
                    render={({ field, fieldState: { error } }) => (
                      <TimePicker {...field} status={error ? "error" : ""} style={{ width: "250px" }} needConfirm={false} placeholder={t("saatSeciniz")} format="HH:mm" />
                    )}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600" }}>{t("tutar")}</Text>
                  <Controller
                    name="tutar"
                    control={control}
                    rules={{ required: t("tutarZorunlu") }}
                    render={({ field, fieldState: { error } }) => (
                      <InputNumber {...field} status={error ? "error" : ""} style={{ width: "250px" }} placeholder={t("tutarGiriniz")} />
                    )}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600" }}>{t("tipi")}</Text>
                  <Controller
                    name="tipi"
                    control={control}
                    rules={{ required: t("tipiZorunlu") }}
                    render={({ field, fieldState: { error } }) => (
                      <Select {...field} status={error ? "error" : ""} placeholder={t("secimYapiniz")} allowClear options={options} style={{ width: "250px" }} />
                    )}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                  <Text>{t("aciklama")}</Text>
                  <Controller
                    name="aciklama"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextArea {...field} status={error ? "error" : ""} style={{ width: "250px" }} placeholder={t("aciklamaGiriniz")} />
                    )}
                  />
                </div>
              </div>
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
