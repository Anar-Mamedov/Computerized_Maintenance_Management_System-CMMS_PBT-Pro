// EditModal.js
import React from "react";
import { Modal, message } from "antd";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../../../../../api/http";

const EditModal = ({ isModalVisible, onModalClose, selectedFile }) => {
  const methods = useForm({
    defaultValues: {
      siraNo: "",
      secilenID: "",
      isTanimi: "",
      yapildi: false,
      atolyeTanim: "",
      atolyeID: "",
      personelTanim: "",
      personelID: "",
      baslangicTarihi: "",
      baslangicSaati: "",
      vardiya: "",
      vardiyaID: "",
      bitisTarihi: "",
      bitisSaati: "",
      sure: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmited = (data) => {
    const Body = {
      TB_ISEMRI_KONTROLLIST_ID: data.secilenID,
      DKN_SIRANO: data.siraNo,
      DKN_YAPILDI: data.yapildi,
      DKN_TANIM: data.isTanimi,
      // DKN_MALIYET: data.maliyet, // Maliyet diye bir alan yok frontda
      DKN_YAPILDI_PERSONEL_ID: data.personelID,
      DKN_YAPILDI_ATOLYE_ID: data.atolyeID,
      DKN_YAPILDI_SURE: data.sure,
      DKN_ACIKLAMA: data.aciklama,
      DKN_YAPILDI_KOD_ID: -1,
      DKN_REF_ID: -1,
      DKN_YAPILDI_TARIH: formatDateWithDayjs(data.baslangicTarihi),
      DKN_YAPILDI_SAAT: formatTimeWithDayjs(data.baslangicSaati),
      DKN_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
      DKN_BITIS_SAAT: formatTimeWithDayjs(data.bitisSaati),
      DKN_YAPILDI_MESAI_KOD_ID: data.vardiyaID,
    };

    AxiosInstance.post(`AddUpdateIsEmriKontrolList?isEmriId=1`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          onModalClose(); // Modal'ı kapat
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

  const handleCancel = () => {
    onModalClose(); // Call the onModalClose function to close the modal
  };
  return (
    // In EditModal.js
    <FormProvider {...methods}>
      <div>
        <Modal
          title="Dosya Detayları"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleCancel} // Pass the handleCancel function to the onCancel prop
        >
          {/* Display details about the selected file */}
          <p>{selectedFile ? selectedFile.name : ""}</p>
          <a href={selectedFile ? selectedFile.url : "#"} target="_blank" rel="noopener noreferrer">
            Dosyayı İndir
          </a>
        </Modal>
      </div>
    </FormProvider>
  );
};

export default EditModal;
