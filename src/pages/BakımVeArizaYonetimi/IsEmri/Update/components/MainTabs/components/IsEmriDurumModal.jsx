import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Checkbox, message, Input } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { Controller, set, useFormContext } from "react-hook-form";
import DurumSelect from "./DurumSelect";

const { TextArea } = Input;

export default function IsEmriDurumModal({ workshopSelectedId, onSubmit, fieldRequirements }) {
  const { control, watch, setValue } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetIsTalepKullaniciList`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_IS_TALEBI_KULLANICI_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
      setValue("isEmriDurum1ID", "");
      setValue("isEmriDurum1", null);
      setValue("varsayilanDurum", false);
      setValue("isEmriDurumAciklama", "");
    }
  };
  const isEmriDurum1 = watch("isEmriDurum1");
  const isEmriDurum1ID = watch("isEmriDurum1ID");

  const handleModalOk = async () => {
    // isEmriDurum1 ve isEmriDurum1ID değerlerinin kontrolü
    if (!isEmriDurum1 || !isEmriDurum1ID) {
      // Eğer bu değerlerden herhangi biri geçersiz ise, kullanıcıya bir uyarı mesajı göster
      messageApi.open({
        type: "error",
        content: "Durum boş bırakılamaz!",
      });
      // Modalın kapanmasını engelle
      return;
    }

    // API'ye gönderilecek veri
    const payload = {
      ISL_ISEMRI_ID: watch("secilenIsEmriID"),
      ISL_DURUM_ESKI_KOD_ID: watch("isEmriDurumID"),
      ISL_DURUM_YENI_KOD_ID: isEmriDurum1ID,
      ISL_ACIKLAMA: watch("isEmriDurumAciklama"),
      ISL_ISLEM: "İş emri durum bilgisi değişti.",
    };

    try {
      // API'ye POST isteği gönder
      const response = await AxiosInstance.post("AddIsEmriDurumDegisikligi", payload);
      if (response.status_code === 200) {
        // Başarılı bildirimi
        messageApi.open({
          type: "success",
          content: "Veriler başarıyla gönderildi!",
        });
        setIsModalVisible(false); // Modalı kapat
      } else {
        // Hata bildirimi
        messageApi.open({
          type: "error",
          content: "Veriler gönderilirken bir sorun oluştu.",
        });
      }
    } catch (error) {
      console.error("API isteği sırasında bir hata oluştu:", error);
      messageApi.open({
        type: "error",
        content: "Veriler gönderilirken bir hata oluştu!",
      });
    }

    // Değerler geçerli ise, seçilen veriyi işle
    setValue("isEmriDurumID", isEmriDurum1ID);
    setValue("isEmriDurum", isEmriDurum1);

    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    // Modalı kapat
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // Checkbox değiştiğinde yapılacak işlem
  const handleCheckboxChange = async (isChecked) => {
    if (isEmriDurum1ID) {
      try {
        // API isteğini yap
        const response = await AxiosInstance.get(
          `IsEmriDurumVarsayilanYap?kodId=${isEmriDurum1ID}&isVarsayilan=${isChecked}`
        );
        // İsteğin başarılı olduğunu kontrol et
        if (response && response.status_code === 200) {
          // Başarılı işlem mesajı veya başka bir işlem yap
          messageApi.open({
            type: "success",
            content: "İşlem Başarılı!", // Using the success message from API response
          });
          console.log("İşlem başarılı.");
        } else {
          messageApi.open({
            type: "error",
            content: "İşlem Başarısız!", // Using the error message from API response
          });
          // Hata mesajı göster
          console.error("Bir hata oluştu.");
        }
      } catch (error) {
        // Hata yakalama
        console.error("API isteği sırasında bir hata oluştu:", error);
      }
    } else {
      console.error("isEmriDurumID değeri bulunamadı.");
    }
  };

  return (
    <div>
      {contextHolder}
      <Button onClick={handleModalToggle}> + </Button>
      <Modal width={500} centered title="Durum" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "430px",
            marginBottom: "10px",
          }}>
          <DurumSelect fieldRequirements={fieldRequirements} />
          <div>
            <Controller
              name="varsayilanDurum"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    field.onChange(isChecked); // React Hook Form state'ini güncelle
                    handleCheckboxChange(isChecked); // API'ye istek göndermek için fonksiyonu çağır
                  }}>
                  Varsayılan
                </Checkbox>
              )}
            />
          </div>
        </div>
        <Controller
          name="isEmriDurumAciklama"
          control={control}
          render={({ field }) => <TextArea {...field} rows={4} />}
        />
      </Modal>
    </div>
  );
}
