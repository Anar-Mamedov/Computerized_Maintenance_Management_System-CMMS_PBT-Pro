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

  const getFisNo = async () => {
    try {
      const response = await AxiosInstance.get("ModulKoduGetir?modulKodu=SFS_GIRIS_FIS_NO");
      if (response) {
        setValue("depoNo", response);
      }
    } catch (error) {
      console.error("Error fetching fisNo:", error);
      message.error("Fiş numarası alınamadı!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      getFisNo();
      setValue("tarih", dayjs());
      setValue("saat", dayjs());

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
            depoNo: undefined,
            depoTanimi: undefined,
            personel: undefined,
            personelID: undefined,
            aktif: true,
            lokasyon: undefined,
            lokasyonID: undefined,
            atolye: undefined,
            atolyeID: undefined,
            telefon: undefined,
            fax: undefined,
            email: undefined,
            adres: undefined,
            ozelAlan1: undefined,
            ozelAlan2: undefined,
            ozelAlan3: undefined,
            ozelAlan4: undefined,
            ozelAlan5: undefined,
            ozelAlan6: undefined,
            ozelAlan7: undefined,
            ozelAlan8: undefined,
            ozelAlan9: undefined,
            ozelAlan10: undefined,
            ozelAlan11: undefined,
            ozelAlan11ID: undefined,
            ozelAlan12: undefined,
            ozelAlan12ID: undefined,
            ozelAlan13: undefined,
            ozelAlan13ID: undefined,
            ozelAlan14: undefined,
            ozelAlan14ID: undefined,
            ozelAlan15: undefined,
            ozelAlan15ID: undefined,
            ozelAlan16: undefined,
            ozelAlan17: undefined,
            ozelAlan18: undefined,
            ozelAlan19: undefined,
            ozelAlan20: undefined,
            aciklama: undefined,
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
      depoNo: undefined,
      depoTanimi: undefined,
      personel: undefined,
      personelID: undefined,
      aktif: true,
      lokasyon: undefined,
      lokasyonID: undefined,
      atolye: undefined,
      atolyeID: undefined,
      telefon: undefined,
      fax: undefined,
      email: undefined,
      adres: undefined,
      ozelAlan1: undefined,
      ozelAlan2: undefined,
      ozelAlan3: undefined,
      ozelAlan4: undefined,
      ozelAlan5: undefined,
      ozelAlan6: undefined,
      ozelAlan7: undefined,
      ozelAlan8: undefined,
      ozelAlan9: undefined,
      ozelAlan10: undefined,
      ozelAlan11: undefined,
      ozelAlan11ID: undefined,
      ozelAlan12: undefined,
      ozelAlan12ID: undefined,
      ozelAlan13: undefined,
      ozelAlan13ID: undefined,
      ozelAlan14: undefined,
      ozelAlan14ID: undefined,
      ozelAlan15: undefined,
      ozelAlan15ID: undefined,
      ozelAlan16: undefined,
      ozelAlan17: undefined,
      ozelAlan18: undefined,
      ozelAlan19: undefined,
      ozelAlan20: undefined,
      aciklama: undefined,
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
      DEP_STOK_ID: 0,
      DEP_KOD: String(data.depoNo),
      DEP_TANIM: String(data.depoTanimi),
      DEP_AKTIF: data.aktif ? true : false,
      DEP_LOKASYON_ID: Number(data.lokasyonID),
      DEP_ATOLYE_ID: Number(data.atolyeID),
      DEP_MODUL_NO: 0,
      DEP_KAPASITE: 0,
      DEP_KRITIK_MIKTAR: 0,
      DEP_MIKTAR: 0,
      DEP_STOK_BIRIM: "string",
      DEP_ACIKLAMA: String(data.aciklama),
      DEP_SORUMLU_PERSONEL_ID: Number(data.personelID),
      DEP_OZEL_ALAN_1: String(data.ozelAlan1),
      DEP_OZEL_ALAN_2: String(data.ozelAlan2),
      DEP_OZEL_ALAN_3: String(data.ozelAlan3),
      DEP_OZEL_ALAN_4: String(data.ozelAlan4),
      DEP_OZEL_ALAN_5: String(data.ozelAlan5),
      DEP_OZEL_ALAN_6_KOD_ID: 0,
      DEP_OZEL_ALAN_7_KOD_ID: 0,
      DEP_OZEL_ALAN_8_KOD_ID: 0,
      DEP_OZEL_ALAN_9: String(data.ozelAlan9),
      DEP_OZEL_ALAN_10: String(data.ozelAlan10),
      PRS_ISIM: "string",
      ATL_TANIM: "string",
      LOK_TANIM: "string",
      DEP_OZEL_ALAN_6: String(data.ozelAlan6),
      DEP_OZEL_ALAN_7: String(data.ozelAlan7),
      DEP_OZEL_ALAN_8: String(data.ozelAlan8),
      DEP_FAX: String(data.fax),
      DEP_TEL: String(data.tel),
      DEP_EMAIL: String(data.email),
      DEP_ADRES: String(data.adres),
    };

    AxiosInstance.post("AddDepo", Body)
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
              fisNo: null,
              firma: null,
              firmaID: null,
              makineID: null,
              makine: null,
              tarih: null,
              saat: null,
              islemTipi: null,
              islemTipiID: null,
              girisDeposu: null,
              girisDeposuID: null,
              lokasyon: null,
              lokasyonID: null,
              siparisNo: null,
              siparisNoID: null,
              proje: null,
              projeID: null,
              totalAraToplam: null,
              totalIndirim: null,
              totalKdvToplam: null,
              totalGenelToplam: null,
              aciklama: null,
              ozelAlan1: null,
              ozelAlan2: null,
              ozelAlan3: null,
              ozelAlan4: null,
              ozelAlan5: null,
              ozelAlan6: null,
              ozelAlan7: null,
              ozelAlan8: null,
              ozelAlan9: null,
              ozelAlan9ID: null,
              ozelAlan10: null,
              ozelAlan10ID: null,
              ozelAlan11: null,
              ozelAlan12: null,
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
          width="900px"
          centered
          title={t("yeniDepoGirisi")}
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
