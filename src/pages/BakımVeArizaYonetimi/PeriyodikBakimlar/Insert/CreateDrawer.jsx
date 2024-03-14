import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";

export default function CreateDrawer({ selectedLokasyonId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
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

  // back-end'e gönderilecek veriler

  const handleClick = () => {
    const values = methods.getValues();
    console.log(onSubmit(values));
  };

  //* export
  const methods = useForm({
    defaultValues: {
      bakimKodu: "",
      bakimTanimi: "",
      bakimAktif: true,
      bakimTipi: "",
      bakimGrubu: null,
      bakimGrubuID: "",
    },
  });

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const { setValue, reset } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      BAKIM_KOD: data.bakimKodu,
      BAKIM_TANIM: data.bakimTanimi,
      BAKIM_TIP: data.bakimTipi,
      BAKIM_GRUP_ID: data.bakimGrubuID,
      BAKIM_AKTIF: data.bakimAktif,
      ONCELIK: data
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("AddAtolye", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
        setOpen(false);
        onRefresh();
        reset();
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
      });
    console.log({ Body });
  };

  useEffect(() => {
    // Eğer selectedLokasyonId varsa ve geçerli bir değerse, formun default değerini güncelle
    if (selectedLokasyonId !== undefined && selectedLokasyonId !== null) {
      methods.reset({
        ...methods.getValues(),
        selectedLokasyonId: selectedLokasyonId,
      });
    }
  }, [selectedLokasyonId, methods]);

  useEffect(() => {
    if (open) {
      AxiosInstance.get("AtolyeKodGetir")
        .then((response) => {
          setValue("atolyeKodu", response);
        })
        .catch((error) => {
          console.error("Error fetching new work order number:", error);
        });
    }
  }, [open, setValue]);


  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          <Button
            type="primary"
            onClick={showDrawer}
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <PlusOutlined />
            Ekle
          </Button>
          <Drawer
            width="550px"
            title="Bakım Tanımı Ekle"
            placement={"right"}
            onClose={onClose}
            open={open}
            extra={
              <Space>
                <Button onClick={onClose}>İptal</Button>
                <Button
                  type="submit"
                  onClick={handleClick}
                  style={{
                    backgroundColor: "#2bc770",
                    borderColor: "#2bc770",
                    color: "#ffffff",
                  }}>
                  Kaydet
                </Button>
              </Space>
            }>
            <MainTabs />
            <Footer />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
