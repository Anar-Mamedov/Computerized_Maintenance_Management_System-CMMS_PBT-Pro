import React, { useState } from "react";
import tr_TR from "antd/es/locale/tr_TR";
import { Button, Space, ConfigProvider, Modal, message, Typography, Input, DatePicker, TimePicker, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { t } from "i18next";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

const CreateModal = ({ onRefresh, selectedRowID }) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        methods.reset();
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  const methods = useForm({
    defaultValues: {
      tarih: null,
      saat: null,
      tutar: null,
      aciklama: null,
    },
  });

  const {
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = methods;

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
      SFT_STOK_ID: selectedRowID,
      SFT_TARIH: formatDateWithDayjs(data.tarih),
      SFT_SAAT: formatTimeWithDayjs(data.saat),
      SFT_ACIKLAMA: data.aciklama,
      SFT_GC: data.tipi,
      SFT_TUTAR: data.tutar,
    };

    AxiosInstance.post("AddFiyatGiris", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
          onRefresh();
          reset();
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

  const options = [
    { value: "G", label: t("giris") },
    { value: "C", label: t("cikis") },
  ];

  const ErrorMessage = ({ message }) => (
    <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "2px", textAlign: "right" }}>
      {message}
    </div>
  );

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          {t("yeniFiyat")}
        </Button>
        <Modal
          width={500}
          centered
          title={t("Yeni Fiyat Ekle")}
          destroyOnClose
          open={open}
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
                {t("kaydet")}
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              
              {/* TARİH */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600" }}>{t("tarih")}</Text>
                  <Controller
                    name="tarih"
                    control={control}
                    rules={{ required: t("Alan Boş Bırakılamaz") }}
                    render={({ field, fieldState: { error } }) => (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <DatePicker {...field} status={error ? "error" : ""} style={{ width: "250px" }} needConfirm={false} placeholder={t("Tarih Seçiniz")} format="DD.MM.YYYY" />
                        {error && <ErrorMessage message={error.message} />}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* SAAT */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600" }}>{t("saat")}</Text>
                  <Controller
                    name="saat"
                    control={control}
                    rules={{ required: t("Alan Boş Bırakılamaz") }}
                    render={({ field, fieldState: { error } }) => (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <TimePicker {...field} status={error ? "error" : ""} style={{ width: "250px" }} needConfirm={false} placeholder={t("Saat Seçiniz")} format="HH:mm" />
                        {error && <ErrorMessage message={error.message} />}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* TUTAR */}
<div style={{ display: "flex", flexDirection: "column" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <Text style={{ fontWeight: "600" }}>{t("tutar")}</Text>
    <Controller
      name="tutar"
      control={control}
      rules={{ required: t("Alan Boş Bırakılamaz") }}
      render={({ field, fieldState: { error } }) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <InputNumber
            {...field}
            status={error ? "error" : ""}
            style={{ width: "250px" }}
            placeholder={t("Tutar Giriniz")}
            // Virgüllü giriş için gerekenler:
            step="0.01" // Her artışta ne kadar artacağı (opsiyonel)
            stringMode // Hassas hesaplamalar için değerleri string olarak tutar
            decimalSeparator="," // Virgülü ayırıcı yapar
            formatter={(value) => `${value}`.replace(".", ",")} // Görüntülerken noktayı virgüle çevirir
            parser={(value) => value.replace(",", ".")} // Kaydederken virgülü noktaya çevirir (JS standardı)
          />
          {error && <ErrorMessage message={error.message} />}
        </div>
      )}
    />
  </div>
</div>

              {/* TİPİ */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600" }}>{t("Tipi")}</Text>
                  <Controller
                    name="tipi"
                    control={control}
                    rules={{ required: t("Alan Boş Bırakılamaz") }}
                    render={({ field, fieldState: { error } }) => (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Select {...field} status={error ? "error" : ""} placeholder={t("secimYapiniz")} allowClear options={options} style={{ width: "250px" }} />
                        {error && <ErrorMessage message={error.message} />}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* AÇIKLAMA */}
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                <Text>{t("aciklama")}</Text>
                <Controller
                  name="aciklama"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextArea {...field} status={error ? "error" : ""} style={{ width: "250px" }} placeholder={t("Açıklama Giriniz")} />
                  )}
                />
              </div>

            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
};

export default CreateModal;
