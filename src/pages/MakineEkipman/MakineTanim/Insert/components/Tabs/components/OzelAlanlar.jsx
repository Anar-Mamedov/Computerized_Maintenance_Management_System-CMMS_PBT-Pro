import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Typography, message, InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
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
      OZL_FORM: "MAKINE",
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
      const response = await AxiosInstance.get(`OzelAlan?form=MAKINE`);
      setCustomFieldNames(response);
    } catch (error) {
      console.error("API request failed: ", error);
    }
  };

  useEffect(() => {
    nameOfField();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        backgroundColor: "#ffffff",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #D9D4D5",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        maxWidth: "632px",
      }}
    >
      <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("ozelAlanlar")}</Text>
        <Text type="secondary">{t("kullaniminaGoreOzellestirilebilirOzelAlanlar")}</Text>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_1")}>
              {customFieldNames?.OZL_OZEL_ALAN_1 || t("ozelAlan1")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan1" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_2")}>
              {customFieldNames?.OZL_OZEL_ALAN_2 || t("ozelAlan2")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan2" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_3")}>
              {customFieldNames?.OZL_OZEL_ALAN_3 || t("ozelAlan3")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan3" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_4")}>
              {customFieldNames?.OZL_OZEL_ALAN_4 || t("ozelAlan4")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan4" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_5")}>
              {customFieldNames?.OZL_OZEL_ALAN_5 || t("ozelAlan5")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan5" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_6")}>
              {customFieldNames?.OZL_OZEL_ALAN_6 || t("ozelAlan6")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan6" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_7")}>
              {customFieldNames?.OZL_OZEL_ALAN_7 || t("ozelAlan7")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan7" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_8")}>
              {customFieldNames?.OZL_OZEL_ALAN_8 || t("ozelAlan8")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan8" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_9")}>
              {customFieldNames?.OZL_OZEL_ALAN_9 || t("ozelAlan9")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan9" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_10")}>
              {customFieldNames?.OZL_OZEL_ALAN_10 || t("ozelAlan10")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan10" control={control} render={({ field }) => <Input {...field} style={{ width: "100%" }} />} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_11")}>
              {customFieldNames?.OZL_OZEL_ALAN_11 || t("ozelAlan11")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <KodIDSelectbox name1="ozelAlan11" isRequired={false} kodID="32530" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_12")}>
              {customFieldNames?.OZL_OZEL_ALAN_12 || t("ozelAlan12")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <KodIDSelectbox name1="ozelAlan12" isRequired={false} kodID="32531" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_13")}>
              {customFieldNames?.OZL_OZEL_ALAN_13 || t("ozelAlan13")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <KodIDSelectbox name1="ozelAlan13" isRequired={false} kodID="32532" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_14")}>
              {customFieldNames?.OZL_OZEL_ALAN_14 || t("ozelAlan14")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <KodIDSelectbox name1="ozelAlan14" isRequired={false} kodID="32533" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_15")}>
              {customFieldNames?.OZL_OZEL_ALAN_15 || t("ozelAlan15")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <KodIDSelectbox name1="ozelAlan15" isRequired={false} kodID="32534" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_16")}>
              {customFieldNames?.OZL_OZEL_ALAN_16 || t("ozelAlan16")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan16" control={control} render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_17")}>
              {customFieldNames?.OZL_OZEL_ALAN_17 || t("ozelAlan17")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan17" control={control} render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_18")}>
              {customFieldNames?.OZL_OZEL_ALAN_18 || t("ozelAlan18")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan18" control={control} render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_19")}>
              {customFieldNames?.OZL_OZEL_ALAN_19 || t("ozelAlan19")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan19" control={control} render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Text type="secondary" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => showModal("OZL_OZEL_ALAN_20")}>
              {customFieldNames?.OZL_OZEL_ALAN_20 || t("ozelAlan20")}
            </Text>
            <div style={{ width: "100%", maxWidth: "300px", minWidth: "300px" }}>
              <Controller name="ozelAlan20" control={control} render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />} />
            </div>
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
