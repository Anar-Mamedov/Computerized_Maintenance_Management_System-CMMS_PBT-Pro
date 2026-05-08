import React, { useState } from "react";
import { message, Modal, Typography } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../api/http";
import { FormProvider, useForm } from "react-hook-form";
import AcilisNedeni from "./IsEmriAcma/AcilisNedeni.jsx";
import DurumSelect from "./IsEmriAcma/DurumSelect.jsx";
import MenuItem from "./MenuItem";

const { Text } = Typography;

export default function IsEmriSilme({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      acilisNedeniID: "",
      acilisNedeni: null,
      personelTanim: "",
      isEmriDurum1ID: "",
      isEmriDurum1: null,
      // Add other default values here
    },
  });

  const { reset } = methods;
  const acilisNedeniID = methods.watch("acilisNedeniID");
  const isEmriDurum1ID = methods.watch("isEmriDurum1ID");
  const isSubmitDisabled = !acilisNedeniID || !isEmriDurum1ID;

  // Modalı açma ve kapama işlevi
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
    }
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    if (!data.acilisNedeniID || !data.isEmriDurum1ID) {
      message.error("Alan Boş Bırakılamaz");
      return;
    }

    // If selectedRows contains only one row
    const row = selectedRows[0];

    const Body = {
      TB_ISEMRI_ID: row.key,
      DURUM_KOD_ID: data.isEmriDurum1ID,
      NEDEN_KOD_ID: data.acilisNedeniID,
    };

    AxiosInstance.post(`IsEmriOpen`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
          reset();
          setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
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
        message.error("Başarısız Olundu.");
      });

    console.log({ Body });
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <MenuItem
          icon={<PlayCircleOutlined />}
          title="İş Emrini Aç"
          description="Kapalı iş emrini yeniden aç."
          onClick={handleModalToggle}
        />

        <Modal
          width="500px"
          title="Seçili İş Emrini Aç"
          destroyOnClose
          centered
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}
          okButtonProps={{ disabled: isSubmitDisabled }}
        >
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: 700 }}>Açılış Nedeni:</Text>
              <AcilisNedeni />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: 700 }}>Yeni Durum:</Text>
              <DurumSelect />
            </div>
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
