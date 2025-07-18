import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Checkbox, message } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { Controller, useFormContext } from "react-hook-form";
import DurumSelect from "./DurumSelect";

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
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
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
    // React Hook Form'dan isEmriDurumID değerini izle
    const isEmriDurumID = watch("isEmriDurumID");

    if (isEmriDurumID) {
      try {
        // API isteğini yap
        const response = await AxiosInstance.get(
          `IsEmriDurumVarsayilanYap?kodId=${isEmriDurumID}&isVarsayilan=${isChecked}`
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
      </Modal>
    </div>
  );
}
