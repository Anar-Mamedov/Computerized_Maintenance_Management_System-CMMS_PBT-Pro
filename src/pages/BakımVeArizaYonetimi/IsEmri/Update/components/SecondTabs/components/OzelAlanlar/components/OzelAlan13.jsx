import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Typography } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function OzelAlan13() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için
  const [refreshData, setRefreshData] = useState(false);
  const methods = useForm({
    defaultValues: {
      ozelAlan: "",
      // Add other default values here
    },
  });
  const { setValue, reset, handleSubmit } = methods;

  const onSubmited = (data) => {
    const Body = {
      OZL_OZEL_ALAN_13: data.ozelAlan,
      OZL_FORM: "ISEMRI",
      // TB_OZEL_ALAN_ID: 1,
    };

    AxiosInstance.post("OzelAlanTopicGuncelle", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setRefreshData((prev) => !prev); // refreshData değerini değiştirerek useEffect'i tetikle
        setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log({ Body });
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      reset();
    }
  };

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI"); // API URL'niz
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [refreshData]); // refreshData değiştiğinde useEffect'i yeniden çalıştır

  return (
    <FormProvider {...methods}>
      <Button type="submit" onClick={handleModalToggle}>
        {label.OZL_OZEL_ALAN_13}
      </Button>
      <Modal
        title="Özel Alan İsmi Güncelle"
        open={isModalOpen}
        onOk={methods.handleSubmit(onSubmited)}
        onCancel={handleModalToggle}>
        <form onSubmit={methods.handleSubmit(onSubmited)}>
          <div>
            <Controller name="ozelAlan" control={methods.control} render={({ field }) => <Input {...field} />} />
          </div>
        </form>
      </Modal>
    </FormProvider>
  );
}
