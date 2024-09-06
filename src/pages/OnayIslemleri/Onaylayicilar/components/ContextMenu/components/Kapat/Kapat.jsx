import React, { useEffect, useState } from "react";
import { Button, Modal, message, Typography, Alert } from "antd";
import Forms from "./components/Forms";
import { Controller, useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import dayjs from "dayjs";

const { Text } = Typography;

export default function Iptal({ selectedRows, refreshTableData, kapatDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageShow, setErrorMessageShow] = useState(false);
  const methods = useForm({
    defaultValues: {
      baslamaTarihi: null,
      baslamaSaati: null,
      bitisTarihi: null,
      bitisSaati: null,
      calismaSaat: "",
      calismaDakika: "",
      sonuc: null,
      sonucID: "",
      kapatmaTarihi: null,
      kapatmaSaati: null,
      bakimPuani: "",
      makineDurumu: null,
      makineDurumuID: "",
      aciklama: "",

      // Add other default values here
    },
  });
  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalOpen && selectedRows.length === 1) {
      const row = selectedRows[0]; // Assuming you want to use the first selected row

      setValue("baslamaTarihi", row.BASLAMA_TARIH ? (dayjs(row.BASLAMA_TARIH).isValid() ? dayjs(row.BASLAMA_TARIH) : null) : null);
      setValue("baslamaSaati", row.BASLAMA_SAAT ? (dayjs(row.BASLAMA_SAAT.trim(), "HH:mm").isValid() ? dayjs(row.BASLAMA_SAAT.trim(), "HH:mm") : null) : null);

      setValue("bitisTarihi", row.ISM_BITIS_TARIH ? (dayjs(row.ISM_BITIS_TARIH).isValid() ? dayjs(row.ISM_BITIS_TARIH) : null) : null);
      setValue("bitisSaati", row.ISM_BITIS_SAAT ? (dayjs(row.ISM_BITIS_SAAT.trim(), "HH:mm").isValid() ? dayjs(row.ISM_BITIS_SAAT.trim(), "HH:mm") : null) : null);

      // Set other values here
    }
  }, [selectedRows, setValue, isModalOpen]);

  // Calculate modal title based on selectedRows
  const modalTitle = `İş Emri Kapatma - (${selectedRows.map((row) => row.ISEMRI_NO).join(", ")})`;

  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = kapatDisabled ? { display: "none" } : {};

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  // Rakamları kelimelere çevirecek eşleme yapısı
  const idToWordMap = {
    1: "Prosedur",
    2: "Makine",
    3: "Konu",
    4: "Tipi",
    5: "Proje",
    6: "Öncelik",
    7: "Atölye",
    8: "Sayaç",
    9: "Açıklama",
    10: "Sözleşme",
    11: "Kapatma Makine Durumu",
    12: "Firma",
    13: "Puan",
    14: "Ekipman",
    15: "Nedeni",
    16: "Referans No",
    17: "Makine Durumu",
  };

  const onSubmited = (data) => {
    if (selectedRows.length === 1) {
      // Tek satır seçildiğinde yapılacak işlemler (Mevcut işlemler)
      // Seçili satırlar için Body dizisini oluştur
      const Body = selectedRows.map((row) => ({
        TB_ISEMRI_ID: row.key,
        ISM_BASLAMA_TARIH: formatDateWithDayjs(data.baslamaTarihi),
        ISM_BASLAMA_SAAT: formatTimeWithDayjs(data.baslamaSaati),
        ISM_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
        ISM_BITIS_SAAT: formatTimeWithDayjs(data.bitisSaati),
        ISM_SURE_CALISMA: data.calismaSaat * 60 + data.calismaDakika,
        ISM_SONUC_KOD_ID: data.sonucID,
        ISM_KAPANMA_YDK_TARIH: formatDateWithDayjs(data.kapatmaTarihi),
        ISM_KAPANMA_YDK_SAAT: formatTimeWithDayjs(data.kapatmaSaati),
        ISM_PUAN: data.bakimPuani,
        ISM_KAPAT_MAKINE_DURUM_KOD_ID: data.makineDurumuID,
        ISM_SONUC: data.aciklama,
      }));

      AxiosInstance.get(`CheckIsmFieldsForClose?isEmriId=${selectedRows[0].key}`)
        .then((response) => {
          console.log("Data sent successfully:", response);

          if (response.Durum === false) {
            if (response.TextArray && response.TextArray.length > 0) {
              message.error(`${response.TextArray.join(",\n")}, Bu özel alanların doldurulması lazım.`);
            }
            if (response.Idlist && response.Idlist.length > 0) {
              // response.Idlist içindeki her bir ID için karşılık gelen kelimeyi bul
              const words = response.Idlist.map((id) => idToWordMap[id] || "Bilinmeyen ID");

              // Bulunan kelimeleri birleştirerek mesajda göster
              message.error(`${words.join(",\n")}, Bu alanların doldurulmazı lazım.`);
            }
            if (response.IsmIsNotPersonelTimeSet === true) {
              message.error(`Personel Çalışma Süresi Girilmedi.`);
            }
            reset();
            setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
            refreshTableData();
          } else if (response.Durum === true) {
            AxiosInstance.post("IsEmriKapat", Body)
              .then((response) => {
                console.log("Data sent successfully:", response);

                if (response.status_code === 200 || response.status_code === 201) {
                  message.success("İş Emri Kapandı.");
                  reset();
                  setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
                  refreshTableData();
                } else if (response.status_code === 401) {
                  message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
                } else {
                  message.error("işlem Başarısız.");
                }
              })
              .catch((error) => {
                // Handle errors here, e.g.:
                console.error("Error sending data:", error);
                if (navigator.onLine) {
                  // İnternet bağlantısı var
                  message.error("Hata Mesajı: " + error.message);
                } else {
                  // İnternet bağlantısı yok
                  message.error("Internet Bağlantısı Mevcut Değil.");
                }
              });
            console.log({ Body });
          } else {
            message.error("Ekleme Başarısız.");
          }
        })
        .catch((error) => {
          // Handle errors here, e.g.:
          console.error("Error sending data:", error);
          if (navigator.onLine) {
            // İnternet bağlantısı var
            message.error("Hata Mesajı: " + error.message);
          } else {
            // İnternet bağlantısı yok
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        });
      console.log({ Body });
    } else if (selectedRows.length > 1) {
      // Birden fazla satır seçildiğinde yapılacak işlemler
      const Body = selectedRows.map((row) => ({
        TB_ISEMRI_ID: row.key,
        ISM_BASLAMA_TARIH: formatDateWithDayjs(data.baslamaTarihi),
        ISM_BASLAMA_SAAT: formatTimeWithDayjs(data.baslamaSaati),
        ISM_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
        ISM_BITIS_SAAT: formatTimeWithDayjs(data.bitisSaati),
        ISM_SURE_CALISMA: data.calismaSaat * 60 + data.calismaDakika,
        ISM_SONUC_KOD_ID: data.sonucID,
        ISM_KAPANMA_YDK_TARIH: formatDateWithDayjs(data.kapatmaTarihi),
        ISM_KAPANMA_YDK_SAAT: formatTimeWithDayjs(data.kapatmaSaati),
        ISM_PUAN: data.bakimPuani,
        ISM_KAPAT_MAKINE_DURUM_KOD_ID: data.makineDurumuID,
        ISM_SONUC: data.aciklama,
      }));

      AxiosInstance.post("IsEmriKapat", Body)
        .then((response) => {
          console.log("Data sent successfully:", response);

          if (response.status_code === 200 || response.status_code === 201) {
            message.success("Ekleme Başarılı.");
            reset();
            setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
            refreshTableData();
          } else if (response.status_code === 401) {
            message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
          } else {
            message.error("Ekleme Başarısız.");
          }
        })
        .catch((error) => {
          // Handle errors here, e.g.:
          console.error("Error sending data:", error);
          if (navigator.onLine) {
            // İnternet bağlantısı var
            message.error("Hata Mesajı: " + error.message);
          } else {
            // İnternet bağlantısı yok
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        });
      console.log({ Body });
    }
  };

  const handleModalToggle = () => {
    if (!isModalOpen) {
      reset();
    }
    if (selectedRows.length === 1) {
      AxiosInstance.get(`CheckIsmFieldsForClose?isEmriId=${selectedRows[0].key}`)
        .then((response) => {
          console.log("Data sent successfully:", response);

          if (response.Durum === false) {
            setErrorMessageShow(true);
            let errorMsg = "";
            if (response.TextArray && response.TextArray.length > 0) {
              errorMsg += `${response.TextArray.join(",\n")}, `;
            }
            if (response.Idlist && response.Idlist.length > 0) {
              const words = response.Idlist.map((id) => idToWordMap[id] || "Bilinmeyen ID");
              errorMsg += `${words.join(",\n")}, `;
            }
            if (response.IsmIsNotPersonelTimeSet === true) {
              errorMsg += ``;
            }
            setErrorMessage(errorMsg);
            setDisabled(true);
          } else if (response.Durum === true) {
            setErrorMessageShow(false);
            setDisabled(false);
            if (!isModalOpen) {
              reset();
            }
          } else {
            message.error("İşlem Başarısız.");
          }
          setIsModalOpen((prev) => !prev);
        })
        .catch((error) => {
          // Handle errors here, e.g.:
          console.error("Error sending data:", error);
          if (navigator.onLine) {
            // İnternet bağlantısı var
            message.error("Hata Mesajı: " + error.message);
          } else {
            // İnternet bağlantısı yok
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        });
    } else if (selectedRows.length > 1) {
      setErrorMessageShow(false);
      setDisabled(false);
      setIsModalOpen((prev) => !prev);
    }
  };

  // const handleModalToggle = () => {
  //   setIsModalOpen((prev) => !prev);
  //   if (!isModalOpen) {
  //     reset();
  //   }
  // };

  return (
    <FormProvider {...methods}>
      <div style={buttonStyle}>
        <Button style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }} type="link" danger onClick={handleModalToggle}>
          Seçili İş Emirlerini Kapat
        </Button>
        <Modal
          key="modal"
          title={modalTitle}
          centered
          destroyOnClose
          width={990}
          open={isModalOpen}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}
          okButtonProps={{ disabled }}
          footer={[
            <div key="footer" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ width: "100%" }}>
                {errorMessageShow ? (
                  <Alert
                    key="alert"
                    style={{ fontWeight: 500, color: "red", textAlign: "left" }}
                    message={"İş emrinde doldurulması gerekli zorunlu alanlar bulunmaktadır. (" + errorMessage + ")"}
                    type="error"
                    showIcon
                  />
                ) : null}
              </div>
              <div style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
                <Button key="cancel" onClick={handleModalToggle}>
                  İptal
                </Button>
                <Button key="submit" type="primary" disabled={disabled} onClick={methods.handleSubmit(onSubmited)}>
                  Tamam
                </Button>
              </div>
            </div>,
          ]}
        >
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <Forms isModalOpen={isModalOpen} selectedRows={selectedRows} />
            {/* <Text>{errorMessage}</Text> */}
            {/* <Alert
              style={{ fontWeight: 500, color: "red", marginTop: "10px", marginBottom: "10px" }}
              message={errorMessage}
              // description="This is some important information."
              type="error"
              showIcon
            /> */}
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
