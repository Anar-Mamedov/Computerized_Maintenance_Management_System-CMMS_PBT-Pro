import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [open, setOpen] = useState(drawerVisible);

  const methods = useForm({
  defaultValues: {
    tbCariId: 0,
    carKod: "",
    carTanim: "",
    carAdres: "",
    carSehir: "",
    carIlce: "",
    carTel1: "",
    carEmail: "",
    carVergiDaire: "",
    carVergiNo: "",
    carTedarikci: true,
    carMusteri: true,
    carNakliyeci: true,
    carServis: true,
    carSube: true,
    carDiger: true,
  },
});

  const { setValue, reset } = methods;

  useEffect(() => {
  setOpen(drawerVisible);
  if (drawerVisible && selectedRow) {
    setValue("tbCariId", selectedRow.TB_CARI_ID || 0);
    setValue("carKod", selectedRow.CAR_KOD || "");
    setValue("carTanim", selectedRow.CAR_TANIM || "");
    setValue("carAdres", selectedRow.CAR_ADRES || "");
    setValue("carSehir", selectedRow.CAR_SEHIR || "");
    setValue("carIlce", selectedRow.CAR_ILCE || "");
    setValue("carTel1", selectedRow.CAR_TEL1 || "");
    setValue("carEmail", selectedRow.CAR_EMAIL || "");
    setValue("carVergiDaire", selectedRow.CAR_VERGI_DAIRE || "");
    setValue("carVergiNo", selectedRow.CAR_VERGI_NO || "");
    setValue("carTedarikci", selectedRow.CAR_TEDARIKCI ?? true);
    setValue("carMusteri", selectedRow.CAR_MUSTERI ?? true);
    setValue("carNakliyeci", selectedRow.CAR_NAKLIYECI ?? true);
    setValue("carServis", selectedRow.CAR_SERVIS ?? true);
    setValue("carSube", selectedRow.CAR_SUBE ?? true);
    setValue("carDiger", selectedRow.CAR_DIGER ?? true);
  }
}, [selectedRow, setValue, drawerVisible]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmit = (data) => {
  // Form verilerini API'nin beklediği formata dönüştür
  const Body = {
    TB_CARI_ID: data.tbCariId,
    CAR_KOD: data.carKod,
    CAR_TANIM: data.carTanim,
    CAR_ADRES: data.carAdres,
    CAR_SEHIR: data.carSehir,
    CAR_ILCE: data.carIlce,
    CAR_TEL1: data.carTel1,
    CAR_EMAIL: data.carEmail,
    CAR_VERGI_DAIRE: data.carVergiDaire,
    CAR_VERGI_NO: data.carVergiNo,
    CAR_TEDARIKCI: data.carTedarikci ?? true,
    CAR_MUSTERI: data.carMusteri ?? true,
    CAR_NAKLIYECI: data.carNakliyeci ?? true,
    CAR_SERVIS: data.carServis ?? true,
    CAR_SUBE: data.carSube ?? true,
    CAR_DIGER: data.carDiger ?? true,
  };

  // API'ye POST isteği gönder
  AxiosInstance.post("UpdateTedarikci", Body)
    .then((response) => {
      if (response.status_code === 200 || response.status_code === 201) {
        message.success("Ekleme Başarılı.");
        setOpen(false);
        onRefresh();
        methods.reset();
      } else if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Ekleme Başarısız.");
      }
    })
    .catch((error) => {
      console.error("Error sending data:", error);
      message.error("Başarısız Olundu.");
    });
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

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Drawer
          width="550px"
          title="Tedarikçi Firma Güncelle"
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Güncelle
              </Button>
            </Space>
          }>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <MainTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
