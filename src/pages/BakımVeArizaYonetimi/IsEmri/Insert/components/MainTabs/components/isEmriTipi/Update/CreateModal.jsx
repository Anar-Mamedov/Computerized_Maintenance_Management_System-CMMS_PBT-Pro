import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";
import EditTabs from "./SecondTabs/EditTabs";
import dayjs from "dayjs";

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenPersonelID, selectedRow }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      belgeNo: "",
      secilenID: "",
      sertifikaTipi: null,
      sertifikaTipiID: "",
      verilisTarihi: "",
      bitisTarihi: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("belgeNo", selectedRow.PSE_BELGE_NO);
      setValue("sertifikaTipi", selectedRow.PSE_SERTIFIKA_TIP);
      setValue("sertifikaTipiID", selectedRow.PSE_SERTIFIKA_TIP_KOD_ID);
      setValue("verilisTarihi", dayjs(selectedRow.PSE_VERILIS_TARIH));
      setValue("bitisTarihi", dayjs(selectedRow.PSE_BITIS_TARIH));
      setValue("aciklama", selectedRow.PSE_ACIKLAMA);
    }
  }, [selectedRow, isModalVisible, setValue]);

  useEffect(() => {
    if (!isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      PSE_PERSONEL_ID: secilenPersonelID,
      PSE_BELGE_NO: data.belgeNo,
      PSE_SERTIFIKA_TIP_KOD_ID: data.sertifikaTipiID,
      PSE_VERILIS_TARIH: formatDateWithDayjs(data.verilisTarihi),
      PSE_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
      PSE_ACIKLAMA: data.aciklama,
      PSE_OLUSTURAN_ID: 24,
    };

    AxiosInstance.post("AddPersonelSertifika", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
        onRefresh();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log({ Body });
  };

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
    }
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  const handleSelectedRow = (selectedRowData) => {
    // Burada, tıklanan satırın verisini işleyebilirsiniz.
    // Örneğin, form alanlarını doldurmak veya başka bir işlem yapmak için kullanabilirsiniz.
    console.log("Seçilen satır:", selectedRowData);
    setValue("secilenID", selectedRowData.key);
  };

  return (
    <FormProvider {...methods}>
      <div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
          <Button
            style={{
              width: "32px",
              height: "32px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleModalToggle}>
            <PlusOutlined />
          </Button>
        </div>

        <Modal
          width="800px"
          title="İş Emri Tipi"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}>
          <div style={{ display: "flex" }}>
            <MainTabs onSelectedRow={handleSelectedRow} />
            <form onSubmit={methods.handleSubmit(onSubmited)}>
              <EditTabs selectedRow={selectedRow} />
            </form>
          </div>
        </Modal>
      </div>
    </FormProvider>
  );
}
