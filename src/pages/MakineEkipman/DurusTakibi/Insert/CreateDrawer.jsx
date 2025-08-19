import tr_TR from "antd/es/locale/tr_TR";
// import "@ant-design/v5-patch-for-react-19";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import Footer from "../Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
// import SecondTabs from "./components/secondTabs/secondTabs";

export default function CreateModal({ selectedLokasyonId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [periyodikBakim, setPeriyodikBakim] = useState("");

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      // Reset the fisIcerigi with a timeout to avoid focus errors
      setTimeout(() => {
        setValue("fisIcerigi", []);
      }, 0);
    }
  }, [open]);

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        // First close the modal to avoid focus errors
        setOpen(false);

        // Then reset the form with a slight delay
        setTimeout(() => {
          methods.reset({
            durusNedeni: undefined,
            durusNedeniID: undefined,
            planli: undefined,
            baslamaZamani: undefined,
            baslamaSaati: undefined,
            bitisZamani: undefined,
            bitisSaati: undefined,
            durusSuresiDakika: undefined,
            durusMaliyetiSaat: undefined,
            toplamMaliyet: undefined,
            proje: undefined,
            projeID: undefined,
            aciklama: undefined,
            fisIcerigi: [],
          });
        }, 100);
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  // back-end'e gönderilecek veriler

  //* export
  const methods = useForm({
    defaultValues: {
      durusNedeni: undefined,
      durusNedeniID: undefined,
      planli: undefined,
      baslamaZamani: undefined,
      baslamaSaati: undefined,
      bitisZamani: undefined,
      bitisSaati: undefined,
      durusSuresiDakika: undefined,
      durusMaliyetiSaat: undefined,
      toplamMaliyet: undefined,
      proje: undefined,
      projeID: undefined,
      aciklama: undefined,
      fisIcerigi: [],
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

  const { setValue, reset, watch } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      makineler: [{ makineId: data.fisIcerigi.makineId, lokasyonId: data.fisIcerigi.makineLokasyonID }],
      baslamaTarih: data.baslamaZamani,
      baslamaSaat: data.baslamaSaati,
      bitisTarih: data.bitisZamani,
      bitisSaat: data.bitisSaati,
      sure: data.durusSuresiDakika,
      saatMaliyet: data.durusMaliyetiSaat,
      toplamMaliyet: data.toplamMaliyet,
      nedenKodId: data.durusNedeniID,
      aciklama: data.aciklama,
      planli: data.planli,
      projeId: data.projeID,
    };

    AxiosInstance.post("AddMakineDurus", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");

          // First close the modal to avoid focus errors
          setOpen(false);
          onRefresh();

          // Then reset the form with a slight delay
          setTimeout(() => {
            methods.reset({
              durusNedeni: undefined,
              durusNedeniID: undefined,
              planli: undefined,
              baslamaZamani: undefined,
              baslamaSaati: undefined,
              bitisZamani: undefined,
              bitisSaati: undefined,
              durusSuresiDakika: undefined,
              durusMaliyetiSaat: undefined,
              toplamMaliyet: undefined,
              proje: undefined,
              projeID: undefined,
              aciklama: undefined,
              fisIcerigi: [],
            });
          }, 100);
        } else if (response.data.statusCode === 401) {
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

  useEffect(() => {
    // Eğer selectedLokasyonId varsa ve geçerli bir değerse, formun default değerini güncelle
    if (selectedLokasyonId !== undefined && selectedLokasyonId !== null) {
      methods.reset({
        ...methods.getValues(),
        selectedLokasyonId: selectedLokasyonId,
      });
    }
  }, [selectedLokasyonId, methods]);

  const periyodikBilgisi = watch("periyodikBilgisi");

  useEffect(() => {
    if (periyodikBilgisi === true) {
      setPeriyodikBakim("[Periyodik Bakım]");
    } else {
      setPeriyodikBakim("");
    }
  }, [periyodikBilgisi]);

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <PlusOutlined />
          {t("ekle")}
        </Button>
        <Modal
          width="710px"
          centered
          title={t("hizliMakineDurusGirisi")}
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
            <div>
              <MainTabs modalOpen={open} />
              <SecondTabs modalOpen={open} />
              {/*<Footer />*/}
            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
