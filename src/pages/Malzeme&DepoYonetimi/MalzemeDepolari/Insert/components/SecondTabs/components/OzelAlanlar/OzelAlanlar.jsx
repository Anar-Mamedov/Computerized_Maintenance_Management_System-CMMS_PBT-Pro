import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Typography, message, InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";
import { t } from "i18next";

const { Text } = Typography;

function OzelAlanlar(props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clickedField, setClickedField] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [customFieldNames, setCustomFieldNames] = useState([]);

  const showModal = (field) => {
    setClickedField(field);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const Body = {
      [clickedField]: inputValue,
      OZL_FORM: "GİRİŞ FİŞİ",
    };

    AxiosInstance.post("OzelAlanTopicGuncelle", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        setIsModalVisible(false);
        setInputValue("");
        nameOfField(); // Refresh the field names
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });

    console.log({ Body });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputValue("");
  };

  const nameOfField = async () => {
    try {
      const response = await AxiosInstance.get(`OzelAlan?form=DEPO`);
      setCustomFieldNames(response);
    } catch (error) {
      console.error("API request failed: ", error);
    }
  };

  useEffect(() => {
    nameOfField();
  }, []);

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_1")}>
            {customFieldNames?.OZL_OZEL_ALAN_1 || t("ozelAlan1")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller name="ozelAlan1" control={control} render={({ field }) => <Input {...field} style={{ flex: 1 }} />} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_2")}>
            {customFieldNames?.OZL_OZEL_ALAN_2 || t("ozelAlan2")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller name="ozelAlan2" control={control} render={({ field }) => <Input {...field} style={{ flex: 1 }} />} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_3")}>
            {customFieldNames?.OZL_OZEL_ALAN_3 || t("ozelAlan3")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller name="ozelAlan3" control={control} render={({ field }) => <Input {...field} style={{ flex: 1 }} />} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_4")}>
            {customFieldNames?.OZL_OZEL_ALAN_4 || t("ozelAlan4")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller name="ozelAlan4" control={control} render={({ field }) => <Input {...field} style={{ flex: 1 }} />} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_5")}>
            {customFieldNames?.OZL_OZEL_ALAN_5 || t("ozelAlan5")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller name="ozelAlan5" control={control} render={({ field }) => <Input {...field} style={{ flex: 1 }} />} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_6")}>
            {customFieldNames?.OZL_OZEL_ALAN_6 || t("ozelAlan6")}:
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <KodIDSelectbox name1="ozelAlan6" isRequired={false} kodID="988" />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_7")}>
            {customFieldNames?.OZL_OZEL_ALAN_7 || t("ozelAlan7")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <KodIDSelectbox name1="ozelAlan7" isRequired={false} kodID="989" />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_8")}>
            {customFieldNames?.OZL_OZEL_ALAN_8 || t("ozelAlan8")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <KodIDSelectbox name1="ozelAlan8" isRequired={false} kodID="990" />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_9")}>
            {customFieldNames?.OZL_OZEL_ALAN_9 || t("ozelAlan9")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller name="ozelAlan9" control={control} render={({ field }) => <InputNumber {...field} style={{ flex: 1 }} />} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "450px", gap: "10px", rowGap: "0px" }}>
          <Text style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_10")}>
            {customFieldNames?.OZL_OZEL_ALAN_10 || t("ozelAlan10")}:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
            <Controller name="ozelAlan10" control={control} render={({ field }) => <InputNumber {...field} style={{ flex: 1 }} />} />
          </div>
        </div>
      </div>
      <Modal title="Özel Alan Girişi" open={isModalVisible} centered onOk={handleOk} onCancel={handleCancel}>
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Değer giriniz" />
      </Modal>
    </div>
  );
}

export default OzelAlanlar;
